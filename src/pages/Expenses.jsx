import { useEffect, useState } from 'react';
import API from '../api/axios';
import ExpenseForm from '../components/ExpenseForm';

const CATEGORIES = ['', 'food', 'transport', 'shopping', 'entertainment', 'health', 'utilities', 'salary', 'other'];

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ category: '', startDate: '', endDate: '', sortBy: 'date', order: 'desc' });
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchExpenses = async () => {
    const params = { ...filters, page, limit: 10 };
    const { data } = await API.get('/expenses', { params });
    setExpenses(data.expenses);
    setTotal(data.total);
    setPages(data.pages);
  };

  useEffect(() => { fetchExpenses(); }, [page, filters]);

  const handleCreate = async (form) => {
    await API.post('/expenses', form);
    setShowForm(false);
    fetchExpenses();
  };

  const handleUpdate = async (form) => {
    await API.put(`/expenses/${editing._id}`, form);
    setEditing(null);
    fetchExpenses();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this expense?')) {
      await API.delete(`/expenses/${id}`);
      fetchExpenses();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Expenses ({total})</h2>
        <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>+ Add Expense</button>
      </div>

      {showForm && (
        <div style={styles.formBox}>
          <ExpenseForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </div>
      )}

      <div style={styles.filters}>
        <select style={styles.input} value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c || 'All Categories'}</option>)}
        </select>
        <input style={styles.input} type="date" value={filters.startDate} onChange={e => setFilters({ ...filters, startDate: e.target.value })} />
        <input style={styles.input} type="date" value={filters.endDate} onChange={e => setFilters({ ...filters, endDate: e.target.value })} />
        <select style={styles.input} value={filters.sortBy} onChange={e => setFilters({ ...filters, sortBy: e.target.value })}>
          <option value="date">Sort by Date</option>
          <option value="amount">Sort by Amount</option>
        </select>
        <select style={styles.input} value={filters.order} onChange={e => setFilters({ ...filters, order: e.target.value })}>
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      <table style={styles.table}>
        <thead>
          <tr style={styles.thead}>
            <th>Title</th><th>Amount</th><th>Category</th><th>Date</th><th>Note</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(exp => (
            <tr key={exp._id} style={styles.row}>
              <td>{exp.title}</td>
              <td>₹{exp.amount}</td>
              <td>{exp.category}</td>
              <td>{new Date(exp.date).toLocaleDateString()}</td>
              <td>{exp.note || '-'}</td>
              <td>
                <button style={styles.editBtn} onClick={() => setEditing(exp)}>Edit</button>
                <button style={styles.delBtn} onClick={() => handleDelete(exp._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editing && (
        <div style={styles.modal}>
          <div style={styles.modalBox}>
            <h3>Edit Expense</h3>
            <ExpenseForm initial={editing} onSubmit={handleUpdate} onCancel={() => setEditing(null)} />
          </div>
        </div>
      )}

      <div style={styles.pagination}>
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={styles.pageBtn}>Prev</button>
        <span> Page {page} of {pages} </span>
        <button disabled={page === pages} onClick={() => setPage(p => p + 1)} style={styles.pageBtn}>Next</button>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  addBtn: { background: '#3b82f6', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer' },
  formBox: { background: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  filters: { display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' },
  input: { padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  thead: { background: '#1e293b', color: '#fff' },
  row: { borderBottom: '1px solid #e2e8f0', textAlign: 'center' },
  editBtn: { background: '#f59e0b', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '6px' },
  delBtn: { background: '#ef4444', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' },
  modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  modalBox: { background: '#fff', padding: '24px', borderRadius: '12px', width: '400px' },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '16px' },
  pageBtn: { padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer' },
};

export default Expenses;

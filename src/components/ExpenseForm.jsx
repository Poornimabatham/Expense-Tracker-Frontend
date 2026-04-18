import { useState } from 'react';

const CATEGORIES = ['food', 'transport', 'shopping', 'entertainment', 'health', 'utilities', 'salary', 'other'];

const ExpenseForm = ({ onSubmit, initial = {}, onCancel }) => {
  const [form, setForm] = useState({
    title: initial.title || '',
    amount: initial.amount || '',
    category: initial.category || 'food',
    date: initial.date ? initial.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
    note: initial.note || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input style={styles.input} placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
      <input style={styles.input} placeholder="Amount" type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
      <select style={styles.input} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <input style={styles.input} type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
      <input style={styles.input} placeholder="Note (optional)" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
      <div style={{ display: 'flex', gap: '8px' }}>
        <button style={styles.btn} type="submit">Save</button>
        {onCancel && <button style={styles.cancelBtn} type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
};

const styles = {
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  input: { padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' },
  btn: { flex: 1, padding: '10px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  cancelBtn: { flex: 1, padding: '10px', background: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer' },
};

export default ExpenseForm;

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import API from '../api/axios';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

const Dashboard = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    API.get('/expenses/summary').then(({ data }) => setSummary(data));
  }, []);

  if (!summary) return <p style={{ padding: '24px' }}>Loading...</p>;

  return (
    <div style={styles.container}>
      <h2>Dashboard</h2>
      <div style={styles.cards}>
        <div style={styles.card}>
          <p style={styles.label}>This Month</p>
          <h3 style={styles.value}>₹{summary.totalThisMonth}</h3>
        </div>
        <div style={styles.card}>
          <p style={styles.label}>This Year</p>
          <h3 style={styles.value}>₹{summary.totalThisYear}</h3>
        </div>
        <div style={styles.card}>
          <p style={styles.label}>Top Category</p>
          <h3 style={styles.value}>{summary.highestCategory || 'N/A'}</h3>
        </div>
      </div>
      <div style={styles.charts}>
        <div style={styles.chartBox}>
          <h4>Spending by Category (Pie)</h4>
          <PieChart width={300} height={250}>
            <Pie data={summary.byCategory} dataKey="total" nameKey="_id" cx="50%" cy="50%" outerRadius={90} label>
              {summary.byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
        <div style={styles.chartBox}>
          <h4>Spending by Category (Bar)</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={summary.byCategory}>
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '24px' },
  cards: { display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' },
  card: { background: '#fff', padding: '20px', borderRadius: '12px', minWidth: '160px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', flex: 1 },
  label: { color: '#64748b', margin: 0, fontSize: '14px' },
  value: { margin: '8px 0 0', fontSize: '24px', color: '#1e293b' },
  charts: { display: 'flex', gap: '24px', flexWrap: 'wrap' },
  chartBox: { background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', flex: 1, minWidth: '300px' },
};

export default Dashboard;

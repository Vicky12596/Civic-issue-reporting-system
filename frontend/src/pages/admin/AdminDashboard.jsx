import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

const STATUSES = ['PENDING', 'VERIFIED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [issues, setIssues] = useState([]);

  const load = () => {
    api.get('/admin/dashboard-stats').then((res) => setStats(res.data)).catch(() => {});
    api.get('/issues').then((res) => setIssues(res.data)).catch(() => {});
  };

  useEffect(load, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/issues/${id}/status`, { status });
      toast.success('Status updated');
      load();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this report permanently?')) return;
    await api.delete(`/issues/${id}`);
    load();
  };

  return (
    <div className="container py-4">
      <h2 className="h4 mb-3">Admin dashboard</h2>

      {stats && (
        <div className="row g-3 mb-4">
          {[
            ['Total users', stats.totalUsers],
            ['Total reports', stats.totalReports],
            ['Pending reports', stats.pendingReports],
            ['Resolved reports', stats.resolvedReports],
          ].map(([label, value]) => (
            <div className="col-md-3" key={label}>
              <div className="card card-civic p-3 text-center">
                <div className="h3 mb-0">{value}</div>
                <div className="text-muted small">{label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card card-civic p-3">
        <h6 className="mb-3">All reports</h6>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead><tr><th>Title</th><th>Category</th><th>Status</th><th>Priority</th><th>Upvotes</th><th>Actions</th></tr></thead>
            <tbody>
              {issues.map((i) => (
                <tr key={i.id}>
                  <td>{i.title}</td>
                  <td>{i.category.replace(/_/g, ' ')}</td>
                  <td><StatusBadge status={i.status} /></td>
                  <td>{i.priority}</td>
                  <td>{i.upvoteCount}</td>
                  <td className="d-flex gap-2">
                    <select className="form-select form-select-sm" style={{ width: 140 }}
                      defaultValue={i.status} onChange={(e) => updateStatus(i.id, e.target.value)}>
                      {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                    </select>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => remove(i.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

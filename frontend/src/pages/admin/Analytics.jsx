import React, { useEffect, useMemo, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import api from '../../services/api';

/** Client-side aggregation of issue data into the charts requested in the spec. */
export default function Analytics() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    api.get('/issues').then((res) => setIssues(res.data)).catch(() => {});
  }, []);

  const byCategory = useMemo(() => {
    const counts = {};
    issues.forEach((i) => { counts[i.category] = (counts[i.category] || 0) + 1; });
    return counts;
  }, [issues]);

  const byStatus = useMemo(() => {
    const counts = {};
    issues.forEach((i) => { counts[i.status] = (counts[i.status] || 0) + 1; });
    return counts;
  }, [issues]);

  const byCity = useMemo(() => {
    const counts = {};
    issues.forEach((i) => { if (i.city) counts[i.city] = (counts[i.city] || 0) + 1; });
    return counts;
  }, [issues]);

  const resolvedCount = issues.filter((i) => i.status === 'RESOLVED' || i.status === 'CLOSED').length;
  const resolutionRate = issues.length ? Math.round((resolvedCount / issues.length) * 100) : 0;

  return (
    <div className="container py-4">
      <h2 className="h4 mb-3">Analytics</h2>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card card-civic p-3 text-center">
            <div className="h3 mb-0">{resolutionRate}%</div>
            <div className="text-muted small">Resolution rate</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card card-civic p-3 text-center">
            <div className="h3 mb-0">{Object.entries(byCity).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'}</div>
            <div className="text-muted small">Most reported area</div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <div className="card card-civic p-3">
            <h6>Category-wise reports</h6>
            <Bar data={{
              labels: Object.keys(byCategory).map((k) => k.replace(/_/g, ' ')),
              datasets: [{ label: 'Reports', data: Object.values(byCategory), backgroundColor: '#0B4F6C' }],
            }} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="card card-civic p-3">
            <h6>Status distribution</h6>
            <Doughnut data={{
              labels: Object.keys(byStatus),
              datasets: [{ data: Object.values(byStatus), backgroundColor: ['#9AA5AD', '#1B998B', '#6C7FC9', '#E8A33D', '#3E9C5C', '#4A4E52', '#C6473C'] }],
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import api from '../services/api';
import MapView from '../components/MapView';
import IssueCard from '../components/IssueCard';

const CATEGORIES = ['ROAD_DAMAGE', 'GARBAGE_COLLECTION', 'WATER_LEAKAGE', 'STREET_LIGHT_FAILURE',
  'DRAINAGE_PROBLEM', 'TRAFFIC_SIGNAL_ISSUE', 'PUBLIC_TOILET_ISSUE', 'ILLEGAL_DUMPING', 'OTHER'];
const STATUSES = ['PENDING', 'VERIFIED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export default function MapPage() {
  const [issues, setIssues] = useState([]);
  const [filters, setFilters] = useState({ category: '', status: '', priority: '', search: '' });

  const load = () => {
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    api.get('/issues', { params }).then((res) => setIssues(res.data)).catch(() => {});
  };

  useEffect(load, [filters]);

  return (
    <div className="container py-4">
      <h2 className="h4 mb-3">Explore reported issues</h2>
      <div className="row g-2 mb-3">
        <div className="col-md-3">
          <input className="form-control" placeholder="Search by title…"
            onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
        </div>
        <div className="col-md-3">
          <select className="form-select" onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
            <option value="">All categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select" onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select" onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
            <option value="">All priorities</option>
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <MapView issues={issues} />

      <div className="row g-3 mt-1">
        {issues.map((issue) => <div className="col-md-4" key={issue.id}><IssueCard issue={issue} /></div>)}
      </div>
    </div>
  );
}

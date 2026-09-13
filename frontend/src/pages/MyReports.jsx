import React, { useEffect, useState } from 'react';
import api from '../services/api';
import IssueCard from '../components/IssueCard';

export default function MyReports() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    api.get('/issues/my-reports').then((res) => setIssues(res.data)).catch(() => {});
  }, []);

  return (
    <div className="container py-4">
      <h2 className="h4 mb-3">My reports</h2>
      {issues.length === 0 && <p className="text-muted">You haven't reported any issues yet.</p>}
      <div className="row g-3">
        {issues.map((issue) => <div className="col-md-4" key={issue.id}><IssueCard issue={issue} /></div>)}
      </div>
    </div>
  );
}

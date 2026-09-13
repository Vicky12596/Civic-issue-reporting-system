import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';

export default function IssueCard({ issue }) {
  return (
    <div className="card card-civic h-100">
      {issue.imageUrls?.[0] && (
        <img src={issue.imageUrls[0]} className="card-img-top" alt={issue.title} style={{ height: 160, objectFit: 'cover' }} />
      )}
      <div className="card-body d-flex flex-column">
        <div className="mb-2">
          <StatusBadge status={issue.status} /> <PriorityBadge priority={issue.priority} />
        </div>
        <h5 className="card-title">{issue.title}</h5>
        <p className="card-text text-truncate">{issue.description}</p>
        <p className="text-muted small mb-2">{issue.city || issue.address}</p>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <span className="small text-muted">▲ {issue.upvoteCount} upvotes</span>
          <Link to={`/issues/${issue.id}`} className="btn btn-sm btn-civic-outline">View details</Link>
        </div>
      </div>
    </div>
  );
}

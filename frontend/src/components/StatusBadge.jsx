import React from 'react';

export default function StatusBadge({ status }) {
  return <span className={`badge badge-status-${status} me-1`}>{status.replace('_', ' ')}</span>;
}

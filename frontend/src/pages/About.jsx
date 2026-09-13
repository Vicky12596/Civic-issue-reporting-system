import React from 'react';

export default function About() {
  return (
    <div className="container py-5" style={{ maxWidth: 720 }}>
      <h2 className="h4 mb-3">About CivicConnect</h2>
      <p>
        CivicConnect is a crowdsourced platform that lets citizens report civic issues —
        road damage, garbage collection, water leakage, and more — directly to local
        authorities, track their resolution, and rally community support through voting
        and comments.
      </p>
      <p>
        Every report is plotted on a live map, routed to the right department, and
        followed through a transparent status timeline from Pending to Resolved.
      </p>
    </div>
  );
}

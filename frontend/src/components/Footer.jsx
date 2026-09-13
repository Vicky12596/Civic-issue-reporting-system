import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-5 py-4 border-top" style={{ borderColor: 'var(--cc-border)' }}>
      <div className="container d-flex flex-wrap justify-content-between small text-muted">
        <span>&copy; {new Date().getFullYear()} CivicConnect. Built for stronger neighborhoods.</span>
        <span>
          <Link to="/about" className="text-muted me-3">About</Link>
          <Link to="/contact" className="text-muted">Contact</Link>
        </span>
      </div>
    </footer>
  );
}

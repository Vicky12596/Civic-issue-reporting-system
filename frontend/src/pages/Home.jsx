import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import IssueCard from '../components/IssueCard';
import MapView from '../components/MapView';

export default function Home() {
  const { t } = useTranslation();
  const [trending, setTrending] = useState([]);
  const [issues, setIssues] = useState([]);

useEffect(() => {
    const loadIssues = async () => {
        try {
            const [trendingRes, issuesRes] = await Promise.all([
                api.get("/issues/trending"),
                api.get("/issues")
            ]);

            const trendingData = Array.isArray(trendingRes.data)
                ? trendingRes.data
                : [];

            const issuesData = Array.isArray(issuesRes.data)
                ? issuesRes.data
                : [];

            setTrending(trendingData);
            setIssues(issuesData);
        } catch (error) {
            console.error("Failed to load issues:", error);
            setTrending([]);
            setIssues([]);
        }
    };

    loadIssues();
}, []);

  return (
    <div className="container py-4">
      <div className="p-5 mb-4 rounded-3 card-civic text-center">
        <h1 className="brand-font display-5 fw-bold" style={{ color: 'var(--cc-navy)' }}>{t('appName')}</h1>
        <p className="lead">{t('tagline')}</p>
        <Link to="/report" className="btn btn-civic btn-lg mt-2">{t('reportIssue')}</Link>
      </div>

      <h2 className="h4 mb-3">Live issue map</h2>
      <MapView issues={issues} />

      <h2 className="h4 mt-5 mb-3">Trending issues</h2>
      <div className="row g-3">
        {trending.length === 0 && <p className="text-muted">No trending issues yet — be the first to report one.</p>}
        {trending.map((issue) => (
          <div className="col-md-4" key={issue.id}><IssueCard issue={issue} /></div>
        ))}
      </div>
    </div>
  );
}

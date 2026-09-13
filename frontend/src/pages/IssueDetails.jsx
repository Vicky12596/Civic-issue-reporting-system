import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import { useAuth } from '../context/AuthContext';

const TIMELINE_STEPS = ['PENDING', 'VERIFIED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

export default function IssueDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  const load = () => {
    api.get(`/issues/${id}`).then((res) => setIssue(res.data)).catch(() => {});
    api.get(`/issues/${id}/comments`).then((res) => setComments(res.data)).catch(() => {});
  };

  useEffect(load, [id]);

  const vote = async () => {
    if (!user) return toast.info('Log in to vote on issues');
    await api.post(`/issues/${id}/vote`);
    load();
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    await api.post(`/issues/${id}/comments`, { content: commentText });
    setCommentText('');
    load();
  };

  if (!issue) return <div className="container py-4">Loading…</div>;

  const currentStepIndex = TIMELINE_STEPS.indexOf(issue.status);

  return (
    <div className="container py-4">
      <div className="card card-civic p-4 mb-4">
        <div className="mb-2"><StatusBadge status={issue.status} /> <PriorityBadge priority={issue.priority} /></div>
        <h2 className="h4">{issue.title}</h2>
        <p className="text-muted">{issue.category.replace(/_/g, ' ')} · Reported by {issue.reporterName}</p>
        <p>{issue.description}</p>
        <p className="text-muted small">{issue.address}, {issue.city}</p>

        <div className="d-flex gap-2 flex-wrap my-2">
          {issue.imageUrls?.map((url) => (
            <img key={url} src={url} alt="issue" style={{ width: 140, height: 140, objectFit: 'cover', borderRadius: 6 }} />
          ))}
        </div>

        <button className={`btn btn-sm ${issue.upvotedByCurrentUser ? 'btn-civic' : 'btn-civic-outline'} w-auto`} onClick={vote}>
          ▲ {issue.upvoteCount} upvotes
        </button>

        {issue.status !== 'REJECTED' && (
          <div className="mt-4">
            <h6>Progress timeline</h6>
            <div className="d-flex">
              {TIMELINE_STEPS.map((step, i) => (
                <div key={step} className="text-center flex-fill">
                  <div
                    className="rounded-circle mx-auto mb-1"
                    style={{
                      width: 20, height: 20,
                      background: i <= currentStepIndex ? 'var(--cc-teal)' : 'var(--cc-border)',
                    }}
                  />
                  <div className="small">{step.replace('_', ' ')}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="card card-civic p-4">
        <h6>Comments</h6>
        <form onSubmit={submitComment} className="d-flex gap-2 mb-3">
          <input className="form-control" placeholder="Add a comment…" value={commentText}
            onChange={(e) => setCommentText(e.target.value)} />
          <button className="btn btn-civic">Post</button>
        </form>
        {comments.map((c) => (
          <div key={c.id} className="border-top pt-2 mb-2">
            <strong>{c.author}</strong> <span className="text-muted small">{new Date(c.createdAt).toLocaleString()}</span>
            <p className="mb-1">{c.content}</p>
          </div>
        ))}
        {comments.length === 0 && <p className="text-muted">No comments yet.</p>}
      </div>
    </div>
  );
}

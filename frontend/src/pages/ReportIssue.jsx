import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import api from '../services/api';

function LocationPicker({ onPick }) {
  useMapEvents({
    click(e) {
      onPick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

/**
 * Report-issue form. Saves an in-progress draft to localStorage so a citizen
 * doesn't lose their report if they lose connectivity mid-form (offline form saving).
 */
export default function ReportIssue() {
  const navigate = useNavigate();
  const DRAFT_KEY = 'cc_report_draft';

  const [categories, setCategories] = useState([]);
  const [position, setPosition] = useState([11.0168, 76.9558]);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    return draft ? JSON.parse(draft) : {
      title: '', description: '', categoryId: '', address: '', city: '',
      priority: 'MEDIUM', isAnonymous: false,
    };
  });

  useEffect(() => {
    api.get('/public/categories').then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
  }, [form]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    try {
      const urls = [];
      for (const file of files) {
        const data = new FormData();
        data.append('file', file);
        const res = await api.post('/files/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        urls.push(res.data.url);
      }
      setImages([...images, ...urls]);
    } catch {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        categoryId: Number(form.categoryId),
        latitude: position[0],
        longitude: position[1],
        imageUrls: images,
      };
      await api.post('/issues', payload);
      localStorage.removeItem(DRAFT_KEY);
      toast.success('Issue reported. Thank you for helping your community!');
      navigate('/my-reports');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit report');
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: 720 }}>
      <h2 className="h4 mb-3">Report a civic issue</h2>
      <form onSubmit={submit} className="card card-civic p-4">
        <div className="mb-3">
          <label className="form-label">Issue title</label>
          <input required className="form-control" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea required rows={4} className="form-control" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Category</label>
            <select required className="form-select" value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
              <option value="">Select category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Priority</label>
            <select className="form-select" value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Address</label>
            <input className="form-control" value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">City</label>
            <input className="form-control" value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </div>
        </div>

        <label className="form-label">Pin the exact location (click on the map)</label>
        <div className="leaflet-map-container mb-3">
          <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={position} />
            <LocationPicker onPick={setPosition} />
          </MapContainer>
        </div>

        <div className="mb-3">
          <label className="form-label">Photos</label>
          <input type="file" multiple accept="image/*" className="form-control" onChange={handleImageUpload} disabled={uploading} />
          <div className="d-flex gap-2 mt-2 flex-wrap">
            {images.map((url) => <img key={url} src={url} alt="upload preview" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }} />)}
          </div>
        </div>

        <div className="form-check mb-3">
          <input className="form-check-input" type="checkbox" id="anon" checked={form.isAnonymous}
            onChange={(e) => setForm({ ...form, isAnonymous: e.target.checked })} />
          <label className="form-check-label" htmlFor="anon">Report anonymously</label>
        </div>

        <button className="btn btn-civic" disabled={uploading}>Submit report</button>
      </form>
    </div>
  );
}

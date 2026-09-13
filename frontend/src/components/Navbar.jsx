import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ theme, onToggleTheme }) {
  const { t, i18n } = useTranslation();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('cc_lang', lng);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-civic py-3">
      <div className="container">
        <Link className="navbar-brand brand-font fw-bold" to="/">
          {t('appName')}
        </Link>
        <button className="navbar-toggler" onClick={() => setOpen(!open)}>
          <span className="navbar-toggler-icon" />
        </button>
        <div className={`collapse navbar-collapse ${open ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><Link className="nav-link" to="/map">{t('home')}</Link></li>
            {user && <li className="nav-item"><Link className="nav-link" to="/report">{t('reportIssue')}</Link></li>}
            {user && <li className="nav-item"><Link className="nav-link" to="/my-reports">{t('myReports')}</Link></li>}
            {isAdmin && <li className="nav-item"><Link className="nav-link" to="/admin">{t('admin')}</Link></li>}
            <li className="nav-item"><Link className="nav-link" to="/about">{t('about')}</Link></li>
          </ul>
          <div className="d-flex align-items-center gap-2">
            <select
              className="form-select form-select-sm"
              style={{ width: 90 }}
              defaultValue={localStorage.getItem('cc_lang') || 'en'}
              onChange={(e) => changeLanguage(e.target.value)}
            >
              <option value="en">EN</option>
              <option value="ta">TA</option>
            </select>
            <button className="btn btn-sm btn-outline-light" onClick={onToggleTheme}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            {user ? (
              <>
                <Link to="/notifications" className="btn btn-sm btn-outline-light">🔔</Link>
                <Link to="/profile" className="btn btn-sm btn-outline-light">{user.fullName?.split(' ')[0]}</Link>
                <button className="btn btn-sm btn-light" onClick={() => { logout(); navigate('/'); }}>
                  {t('logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-sm btn-outline-light">{t('login')}</Link>
                <Link to="/register" className="btn btn-sm btn-light">{t('register')}</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

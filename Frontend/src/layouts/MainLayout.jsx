import { useState } from 'react';
import Icon from '../components/Icons';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/MainLayout.module.css';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { path: '/vocab-list', label: 'Vocab List', icon: 'book' },
  { path: '/phrases', label: 'Phrases', icon: 'puzzle' },
  { path: '/vocab-test', label: 'Vocab Test', icon: 'pen' },
  { path: '/vocab-review', label: 'Vocab Review', icon: 'refresh' },
  { path: '/flashcard', label: 'FlashCard', icon: 'zap' },
];

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.layout}>
      <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''}`}>
        <div className={styles.sidebarTop}>
          {!collapsed && (
            <div className={styles.brand}>
              <span className={styles.brandIcon}>📚</span>
              <span className={styles.brandName}>VocabList</span>
            </div>
          )}
          <button
            className={styles.collapseBtn}
            onClick={() => setCollapsed(v => !v)}
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? '▶' : '◀'}
          </button>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''} ${collapsed ? styles.navItemCollapsed : ''}`
              }
              title={collapsed ? item.label : ''}
            >
              <span className={styles.navIcon}><Icon name={item.icon} size={18} /></span>
              {!collapsed && <span className={styles.navLabel}>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarBottom}>
          <div className={`${styles.userInfo} ${collapsed ? styles.userInfoCollapsed : ''}`}>
            <div className={styles.avatar}>{user?.name?.[0]?.toUpperCase() || 'U'}</div>
            {!collapsed && (
              <div className={styles.userMeta}>
                <span className={styles.userName}>{user?.name}</span>
                <span className={styles.userEmail}>{user?.email}</span>
              </div>
            )}
          </div>
          <button
            className={`${styles.logoutBtn} ${collapsed ? styles.logoutCollapsed : ''}`}
            onClick={handleLogout}
            title="Logout"
          >
            <Icon name="logout" size={16} color="#c0392b" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main className={`${styles.main} ${collapsed ? styles.mainCollapsed : ''}`}>
        <Outlet />
      </main>
    </div>
  );
}
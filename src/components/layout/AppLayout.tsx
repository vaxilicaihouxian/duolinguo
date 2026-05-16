import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { TabBar } from 'antd-mobile';
import {
  AppOutline,
  UnorderedListOutline,
  ContentOutline,
  UserOutline,
} from 'antd-mobile-icons';
import styles from './AppLayout.module.css';

const tabs = [
  { key: '/', title: '首页', icon: <AppOutline /> },
  { key: '/learn', title: '学习', icon: <UnorderedListOutline /> },
  { key: '/practice', title: '练习', icon: <ContentOutline /> },
  { key: '/profile', title: '我的', icon: <UserOutline /> },
];

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const activeKey = location.pathname.startsWith('/learn')
    ? '/learn'
    : location.pathname.startsWith('/practice')
      ? '/practice'
      : location.pathname.startsWith('/profile')
        ? '/profile'
        : '/';

  return (
    <div className={styles.layout}>
      <main className={styles.content}>
        <Outlet />
      </main>
      <nav className={styles.tabBar}>
        <TabBar
          activeKey={activeKey}
          onChange={(key) => navigate(key)}
          safeArea
        >
          {tabs.map((tab) => (
            <TabBar.Item key={tab.key} icon={tab.icon} title={tab.title} />
          ))}
        </TabBar>
      </nav>
    </div>
  );
}

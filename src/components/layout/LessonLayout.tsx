import { Outlet } from 'react-router-dom';
import styles from './LessonLayout.module.css';

export default function LessonLayout() {
  return (
    <div className={styles.layout}>
      <Outlet />
    </div>
  );
}

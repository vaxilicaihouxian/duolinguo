import { useNavigate } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <span className={styles.icon}>🔍</span>
      <h1 className={styles.title}>页面不存在</h1>
      <p className={styles.desc}>你访问的页面可能已被移除或地址错误</p>
      <button className={styles.btn} onClick={() => navigate('/')}>
        返回首页
      </button>
    </div>
  );
}

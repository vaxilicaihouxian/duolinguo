import { Toast } from 'antd-mobile';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { SHOP_ITEMS } from '@/data/constants';
import styles from './ShopPage.module.css';

export default function ShopPage() {
  const user = usePlayerStore((s) => s.user);
  const spendGems = usePlayerStore((s) => s.spendGems);
  const restoreHeart = usePlayerStore((s) => s.restoreHeart);
  const addStreakFreeze = usePlayerStore((s) => s.addStreakFreeze);

  const handleBuy = (item: typeof SHOP_ITEMS[number]) => {
    if (user.gems < item.price) {
      Toast.show({ content: '宝石不够哦！' });
      return;
    }

    if (spendGems(item.price)) {
      switch (item.type) {
        case 'heart':
          restoreHeart();
          Toast.show({ content: `成功购买 ${item.name}！` });
          break;
        case 'streak_freeze':
          addStreakFreeze();
          Toast.show({ content: `成功购买 ${item.name}！` });
          break;
        case 'xp_boost':
          Toast.show({ content: `成功购买 ${item.name}！有效期 30 分钟` });
          break;
      }
    }
  };

  return (
    <ErrorBoundary>
      <div className={styles.page}>
        <h1 className={styles.title}>🛍 宝石商城</h1>
        <p className={styles.balance}>余额：{user.gems} 💎</p>
        <div className={styles.items}>
          {SHOP_ITEMS.map((item) => (
            <div key={item.id} className={styles.item}>
              <span className={styles.icon}>{item.icon}</span>
              <div className={styles.info}>
                <span className={styles.name}>{item.name}</span>
                <span className={styles.desc}>{item.description}</span>
              </div>
              <button
                className={styles.buyBtn}
                onClick={() => handleBuy(item)}
                disabled={user.gems < item.price}
              >
                {item.price} 💎
              </button>
            </div>
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
}

import { Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd-mobile';
import zhCN from 'antd-mobile/es/locales/zh-CN';
import AppLayout from './components/layout/AppLayout';
import LessonLayout from './components/layout/LessonLayout';
import ErrorBoundary from './components/common/ErrorBoundary';
import HomePage from './pages/HomePage';
import LearnPage from './pages/LearnPage';
import PracticePage from './pages/PracticePage';
import ProfilePage from './pages/ProfilePage';
import LessonPage from './pages/LessonPage';
import PersonalBestPage from './pages/PersonalBestPage';
import AchievementsPage from './pages/AchievementsPage';
import ShopPage from './pages/ShopPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <ErrorBoundary>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/personal-best" element={<PersonalBestPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route element={<LessonLayout />}>
            <Route path="/lesson/:lessonId" element={<LessonPage />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </ConfigProvider>
  );
}

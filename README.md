# 多邻国风格英语学习 H5

面向中文母语者的移动端英语学习应用，仿多邻国交互体验。

## 技术栈

React 18 + TypeScript 5 + Vite 5 + Zustand 4 + Ant Design Mobile 5 + framer-motion

纯前端，数据存储在浏览器 LocalStorage 中。

## 快速开始

```bash
npm install
npm run dev      # 开发模式，打开 http://localhost:5173
npm run build    # 生产构建，输出到 dist/
```

## 课程体系

CEFR 四级课程，JSON 驱动（`src/data/courses/`）：

| 等级 | 描述 | 单元 | 课程 |
|------|------|------|------|
| A1 入门 | 零基础，问候、数字、颜色、食物 | 3 | 9 |
| A2 基础 | 时间日期、购物出行、天气 | 2 | 6 |
| B1 中级 | 旅行住宿、健康就医 | 2 | 6 |
| B2 中高级 | 工作面试、文化社交 | 2 | 6 |

## 题型

- **选择题**：四选一，选项随机排列
- **填空题**：文本输入，支持多个可接受答案
- **翻译题**：中→英 / 英→中双向翻译
- **听力题**：浏览器 TTS 朗读英文，用户听写（Web Speech API）
- **口语题**：语音识别用户发音（需 Chrome，其他浏览器降级为手动输入）

## 答题机制

- 每课 5 颗红心，答错扣一颗，用完课程失败
- 每题正确获 XP，全对额外完美奖励
- 连续打卡 + 成就系统
- SM-2 间隔重复算法记录学习进度

## 数据备份

首页点击「导出数据」下载 JSON 备份文件，点击「导入数据」恢复。用于换设备迁移或防止数据丢失。

## 编辑课程

直接编辑 `src/data/courses/` 下的 JSON 文件即可，每个题目结构：

```json
{ "id": "唯一ID", "type": "choice|fill-blank|translation|listening|speaking",
  "prompt": "题目", "correctAnswer": "正确答案",
  "acceptableAnswers": ["可接受的替代答案"],
  "difficulty": 1 }
```

选择题额外需要 `options` + `correctIndex`，听力题需要 `audioText`，口语题需要 `targetText` + `scoringThreshold`。

## 截图

<div align="center">
  <img src="docs/pic1.jpg" width="200" />
  <img src="docs/pic2.jpg" width="200" />
  <img src="docs/pic3.jpg" width="200" />
  <img src="docs/pic4.jpg" width="200" />
</div>

## 项目结构

```
src/
├── components/
│   ├── common/       # ErrorBoundary
│   ├── course/       # SkillTree, UnitNode, LessonCard
│   ├── layout/       # AppLayout, LessonLayout
│   └── quiz/         # QuizEngine + 5种题型组件
├── data/             # 常量 + JSON 课程数据
├── pages/            # 页面组件
├── services/         # CourseService, StorageService
├── stores/           # Zustand stores (player, progress, leaderboard)
├── types/            # TypeScript 类型定义
└── styles/           # 全局样式
```

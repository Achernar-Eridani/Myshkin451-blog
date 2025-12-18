# Myshkin451 Blog

> 📝 **个人技术博客全栈项目**  
> A modern full-stack personal blog system built with Node.js, Express, MySQL & Vue 3.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
https://myshkin451.com/

## ✨ 项目亮点 | Key Features
- **前后端分离**：RESTful API + Vue SPA  
- **Markdown 创作**：集成 ByteMD，支持代码高亮 & 图片直传  
- **多维内容组织**：分类（Category）+ 标签（Tag）  
- **嵌套评论**：多级回复、权限校验、审核机制  
- **文件上传安全**：头像 / 文章图片分目录存储 + MIME & 大小限制  
- **集中式管理后台**：文章、评论、分类、标签一站管理  
- **响应式设计**：Tailwind CSS 打造移动友好 UI

## ⚙️ 技术栈 | Tech Stack
| 后端 Backend | 前端 Frontend | 通用 Common |
|--------------|--------------|-------------|
| Node.js · Express | Vue 3 · Vite · Vue Router | JWT · Axios |
| MySQL · Sequelize | Tailwind CSS | Multer |
| bcryptjs | ByteMD · highlight.js | Docker |

## 📂 目录结构 | Project Structure
```text
myshkin451-blog/
├─ app.js                # Express 入口 / Server entry
├─ models/               # Sequelize models
├─ controllers/          # Business logic
├─ routes/               # RESTful API routes
├─ middlewares/          # JWT / Upload guards
├─ uploads/              # Static uploads (avatars, posts)
└─ client/               # Vue 3 SPA (see `client/README.md`)
````

## 🚀 快速启动 | Getting Started

<details>
<summary><strong>本地开发 (Local Dev)</strong></summary>

### 1. 克隆仓库 | Clone

```bash
git clone https://github.com/Achernar-Eridani/Myshkin451-blog.git
cd Myshkin451-blog
```

### 2. 配置环境变量 | Env Vars

复制并修改 `.env.example`：

```bash
cp .env.example .env
# 修改 DB_* / JWT_SECRET 等
```

### 3. 启动后端 | Backend

```bash
npm install
node app.js         # nodemon 熱重载
```

### 4. 启动前端 | Frontend

```bash
cd client
npm install
npm run dev         # Vite 本地服务 http://localhost:5173
```

</details>

<details>
<summary><strong>Docker 一键运行 (Docker)</strong></summary>

```bash
docker build -t myshkin451-blog .
docker run --env-file .env -p 3000:3000 myshkin451-blog
# 前端构建产物已由 Nginx 提供，默认端口 80
```

</details>

## 🗺️ 路线图 | Roadmap

* [ ] **全文搜索** (Elastic / MySQL FTS)
* [ ] **文章点赞 & 收藏**
* [ ] **SSR / SEO 优化**
* [ ] **CI/CD & 单元测试**
* [ ] **TypeScript 全量迁移**

## 🤝 贡献指南 | Contributing

欢迎提 Issue 或 PR！

## 📄 许可证 | License

MIT © 2025 Achernar-Eridani

```





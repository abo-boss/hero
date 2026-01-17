# 部署指南：如何将网站免费发布到公网

作为一个编程小白，要让所有人都能访问你的网站，最简单、性价比最高（全免费）的方案是使用 **Vercel 全家桶**。

我已经帮你修改了代码，使其适应云端环境。现在的步骤如下：

## 第一步：准备工作

1.  **注册 GitHub**：访问 [github.com](https://github.com) 注册账号。
2.  **注册 Vercel**：访问 [vercel.com](https://vercel.com)，使用 GitHub 账号登录。

## 第二步：上传代码到 GitHub

你需要将电脑上的代码上传到 GitHub 仓库。如果你安装了 GitHub Desktop 软件会很简单，或者使用命令行：

```bash
git init
git add .
git commit -m "Initial commit"
# 在 GitHub 上新建一个仓库，然后执行下面的命令（替换成你的仓库地址）
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

## 第三步：在 Vercel 部署

1.  登录 Vercel 面板，点击 **"Add New..."** -> **"Project"**。
2.  在左侧列表中找到你刚才上传的 GitHub 仓库，点击 **"Import"**。
3.  **配置环境**：
    *   在部署配置页面的 **Environment Variables** 部分，你需要填入 `NEXTAUTH_SECRET` 和 `NEXTAUTH_URL`。
    *   `NEXTAUTH_SECRET`：可以随机生成一串字符（命令行输入 `openssl rand -base64 32` 生成）。
    *   `NEXTAUTH_URL`：部署后你的网址（例如 `https://your-project.vercel.app`）。
4.  点击 **"Deploy"**。第一次部署可能会失败，因为数据库还没连接，**不要慌**，继续下一步。

## 第四步：连接数据库和存储 (关键)

在 Vercel 的项目面板中：

1.  **数据库 (Postgres)**：
    *   点击顶部的 **Storage** 标签页。
    *   点击 **Connect Store** -> **Create New** -> **Postgres**。
    *   接受条款，输入名称（如 `my-db`），选择区域（选美国或新加坡，离你近点）。
    *   创建完成后，Vercel 会自动将 `POSTGRES_PRISMA_URL` 等环境变量添加到你的项目中。

2.  **图片存储 (Blob)**：
    *   同样在 **Storage** 标签页。
    *   点击 **Connect Store** -> **Create New** -> **Blob**。
    *   创建完成后，Vercel 会自动添加 `BLOB_READ_WRITE_TOKEN` 环境变量。

## 第五步：初始化数据库

由于我们从 SQLite 换成了 PostgreSQL，需要初始化云端数据库。

1.  在 Vercel 网页上，进入 **Deployments** 标签页。
2.  点击最近一次（可能失败的）部署旁边的 **三点图标** -> **Redeploy**。
3.  这次因为有了数据库环境变量，构建应该能成功。
    *   *注意：如果构建日志提示数据库未迁移，你可能需要在 Build Command 中加入 `npx prisma db push`。*
    *   **更简单的办法**：在你的本地电脑上，连接云端数据库执行一次同步：
        1.  安装 Vercel CLI: `npm i -g vercel`
        2.  登录: `vercel login`
        3.  拉取环境变量: `vercel env pull .env.local`
        4.  推送数据库结构: `npx prisma db push`

## 第六步：完成！

现在访问 Vercel 给你分配的域名（例如 `xxx.vercel.app`），你的网站就上线了！

*   **所有功能**（包括图片上传、数据库读写）都应该正常工作。
*   **费用**：对于个人展示项目，这些服务都在免费额度内，无需花钱。

---

**⚠️ 注意事项：**
由于我修改了 `prisma/schema.prisma` 为 PostgreSQL 模式，**你本地的开发环境（npm run dev）现在可能会报错**，因为它找不到 Postgres 数据库。
*   **解决方法**：按照第五步的 "更简单的办法"，拉取云端环境变量到本地，这样你本地开发时也会直接连接云端数据库，数据是同步的。

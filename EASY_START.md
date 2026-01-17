# 🚀 3 步上线指南 (傻瓜版)

不要怕，按照这 3 步点鼠标，你的网站就能上线！

## 第一步：发布代码 (在 VS Code / Trae 里点)

1.  看软件最左侧的侧边栏，找到那个像**树杈一样的图标** (源代码管理)。
2.  你会看到一个蓝色的按钮叫 **"Publish Branch"** (发布分支) 或者 **"Publish to GitHub"**。
3.  点击它！
    *   如果它问你要发公开(public)还是私有(private)，选 **Public** (公开)。
    *   如果它弹窗让你登录 GitHub，就点允许并登录。
4.  等右下角的进度条跑完，代码就上去了。

## 第二步：一键部署 (在网页上点)

1.  打开这个网址：[https://vercel.com/new](https://vercel.com/new)
2.  你会看到刚才发布的项目 `hero` (或者你自己起的名字)。
3.  点击它旁边的 **"Import"** 按钮。
4.  **关键一步**：
    *   在 **Environment Variables** (环境变量) 那里，填入：
        *   `NEXTAUTH_SECRET` = `任意乱写一串字符`
        *   `NEXTAUTH_URL` = `https://你的项目名.vercel.app` (这个其实不填也行，Vercel 会自动处理，为了保险可以填)
5.  点击 **"Deploy"** (部署)。

## 第三步：点两下数据库 (在网页上点)

部署可能会报错，别慌！是因为没连数据库。

1.  部署失败后，或者部署成功但网站打不开时。
2.  点击 Vercel 页面顶部的 **"Storage"** 标签。
3.  点击 **"Connect Store"** -> **"Create New"** -> **"Postgres"** (数据库)。
    *   起个名，选个地区，点 Create。
4.  再点击 **"Connect Store"** -> **"Create New"** -> **"Blob"** (图片存储)。
    *   起个名，点 Create。
5.  回到 **"Deployments"** 标签，找到刚才失败的那条，点 **三个点图标** -> **"Redeploy"**。

**等它跑完，你的网站就上线了！**

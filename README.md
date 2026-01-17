# Personal AI Learning Center

This is a Next.js project designed for sharing AI resources and personal content creation guides.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Content Management

- **Resources**: Add MDX files to `content/resources/ai` or `content/resources/content-creation`.
- **Blog**: Add MDX files to `content/blog`.
- **Frontmatter**: Each MDX file should have the following frontmatter:
  ```yaml
  ---
  title: "Title"
  date: "YYYY-MM-DD"
  description: "Short description"
  tags: ["Tag1", "Tag2"]
  category: "ai" # or "content-creation" or "blog"
  author: "Name"
  ---
  ```

## Tech Stack

- Next.js 14 (App Router)
- Tailwind CSS
- MDX (via next-mdx-remote)
- Lucide React

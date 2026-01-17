import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

const contentDirectory = path.join(process.cwd(), 'content');

async function main() {
  console.log('Starting migration...');

  // 1. Migrate Blogs
  const blogDir = path.join(contentDirectory, 'blog');
  if (fs.existsSync(blogDir)) {
    const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.mdx'));
    for (const file of files) {
      await processFile(file, blogDir, 'blog', 'blog');
    }
  }

  // 2. Migrate AI Resources
  const aiDir = path.join(contentDirectory, 'resources', 'ai');
  if (fs.existsSync(aiDir)) {
    const files = fs.readdirSync(aiDir).filter(f => f.endsWith('.mdx'));
    for (const file of files) {
      await processFile(file, aiDir, 'resource', 'ai');
    }
  }

  // 3. Migrate Content Creation Resources
  const ccDir = path.join(contentDirectory, 'resources', 'content-creation');
  if (fs.existsSync(ccDir)) {
    const files = fs.readdirSync(ccDir).filter(f => f.endsWith('.mdx'));
    for (const file of files) {
      await processFile(file, ccDir, 'resource', 'content-creation');
    }
  }

  console.log('Migration completed.');
}

async function processFile(filename: string, dir: string, type: string, defaultCategory: string) {
  const slug = filename.replace(/\.mdx$/, '');
  const fullPath = path.join(dir, filename);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const category = data.category || defaultCategory;
  const tags = Array.isArray(data.tags) ? data.tags.join(',') : (data.tags || '');
  const link = data.link || data.videoUrl || null;

  console.log(`Migrating: ${slug} (${type}/${category})`);

  try {
    await prisma.post.upsert({
      where: { slug },
      update: {
        title: data.title || 'Untitled',
        description: data.description || '',
        content: content,
        date: data.date ? new Date(data.date) : new Date(),
        type,
        category,
        tags,
        link,
        author: data.author || 'Abobo',
        published: true,
      },
      create: {
        slug,
        title: data.title || 'Untitled',
        description: data.description || '',
        content: content,
        date: data.date ? new Date(data.date) : new Date(),
        type,
        category,
        tags,
        link,
        author: data.author || 'Abobo',
        published: true,
      },
    });
  } catch (error) {
    console.error(`Error migrating ${slug}:`, error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

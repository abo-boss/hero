const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); async function main() { const count = await prisma.post.count(); console.log('Post count:', count); } main();

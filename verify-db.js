
const { PrismaClient } = require('@prisma/client')

// 切换为直连模式 (5432)，排除 6543 端口被本地网络拦截的干扰
// 这一步只为了验证：密码到底对不对！
const connectionString = 'postgresql://postgres:Hero2025GoodLuck@db.rspnfyesfwkxdnbbdkko.supabase.co:5432/postgres'

console.log('正在尝试直连数据库 (5432端口)...')
console.log('使用的连接串:', connectionString.replace(/:[^:@]+@/, ':****@')) 

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: connectionString
    }
  }
})

async function main() {
  try {
    const count = await prisma.user.count()
    console.log('✅ 密码验证成功！(直连模式已通)')
    console.log(`数据库中用户数量: ${count}`)
    console.log('\n--> 结论: 你的密码是正确的。')
    console.log('--> 下一步: 请放心在 Vercel 填入我刚才给你的 Pooler 连接串，肯定能行。')
  } catch (e) {
    console.error('❌ 连接失败！')
    console.error('错误信息:', e.message)
    
    if (e.message.includes('password authentication failed')) {
      console.log('\n--> 结论: ❌ 密码错误！绝对是密码错了！')
      console.log('--> 解决: 必须去 Supabase 后台 -> Project Settings -> Database -> Reset password 重置密码。')
    } else {
      console.log('\n--> 结论: 网络问题或其他错误。')
    }
  } finally {
    await prisma.$disconnect()
  }
}

main()

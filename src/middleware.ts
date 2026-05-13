import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  
  // 已登录用户访问登录页，重定向到后台首页
  if (pathname === '/admin/login') {
    const token = await getToken({ req })
    if (token) {
      return NextResponse.redirect(new URL('/admin', req.url))
    }
    return NextResponse.next()
  }
  
  // 保护所有 /admin 路由（登录页已在上面处理）
  if (pathname.startsWith('/admin')) {
    const token = await getToken({ req })
    
    if (!token) {
      // 未登录，重定向到登录页
      const loginUrl = new URL('/admin/login', req.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}

export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { getServerSession } from 'next-auth'

export async function POST(request: Request) {
  // Simplified auth check for file mode
  // const session = await getServerSession(authOptions)
  // if (!session) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  // }

  const formData = await request.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Ensure upload directory exists
  const uploadDir = join(process.cwd(), 'public/uploads/avatars')
  try {
    await mkdir(uploadDir, { recursive: true })
  } catch (e) {
    // Ignore error if directory exists
  }

  // Create unique filename
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`
  const filepath = join(uploadDir, filename)

  try {
    await writeFile(filepath, buffer)
    const url = `/uploads/avatars/${filename}`
    return NextResponse.json({ url })
  } catch (error) {
    console.error('Error saving file:', error)
    return NextResponse.json({ error: 'Error saving file' }, { status: 500 })
  }
}

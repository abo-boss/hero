import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  // Use Vercel Blob for storage
  // Note: This requires BLOB_READ_WRITE_TOKEN environment variable
  try {
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`
    const blob = await put(`avatars/${filename}`, file, {
      access: 'public',
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error)
    // Fallback for local development without Blob token:
    // If you want to keep local upload working, you'd need conditional logic.
    // But for Vercel deployment, this is the way.
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 })
  }
}

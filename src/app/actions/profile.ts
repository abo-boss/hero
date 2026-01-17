'use server'

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"

export async function updateProfile(formData: FormData) {
  const session = await getServerSession(authOptions)
  
  // Cast session.user to include id since we added it in authOptions
  const user = session?.user as { id: string; email: string; name?: string } | undefined
  
  if (!user?.id) {
    throw new Error("Unauthorized")
  }

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const image = formData.get('image') as string

  console.log('Update Profile Request:', { name, email, image })

  if (!email || !name) {
    throw new Error("Name and email are required")
  }

  // Check if email is already taken by another user
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser && existingUser.id !== user.id) {
    throw new Error("Email is already in use")
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { name, email, image }
  })

  revalidatePath('/admin')
  return { success: true }
}

export async function changePassword(formData: FormData) {
  const session = await getServerSession(authOptions)
  
  const user = session?.user as { id: string; email: string; name?: string } | undefined
  
  if (!user?.id) {
    throw new Error("Unauthorized")
  }

  const currentPassword = formData.get('currentPassword') as string
  const newPassword = formData.get('newPassword') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!currentPassword || !newPassword || !confirmPassword) {
    throw new Error("All fields are required")
  }

  if (newPassword !== confirmPassword) {
    throw new Error("New passwords do not match")
  }

  if (newPassword.length < 6) {
    throw new Error("Password must be at least 6 characters")
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id }
  })

  if (!dbUser) {
    throw new Error("User not found")
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, dbUser.password)

  if (!isPasswordValid) {
    throw new Error("Incorrect current password")
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword }
  })

  return { success: true }
}

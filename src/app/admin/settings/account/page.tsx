'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { updateProfile, changePassword } from '@/app/actions/profile'
import { Loader2, Save, User, Lock, AlertCircle, CheckCircle2, Camera } from 'lucide-react'
import Image from 'next/image'

export default function AccountSettingsPage() {
  const { data: session, update } = useSession()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [avatar, setAvatar] = useState(session?.user?.image || '')

  useEffect(() => {
    if (session?.user?.image) {
      setAvatar(session.user.image)
    }
  }, [session?.user?.image])

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData
      })
      
      if (!res.ok) throw new Error('Upload failed')
      
      const data = await res.json()
      setAvatar(data.url)
    } catch (error) {
      console.error('Error uploading avatar:', error)
      setMessage({ type: 'error', text: '头像上传失败' })
    } finally {
      setUploading(false)
    }
  }

  async function handleProfileUpdate(formData: FormData) {
    setLoading(true)
    setMessage(null)
    
    // Ensure image is included in formData
    formData.set('image', avatar)

    try {
      await updateProfile(formData)
      await update({ user: { ...session?.user, image: avatar, name: formData.get('name') } }) // Update session
      setMessage({ type: 'success', text: '个人资料已更新' })
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message || '更新失败' })
    } finally {
      setLoading(false)
    }
  }

  async function handlePasswordChange(formData: FormData) {
    setLoading(true)
    setMessage(null)
    try {
      await changePassword(formData)
      setMessage({ type: 'success', text: '密码修改成功' })
      // Clear password fields
      const form = document.getElementById('password-form') as HTMLFormElement
      form.reset()
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message || '修改失败' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">账号设置</h1>
        <p className="text-slate-500 text-sm">管理您的个人资料和安全设置</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      {/* Profile Form */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-slate-500" />
          基本信息
        </h2>
        <form action={handleProfileUpdate} className="space-y-4">
          {/* Avatar Upload */}
          <div className="flex items-center gap-6 mb-6">
            <div className="relative w-24 h-24 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
              {avatar ? (
                <Image 
                  src={avatar} 
                  alt="Avatar" 
                  fill 
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <User className="w-10 h-10" />
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                头像
              </label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700">
                  <Camera className="w-4 h-4" />
                  更换头像
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                </label>
                {avatar && (
                  <button
                    type="button"
                    onClick={() => setAvatar('')}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    删除
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                支持 JPG, PNG, GIF 格式，建议尺寸 200x200px
              </p>
            </div>
            <input type="hidden" name="image" value={avatar} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">姓名</label>
            <input
              name="name"
              defaultValue={session?.user?.name || ''}
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">邮箱</label>
            <input
              type="email"
              name="email"
              defaultValue={session?.user?.email || ''}
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              保存资料
            </button>
          </div>
        </form>
      </div>

      {/* Password Form */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-slate-500" />
          修改密码
        </h2>
        <form id="password-form" action={handlePasswordChange} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">当前密码</label>
            <input
              type="password"
              name="currentPassword"
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">新密码</label>
              <input
                type="password"
                name="newPassword"
                required
                minLength={6}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">确认新密码</label>
              <input
                type="password"
                name="confirmPassword"
                required
                minLength={6}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              更新密码
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

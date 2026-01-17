'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'

export function WeChatModal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="hover:text-slate-900 transition-colors"
      >
        WeChat
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all" onClick={() => setIsOpen(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-[320px] w-full relative shadow-2xl animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-bold text-slate-900 mb-6">扫码加好友</h3>
              <div className="relative w-48 h-48 bg-slate-50 rounded-xl overflow-hidden mb-4 border border-slate-100 shadow-inner">
                 <Image 
                   src="/wechat-qr.png" 
                   alt="WeChat QR Code"
                   fill
                   className="object-cover"
                 />
              </div>
              <p className="text-xs text-slate-400 text-center">
                添加时请注明来意
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

 'use client'
 
 export default function GlobalError({
   error,
   reset,
 }: {
   error: Error
   reset: () => void
 }) {
   console.error('Global error:', error)
   return (
     <html>
       <body>
         <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <div style={{ textAlign: 'center' }}>
             <h1 style={{ fontSize: 24, marginBottom: 12 }}>页面加载失败</h1>
             <p style={{ color: '#64748b', marginBottom: 16 }}>请稍后重试，或点击下方按钮刷新页面。</p>
             <button
               onClick={() => reset()}
               style={{
                 padding: '10px 16px',
                 borderRadius: 8,
                 backgroundColor: '#0f172a',
                 color: 'white',
                 border: 'none',
                 cursor: 'pointer',
               }}
             >
               重新加载
             </button>
           </div>
         </div>
       </body>
     </html>
   )
 }

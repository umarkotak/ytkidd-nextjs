import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, BotMessageSquare, BrickWall, MessageCircleQuestion, Worm,  } from 'lucide-react'

import ytkiddAPI from '@/apis/ytkidApi'
import Utils from '@/models/Utils'

export default function Home() {
  const searchParams = useSearchParams()

  return (
    <main className="pb-[100px] p-4">
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/games/maze" className='hover:scale-105 duration-300'>
          <div className='flex flex-col gap-2 border shadow-sm p-2 rounded-lg'>
            <img
              src="https://ytkidd-api-m4.cloudflare-avatar-id-1.site/comfy_ui_gallery/ComfyUI_00026_.png"
              className='w-full rounded-lg shadow-sm'
            />
            <h1 className='text-2xl flex gap-1 items-center justify-center'><BrickWall size={24} /> Maze</h1>
          </div>
        </Link>
        <Link href="/games/snake" className='hover:scale-105 duration-300'>
          <div className='flex flex-col gap-2 border shadow-sm p-2 rounded-lg'>
            <img
              src="https://ytkidd-api-m4.cloudflare-avatar-id-1.site/comfy_ui_gallery/ComfyUI_00027_.png"
              className='w-full rounded-lg shadow-sm'
            />
            <h1 className='text-2xl flex gap-1 items-center justify-center'><Worm size={24} /> Snake</h1>
          </div>
        </Link>
        <Link href="/games/pong" className='hover:scale-105 duration-300'>
          <div className='flex flex-col gap-2 border shadow-sm p-2 rounded-lg'>
            <img
              src="https://ytkidd-api-m4.cloudflare-avatar-id-1.site/comfy_ui_gallery/ComfyUI_00027_.png"
              className='w-full rounded-lg shadow-sm'
            />
            <h1 className='text-2xl flex gap-1 items-center justify-center'><Worm size={24} /> Pong</h1>
          </div>
        </Link>
      </div>
    </main>
  )
}

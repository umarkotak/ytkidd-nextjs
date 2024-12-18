import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, BotMessageSquare, ImageIcon, MessageCircleQuestion,  } from 'lucide-react'

import ytkiddAPI from '@/apis/ytkidApi'
import Utils from '@/models/Utils'

export default function Home() {
  const searchParams = useSearchParams()
  const [imageUrls, setImageUrls] = useState([])

  useEffect(() => {
    GetImageList()
  }, [])

  async function GetImageList(params) {
    try {
      const response = await ytkiddAPI.GetComfyUIOutput("", {}, params)
      const body = await response.json()
      if (response.status !== 200) {
        return
      }

      setImageUrls(body.data.image_urls)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <main className="pb-[100px] p-4">
      <div>
        <span className='text-3xl flex gap-1 items-center'><ImageIcon size={32} /> Generated Images</span>
      </div>

      <div className="mt-4 w-full mx-auto grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {imageUrls.map((imageUrl) => (
          <div className='flex flex-col gap-2 border shadow-sm p-2 rounded-lg' key={imageUrl}>
            <img
              src={`https://${imageUrl}`}
              className='w-full rounded-lg shadow-sm'
            />
          </div>
        ))}
      </div>
    </main>
  )
}

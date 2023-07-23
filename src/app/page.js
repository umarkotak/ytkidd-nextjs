'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Home() {

  const [videoList, setVideoList] = useState([])

  useEffect(() => {
    fetch('/data/db.json').then((response) => response.json()).then((json) => {
      var arr = json
      setVideoList(arr)
    })
  }, [])

  function GetViewedCount(oneVideo) {
    return 0
  }

  function GetWatchedDuration(oneVideo) {
    return 0
  }

  return (
    <main className='pb-[100px] p-4'>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">
        {videoList.map((oneVideo)=>(
          <div key={oneVideo.ytkidd_id}>
            <div>
              <Link href={`/watch?ytkidd_id=${oneVideo.ytkidd_id}&v=${oneVideo.video_id}`}>
                <img className="rounded-xl shadow-md w-full" src={oneVideo.video_image_url} alt="thumb" />
              </Link>
            </div>
            <div className="flex mt-2">
              <div className="min-w-[50px] p-1">
                <Link href="/watch" className="">
                  <img src={oneVideo.creator_image_url} alt="Avatar" className="h-10 w-10 rounded-full" />
                </Link>
              </div>
              <Link href={`/watch?ytkidd_id=${oneVideo.ytkidd_id}&v=${oneVideo.video_id}`}>
                <div className="flex flex-col w-full ml-1 pr-2">
                  <span className="font-medium text-md text-gray-900 break-words">{oneVideo.video_title}</span>
                  <span className="text-sm break-words">{oneVideo.creator_name}</span>
                  <span className="text-xs mt-1"><i className="fa-solid fa-eye"/> {GetViewedCount(oneVideo)}x viewed﹒<i className="fa-solid fa-clock"/> {GetWatchedDuration(oneVideo)} mins watched</span>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

import YtVideo from '@/models/YtVideo'
import Utils from '@/models/Utils'

var limit = 40
var allVideo = []

export default function Home() {
  const [videoList, setVideoList] = useState([])

  useEffect(() => {
    limit = 40
    fetch('/data/db.json').then((response) => response.json()).then((json) => {
      var arr = json.map((v) => {
        var ytVideo = new YtVideo(v)
        return ytVideo
      })
      allVideo = Utils.ShuffleArray(arr)
      setVideoList(allVideo.slice(0, limit))
    })
  }, [])

  const [triggerNextPage, setTriggerNextPage] = useState(0)
  const handleScroll = () => {
    var position = window.pageYOffset
    var maxPosition = document.documentElement.scrollHeight - document.documentElement.clientHeight

    if (maxPosition-position <= 1200) {
      setTriggerNextPage(position)
    }
  }
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  useEffect(() => {
    limit += limit
    const nextVideos = allVideo.slice(0, limit)
    setVideoList(nextVideos)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerNextPage])

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
                  <span className="font-medium text-md text-gray-900 break-words">{oneVideo.shorted_video_title}</span>
                  <span className="text-sm break-words">{oneVideo.creator_name}</span>
                  <span className="text-xs mt-1"><i className="fa-solid fa-eye"/> {oneVideo.GetViewedCount()}x viewed﹒<i className="fa-solid fa-clock"/> {oneVideo.GetWatchedDuration()} mins watched</span>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

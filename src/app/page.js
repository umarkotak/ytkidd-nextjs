'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

import YtVideo from '@/models/YtVideo'
import Utils from '@/models/Utils'

var limit = 20
var allVideo = []
var allChannel = []

export default function Home() {
  const [videoList, setVideoList] = useState([])
  const [channelList, setChannelList] = useState([])

  useEffect(() => {
    limit = 20
    fetch('/data/db.json').then((response) => response.json()).then((json) => {
      var arr = []
      json.forEach((v) => {
        var ytVideo = new YtVideo(v)

        if (localStorage.getItem(`YTKIDD:BLACKLIST_CHANNEL:${ytVideo.channel_id}`)) {
          return
        }

        arr.push(ytVideo)
      })

      allVideo = Utils.ShuffleArray(arr)
      setVideoList(allVideo.slice(0, limit))
    })
    fetch('/data/creator.json').then((response) => response.json()).then((json) => {
      var arr = json.map((v) => {
        return v
      })
      allChannel = Utils.ShuffleArray(arr)
      setChannelList(allChannel)
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
      <div className='mb-4 flex overflow-x-auto w-full pb-4'>
        {channelList.map((oneChannel, idx) => (
          <>
            <Link
              href={`/channel?channel_id=${oneChannel.channel_id}`}
              className='flex-shrink-0 py-2 pl-2 pr-3 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center mr-2'
              key={oneChannel.channel_id}
            >
              <img
                src={oneChannel.channel_image_url}
                className='h-6 w-6 rounded-full mr-2'
              />
              <span className='text-sm'>{oneChannel.channel_name}</span>
            </Link>
          </>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">
        {videoList.map((oneVideo)=>(
          <div key={oneVideo.ytkidd_id} className=''>
            <div>
              <Link href={`/watch?ytkidd_id=${oneVideo.ytkidd_id}&v=${oneVideo.video_id}`}>
                <img className="rounded-xl shadow-md w-full" src={oneVideo.video_image_url} alt="thumb" />
              </Link>
            </div>
            <div className="flex mt-2">
              <div className="min-w-[50px] p-1">
                <Link href={`/channel?channel_id=${oneVideo.channel_id}`} className="">
                  <img src={oneVideo.creator_image_url} alt="Avatar" className="h-10 w-10 rounded-full" />
                </Link>
              </div>
              <Link href={`/watch?ytkidd_id=${oneVideo.ytkidd_id}&v=${oneVideo.video_id}`}>
                <div className="flex flex-col w-full ml-1 pr-2">
                  <span className="font-medium text-md text-gray-900 break-words">{oneVideo.shorted_video_title}</span>
                  <span className="text-sm break-words">{oneVideo.creator_name}</span>
                  <span className="text-xs mt-1"><i className="fa-solid fa-eye"/> {oneVideo.GetViewedCount(oneVideo.video_id)}x viewed﹒<i className="fa-solid fa-clock"/> {oneVideo.GetWatchedDuration(oneVideo.video_id)} mins watched</span>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

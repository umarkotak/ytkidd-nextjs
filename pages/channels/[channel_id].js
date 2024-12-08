"use client"
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import ytkiddAPI from '@/apis/ytkidApi'
import VideoCard from '@/components/VideoCard'

export default function Channel() {
  const router = useRouter()

  const [channelDetail, setChannelDetail] = useState({})
  const [videoList, setVideoList] = useState([])

  useEffect(() => {
    if (!router.query.channel_id) { return }

    GetChannelDetail(router.query.channel_id)
  }, [router])

  async function GetChannelDetail(channelID) {
    try {
      const response = await ytkiddAPI.GetChannelDetail("", {}, {
        channel_id: channelID,
      })
      const body = await response.json()
      if (response.status !== 200) {
        return
      }

      setChannelDetail(body.data.channel)
      setVideoList(body.data.videos)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <main className='pb-[100px] p-4'>
      <div className='mb-8 flex items-center px-2 pt-2 pb-4 rounded-xl shadow-md'>
        <div className='mr-6'>
          <img className="w-24 h-24 rounded-full shadow-md" src={channelDetail.image_url} alt="thumb" />
        </div>
        <div className=''>
          <span className='text-xl'>{channelDetail.name}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-5 gap-y-8">
        {videoList.map((oneVideo) => (
          <VideoCard
            key={oneVideo.id}
            ytkiddId={oneVideo.id}
            videoId={oneVideo.id}
            videoImageUrl={oneVideo.image_url}
            channelId={oneVideo.channel.id}
            creatorImageUrl={oneVideo.channel.image_url}
            shortedVideoTitle={oneVideo.title}
            creatorName={oneVideo.channel.name}
          />
        ))}
      </div>
    </main>
  )
}

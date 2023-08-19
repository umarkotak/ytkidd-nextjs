'use client'

import { useState, useEffect, Fragment } from 'react'

import ChannelList from '@/components/ChannelList'
import VideoCard from '@/components/VideoCard'

import { useGetChannels, useGetVideos } from '@/hooks'

export default function Home() {
  const { data: videoList, limit: limitVideos, fetchingDataWithPagination } = useGetVideos()
  const { data: channelList } = useGetChannels({ isRandomList: true })
  const [triggerNextPage, setTriggerNextPage] = useState(0)

  const handleScroll = () => {
    var position = window.pageYOffset
    var maxPosition = document.documentElement.scrollHeight - document.documentElement.clientHeight

    if (maxPosition - position <= 1200) {
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
    let limit = limitVideos
    fetchingDataWithPagination({ limit: videoList.length + limit })
  }, [triggerNextPage])

  return (
    <main className="pb-[100px] p-4">
      <div className="mb-4 flex overflow-x-auto w-full pb-4">
        {channelList.map((oneChannel) => (
          <ChannelList
            key={oneChannel.channel_id}
            channelId={oneChannel.channel_id}
            channelImageUrl={oneChannel.channel_image_url}
            channelName={oneChannel.channel_name}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">
        {videoList.map((oneVideo) => (
          <VideoCard
            key={oneVideo.video_id}
            ytkiddId={oneVideo.ytkidd_id}
            videoId={oneVideo.video_id}
            videoImageUrl={oneVideo.video_image_url}
            channelId={oneVideo.channel_id}
            creatorImageUrl={oneVideo.creator_image_url}
            shortedVideoTitle={oneVideo.shorted_video_title}
            creatorName={oneVideo.creator_name}
            viewedCounts={oneVideo.GetViewedCount(oneVideo.video_id)}
            watchedDurations={oneVideo.GetWatchedDuration(oneVideo.video_id)}
          />
        ))}
      </div>
    </main>
  )
}

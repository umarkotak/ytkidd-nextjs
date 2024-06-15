

import { useState, useEffect } from 'react'
import Link from 'next/link'

import ChannelList from '@/components/ChannelList'
import VideoCard from '@/components/VideoCard'

import { useGetChannels, useGetVideos } from '@/hooks'
import { BookA } from 'lucide-react'

export default function Learn() {
  const {
    data: videoList,
    limit: limitVideos,
    fetchingDataWithPagination,
    allVideos,
  } = useGetVideos()
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
    const isEligibleFetching = videoList.length < allVideos.length

    if (isEligibleFetching) fetchingDataWithPagination({ limit: videoList.length + limit })
  }, [triggerNextPage])

  return (
    <main className="pb-[100px] p-4">
      <div className="mb-4 flex overflow-x-auto w-full pb-4">
        <Link
          href={`/learn/reading`}
          className="flex-shrink-0 py-2 pl-2 pr-3 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center mr-2"
        >
          <BookA size={18} />
          <span className="ml-2 text-sm">Reading</span>
        </Link>
      </div>
    </main>
  )
}

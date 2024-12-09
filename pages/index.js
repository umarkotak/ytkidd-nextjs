import { useState, useEffect } from 'react'

import ChannelList from '@/components/ChannelList'
import VideoCard from '@/components/VideoCard'

import ytkiddAPI from '@/apis/ytkidApi'
import Utils from '@/models/Utils'

var videoIDs = []
var page = 1
var onApiCall = false
var tmpVideoList = []

export default function Home() {
  const [videoList, setVideoList] = useState([])
  const [channelList, setChannelList] = useState([])

  useEffect(() => {
    videoIDs = []
    page = 1

    GetVideoList({
      page: page,
      exclude_ids: videoIDs.join(",")
    })
    GetChannelList({})
  }, [])

  async function GetVideoList(params) {
    try {
      if (onApiCall) {
        return
      }

      onApiCall = true
      const response = await ytkiddAPI.GetVideos("", {}, params)
      const body = await response.json()
      if (response.status !== 200) {
        return
      }

      tmpVideoList = [...tmpVideoList, ...body.data.videos]
      setVideoList(tmpVideoList)

      page += 1
      videoIDs = videoIDs.concat(body.data.videos.map((oneVideo) => (oneVideo.id)))
      onApiCall = false
    } catch (e) {
      console.error(e)
      onApiCall = false
    }
  }

  async function GetChannelList(params) {
    try {
      const response = await ytkiddAPI.GetChannels("", {}, params)
      const body = await response.json()
      if (response.status !== 200) {
        return
      }

      setChannelList(Utils.ShuffleArray(body.data))
    } catch (e) {
      console.error(e)
    }
  }

  const handleScroll = () => {
    var position = window.pageYOffset
    var maxPosition = document.documentElement.scrollHeight - document.documentElement.clientHeight

    console.log(maxPosition - position)
    if (maxPosition - position <= 1200) {

      GetVideoList({
        page: page,
        exclude_ids: videoIDs.join(",")
      })
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <main className="pb-[100px] p-4">
      <div className="mb-4 flex overflow-x-auto w-full pb-4">
        {channelList.map((oneChannel) => (
          <ChannelList
            key={oneChannel.id}
            channelId={oneChannel.id}
            channelImageUrl={oneChannel.image_url}
            channelName={oneChannel.name}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-x-5 gap-y-8">
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

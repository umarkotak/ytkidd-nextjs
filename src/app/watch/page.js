'use client'

import { useRef, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import YouTube from 'react-youtube'
import Link from 'next/link'

import YtVideo from '@/models/YtVideo'
import Utils from '@/models/Utils'

var limit = 20
var allVideoShuffled = []
var initialTime = Math.floor(Date.now() / 1000)
var totalElapsedSeconds = 0

export default function Watch() {
  const searchParams = useSearchParams()

  const [videoPlayerHeight, setVideoPlayerHeight] = useState(360)
  const [mobileMode, setMobileMode] = useState(true)

  useEffect(() => {
    if (window.innerWidth <= 1000) {
      setMobileMode(true)
    } else {
      setMobileMode(false)
    }

    const onResize = () => {
      if (window.innerWidth <= 1000) {
        setMobileMode(true)
      } else {
        setMobileMode(false)
      }
    }

    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("resize", onResize)
    }
  }, [])

  const videoPlayerDivRef = useRef()

  useEffect(() => {
    if (!videoPlayerDivRef.current) return
    const resizeObserver = new ResizeObserver(() => {
      if (!videoPlayerDivRef.current) return
      var res = Math.floor(videoPlayerDivRef.current.offsetWidth / (16 / 9))
      setVideoPlayerHeight(res)
    })
    resizeObserver.observe(videoPlayerDivRef.current)
    return () => resizeObserver.disconnect() // clean up
  }, [])

  const [videoList, setVideoList] = useState([])
  const [selectedVideo, setSelectedVideo] = useState(new YtVideo({}))
  const [allVideo, setAllVideo] = useState([])

  useEffect(() => {
    fetch('/data/db.json').then((response) => response.json()).then((json) => {
      var tmpAllVideo = json.map((v) => {
        var ytVideo = new YtVideo(v)
        return ytVideo
      })

      setAllVideo(tmpAllVideo)

      allVideoShuffled = Utils.ShuffleArray(tmpAllVideo)
      setVideoList(allVideoShuffled.slice(0, limit))

      if (!searchParams.get('ytkidd_id')) {
        return
      }

      var selectedVidObj
      allVideoShuffled.forEach(tmpOneVideo => {
        if (searchParams.get('ytkidd_id') === tmpOneVideo.ytkidd_id) {
          selectedVidObj = new YtVideo(tmpOneVideo)
        }
      })

      setSelectedVideo(selectedVidObj)
    })

    initialTime = Math.floor(Date.now() / 1000)
    totalElapsedSeconds = 0

    ticker()
  }, [])

  useEffect(() => {
    limit = 20
    allVideoShuffled = [...Utils.ShuffleArray(allVideo)]
    setVideoList(allVideoShuffled.slice(0, limit))

    var selectedVidObj
    allVideoShuffled.forEach(tmpOneVideo => {
      if (searchParams.get('ytkidd_id') === tmpOneVideo.ytkidd_id) {
        selectedVidObj = new YtVideo(tmpOneVideo)
      }
    })

    setSelectedVideo(selectedVidObj)
  }, [searchParams])

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
    const nextVideos = allVideoShuffled.slice(0, limit)
    setVideoList(nextVideos)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerNextPage])

  async function ticker() {
    if (!searchParams.get('v')) { return }

    if (window.location.pathname !== "/watch") { return }

    var currentTime = Math.floor(Date.now() / 1000)
    var elapsedSeconds = currentTime - initialTime
    totalElapsedSeconds += elapsedSeconds

    initialTime = currentTime

    selectedVideo.IncreaseWatchDuration(searchParams.get('v'),totalElapsedSeconds)

    await Utils.Sleep(5*1000)
    ticker()
  }

  return (
    <main className={`pb-[100px] ${mobileMode ? "" : "m-6"}`}>
      <div className={`flex ${mobileMode ? "flex-col" : ""}`}>
        <div className='w-full mr-4 mb-4'>
          <div ref={videoPlayerDivRef} id="video-content" className={`w-full ${mobileMode ? "fixed z-1 top-16" : ""}`}>
            <YouTube id="video-player" videoId={searchParams.get('v')} opts={{
              height: `${videoPlayerHeight}`,
              width: '100%',
              playerVars: {
                // https://developers.google.com/youtube/player_parameters
                autoplay: 1,
              },
            }} />
          </div>
          <div className={`${mobileMode ? "mt-[250px]" : "mt-4"}`}>
            <span className="font-semibold text-2xl text-gray-900 leading-5">{selectedVideo.video_title}</span>
          </div>
          <div className='flex justify-between items-center mt-2'>
            <div className='flex items-center'>
              <Link href={`/channel?channel_id=${selectedVideo.channel_id}`}>
                <img src={selectedVideo.creator_image_url} alt="Avatar" className="h-10 w-10 rounded-full" />
              </Link>
              <span className='text-lg font-semibold text-gray-800 ml-4'>{selectedVideo.creator_name}</span>
            </div>
            <div className='flex'>
              <button className='py-1 px-3 rounded-full text-black bg-gray-200 hover:bg-gray-300'>
                <i className="fa-solid fa-circle-arrow-up"></i> Upvote
              </button>
              <button className='py-1 px-3 rounded-full text-black bg-gray-200 hover:bg-gray-300 ml-2'>
                <i className="fa-solid fa-circle-arrow-down"></i> Downvote
              </button>
            </div>
          </div>
          <div className='p-4 bg-gray-200 mt-4 rounded-lg'>
            <div>
            </div>
            <div>
              <span className="text-xs mt-1 text-gray-700"><i className="fa-solid fa-eye"/> {selectedVideo.GetViewedCount()}x viewed﹒<i className="fa-solid fa-clock"/> {selectedVideo.GetWatchedDuration(searchParams.get('v'))} mins watched</span>
            </div>
          </div>
        </div>
        <div id="suggestion-content" className={`${mobileMode ? "" : "min-w-[402px]"}`}>
          {videoList.map((oneVideo)=>(
            <div className='mb-5 flex' key={`${oneVideo.ytkidd_id}-${Math.random() * 100000}`}>
              <div className='min-w-[168px] max-w-[168px] h-[94px]'>
                <Link href={`/watch?ytkidd_id=${oneVideo.ytkidd_id}&v=${oneVideo.video_id}`}>
                  <img
                    className={`${mobileMode ? "" : "rounded-xl"} shadow-md w-full h-full`}
                    src={oneVideo.video_image_url}
                    alt="thumb"
                  />
                </Link>
              </div>
              <Link href={`/watch?ytkidd_id=${oneVideo.ytkidd_id}&v=${oneVideo.video_id}`} className='pr-2'>
                <div className='w-full ml-2 flex flex-col'>
                  <span className="font-medium text-md text-gray-900 leading-5">{oneVideo.shorted_video_title}</span>
                  <span className="flex text-sm text-gray-800 mt-1 items-center">
                    <Link href={`/channel?channel_id=${oneVideo.channel_id}`} className="flex-none mr-2">
                      <img src={oneVideo.creator_image_url} alt="Avatar" className="w-full max-h-7 min-h-7 max-w-7 min-w-7 rounded-full" />
                    </Link>
                    <span className='flex-auto'>{oneVideo.creator_name}</span>
                  </span>
                  <span className="text-xs mt-1 text-gray-700"><i className="fa-solid fa-eye"/> {oneVideo.GetViewedCount()}x viewed﹒<i className="fa-solid fa-clock"/> {oneVideo.GetWatchedDuration()} mins watched</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

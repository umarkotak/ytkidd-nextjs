'use client'

import { useCallback, useEffect, useState } from 'react'
import Utils from '@/models/Utils'
import YtVideo from '@/models/YtVideo'

export const useGetVideos = () => {
  const isFetching = true
  const limit = 20
  const [allVideos, setAllVideos] = useState([])
  const [searchVideos, setSearchVideos] = useState({
    data: [],
    isLoading: false,
  })
  const [data, setData] = useState({
    data: [],
    isLoading: false,
  })

  const fetchingData = useCallback(async () => {
    setData({ ...data, isLoading: true })
    try {
      fetch('/data/db.json')
        .then((response) => response.json())
        .then((json) => {
          const arr = []
          json.forEach((v) => {
            const ytVideo = new YtVideo(v)

            if (localStorage.getItem(`YTKIDD:BLACKLIST_CHANNEL:${ytVideo.channel_id}`)) {
              return
            }

            arr.push(ytVideo)
          })

          const allVideo = Utils.ShuffleArray(arr)
          setAllVideos(allVideo)
          setData({
            ...data,
            data: allVideo.slice(0, limit),
            isLoading: false,
          })
        })
    } catch (error) {
      console.error(error)
    }
  })

  const fetchingDataWithPagination = useCallback(async (params) => {
    setData({ ...data, isLoading: true })
    try {
      setData({
        ...data,
        data: allVideos.slice(0, params?.limit || limit),
        isLoading: false,
      })
    } catch (error) {
      console.error(error)
    }
  })

  const searchVideosWithKeyword = useCallback(async (params) => {
    try {
      setSearchVideos({ ...data, isLoading: params?.keyword !== null ? true : false })
      const search = !!params?.keyword
        ? allVideos.filter((item) =>
            item.video_title.toLowerCase().includes(params?.keyword.toLowerCase()),
          )
        : []
      setTimeout(() => {
        setSearchVideos({
          ...data,
          data: search,
          isLoading: false,
        })
      }, 1000)
    } catch (error) {
      setSearchVideos({ ...data, isLoading: false })
      console.error(error)
    }
  })

  useEffect(() => {
    if (isFetching) fetchingData()
  }, [isFetching])

  return {
    ...data,
    allVideos,
    searchVideos,
    limit,
    fetchingDataWithPagination,
    searchVideosWithKeyword,
  }
}

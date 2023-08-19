'use client'

import { useCallback, useEffect, useState } from 'react'
import Utils from '@/models/Utils'
import YtVideo from '@/models/YtVideo'

export const useGetVideos = () => {
  const isFetching = true
  const limit = 20
  const [allVideos, setAllVideos] = useState([])
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

  useEffect(() => {
    if (isFetching) fetchingData()
  }, [isFetching])

  return { ...data, limit, fetchingDataWithPagination }
}

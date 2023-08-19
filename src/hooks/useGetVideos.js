'use client'

import { useCallback, useEffect, useState } from 'react'
import Utils from '@/models/Utils'
import YtVideo from '@/models/YtVideo'

export const useGetVideos = () => {
  const isFetching = true
  const [data, setData] = useState({
    limit: 20,
    data: [],
    isLoading: false,
  })

  const fetchingData = useCallback(async ({ params = {} }) => {
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
          setData({
            ...data,
            data: allVideo.slice(0, params?.limit || data.limit),
            isLoading: false,
          })
        })
    } catch (error) {
      console.error(error)
    }
  })

  useEffect(() => {
    if (isFetching) fetchingData({ params: {} })
  }, [isFetching])

  return { ...data, fetchingData }
}

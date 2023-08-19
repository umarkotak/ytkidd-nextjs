'use client'

import { useCallback, useEffect, useState } from 'react'
import Utils from '@/models/Utils'

export const useGetChannels = () => {
  const isFetching = true
  const [data, setData] = useState({
    data: [],
    isLoading: false,
  })

  const fetchingData = useCallback(async () => {
    setData({ ...data, isLoading: true })
    try {
      fetch('/data/creator.json')
        .then((response) => response.json())
        .then((json) => {
          const arr = json.map((v) => {
            return v
          })

          const allChannels = Utils.ShuffleArray(arr)
          setData({
            ...data,
            data: allChannels,
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



import { useCallback, useEffect, useState } from 'react'
import Utils from '@/models/Utils'

/**
 *
 * @param {Boolean} isRandomList
 * @returns
 */
export const useGetChannels = ({ isRandomList }) => {
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

          const allChannels = isRandomList ? Utils.ShuffleArray(arr) : arr
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
    if (isFetching) fetchingData()
  }, [isFetching])

  return { ...data, fetchingData }
}

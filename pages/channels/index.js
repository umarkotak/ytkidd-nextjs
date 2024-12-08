

import ytkiddAPI from '@/apis/ytkidApi'
import Utils from '@/models/Utils'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Channels() {
  const [channelList, setChannelList] = useState([])
  const [blacklistChannelMap, setBlacklistChannelMap] = useState({})

  useEffect(() => {
    GetChannelList({})
    initializeBlacklistChannelMap()
  }, [])

  async function GetChannelList(params) {
    try {
      const response = await ytkiddAPI.GetChannels("", {}, params)
      const body = await response.json()
      if (response.status !== 200) {
        return
      }

      setChannelList(body.data)
    } catch (e) {
      console.error(e)
    }
  }

  function initializeBlacklistChannelMap() {
    if (!localStorage.getItem(`YTKIDD:BLACKLIST_CHANNEL_MAP`)) {
      localStorage.setItem(`YTKIDD:BLACKLIST_CHANNEL_MAP`, '{}')
    }
    var tmpBlacklistChannelMap = JSON.parse(localStorage.getItem(`YTKIDD:BLACKLIST_CHANNEL_MAP`))
    setBlacklistChannelMap(tmpBlacklistChannelMap)
  }

  function handleCheckChange(e, channelID) {
    if (!localStorage.getItem(`YTKIDD:BLACKLIST_CHANNEL_MAP`)) {
      localStorage.setItem(`YTKIDD:BLACKLIST_CHANNEL_MAP`, '{}')
    }

    var tmpBlacklistChannelMap = JSON.parse(localStorage.getItem(`YTKIDD:BLACKLIST_CHANNEL_MAP`))

    if (e.target.checked) {
      tmpBlacklistChannelMap[channelID] = false
    } else {
      tmpBlacklistChannelMap[channelID] = true
    }

    localStorage.setItem(`YTKIDD:BLACKLIST_CHANNEL_MAP`, JSON.stringify(tmpBlacklistChannelMap))
    setBlacklistChannelMap(tmpBlacklistChannelMap)
  }

  function checkAll() {
    localStorage.setItem(`YTKIDD:BLACKLIST_CHANNEL_MAP`, '{}')
    setBlacklistChannelMap({})
  }

  function unCheckAll() {
    var tmpBlacklistChannelMap = {}
    channelList.forEach((oneChannel) => {
      tmpBlacklistChannelMap[oneChannel.id] = true
    })
    localStorage.setItem(`YTKIDD:BLACKLIST_CHANNEL_MAP`, JSON.stringify(tmpBlacklistChannelMap))
    setBlacklistChannelMap(tmpBlacklistChannelMap)
  }

  return (
    <main className="pb-[100px] p-4">
      <div className="mb-6 flex flex-row items-center justify-between">
        <div>
          <h1 className="text-xl">Channel List</h1>
          <small>you can enable or disable channel into your needs</small>
        </div>
        <div className='flex gap-2'>
          <button className='btn btn-sm bg-green-200' onClick={()=>checkAll()}>Check All</button>
          <button className='btn btn-sm bg-red-200' onClick={()=>unCheckAll()}>Uncheck All</button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 gap-x-5 gap-y-8">
        {channelList.map((oneChannel) => (
          <div
            key={oneChannel.id}
            className="flex flex-col justify-between p-2 border rounded-xl"
          >
            <div>
              <div className="min-h-40 max-h-40 overflow-hidden items-center flex flex-col rounded-xl">
                <img
                  className="shadow-md w-full rounded-xl"
                  src={oneChannel.image_url}
                  alt="thumb"
                />
              </div>
              <Link
                href={`/channels/${oneChannel.id}`}
                className="flex justify-center mt-[-160px] backdrop-blur-2xl pt-10 pb-10 rounded-xl hover:bg-blue-500 hover:bg-opacity-50"
              >
                <img
                  className="min-h-24 max-h-24 rounded-full border-white border-4"
                  src={oneChannel.image_url}
                  alt="thumb"
                />
              </Link>
            </div>
            <Link
              href={`/channels/${oneChannel.id}`}
              className="grow flex flex-col justify-start my-3 bg-white rounded-full"
            >
              <span className="text-md text-black font-medium">{oneChannel.name}</span>
              <small className="">{oneChannel.string_tags}</small>
            </Link>
            <div className="flex flex-col">
              <div className="flex justify-end">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    value=""
                    className="sr-only peer"
                    defaultChecked={!blacklistChannelMap[oneChannel.id]}
                    checked={!blacklistChannelMap[oneChannel.id]}
                    onChange={(e) => handleCheckChange(e, oneChannel.id)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

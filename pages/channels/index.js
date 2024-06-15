

import Link from 'next/link'

import { useGetChannels } from '@/hooks'

export default function Channels() {
  const { data: channelList } = useGetChannels({ isRandomList: false })

  function getDefaultChecked(channelID) {
    if (localStorage.getItem(`YTKIDD:BLACKLIST_CHANNEL:${channelID}`)) {
      return false
    }

    return true
  }

  function handleCheckChange(e, channelID) {
    if (e.target.checked) {
      localStorage.removeItem(`YTKIDD:BLACKLIST_CHANNEL:${channelID}`)
    } else {
      localStorage.setItem(`YTKIDD:BLACKLIST_CHANNEL:${channelID}`, 'true')
    }
  }

  return (
    <main className="pb-[100px] p-4">
      <div className="mb-6">
        <h1 className="text-xl">Channel List</h1>
        <small>you can enable or disable channel into your needs</small>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 gap-x-5 gap-y-8">
        {channelList.map((oneChannel) => (
          <div
            key={oneChannel.channel_id}
            className="flex flex-col justify-between p-2 border rounded-xl"
          >
            <div>
              <div className="min-h-40 max-h-40 overflow-hidden items-center flex flex-col rounded-xl">
                {/* <Link href={`/channel?channel_id=${oneChannel.channel_id}`}> */}
                <img
                  className="shadow-md w-full rounded-xl"
                  src={oneChannel.channel_image_url}
                  alt="thumb"
                />
                {/* </Link> */}
              </div>
              <Link
                href={`/channel?channel_id=${oneChannel.channel_id}`}
                className="flex justify-center mt-[-160px] backdrop-blur-2xl pt-10 pb-10 rounded-xl hover:bg-blue-500 hover:bg-opacity-50"
              >
                <img
                  className="min-h-24 max-h-24 rounded-full border border-white border-4"
                  src={oneChannel.channel_image_url}
                  alt="thumb"
                />
              </Link>
            </div>
            <Link
              href={`/channel?channel_id=${oneChannel.channel_id}`}
              className="grow flex flex-col justify-start my-3 bg-white rounded-full"
            >
              <span className="text-lg text-black font-semibold">{oneChannel.channel_name}</span>
              <small className="">{oneChannel.string_tags}</small>
            </Link>
            <div className="flex flex-col">
              <div className="flex justify-end">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    value=""
                    className="sr-only peer"
                    defaultChecked={getDefaultChecked(oneChannel.channel_id)}
                    onChange={(e) => handleCheckChange(e, oneChannel.channel_id)}
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

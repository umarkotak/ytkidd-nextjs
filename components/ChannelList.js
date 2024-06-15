

import Link from 'next/link'

export default function ChannelList({ channelId, channelImageUrl, channelName }) {
  return (
    <>
      <Link
        href={`/channel?channel_id=${channelId}`}
        className="flex-shrink-0 py-2 pl-2 pr-3 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center mr-2"
        key={channelId}
      >
        <img src={channelImageUrl} className="h-6 w-6 rounded-full mr-2" />
        <span className="text-sm">{channelName}</span>
      </Link>
    </>
  )
}

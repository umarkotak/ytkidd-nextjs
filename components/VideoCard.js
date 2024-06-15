

import Link from 'next/link'

export default function VideoCard({
  ytkiddId,
  videoId,
  videoImageUrl,
  channelId,
  creatorImageUrl,
  shortedVideoTitle,
  creatorName,
  viewedCounts,
  watchedDurations,
}) {
  return (
    <div className="">
      <div className=''>
        <Link className='' href={`/watch?ytkidd_id=${ytkiddId}&v=${videoId}`}>
          <img className="rounded-xl shadow-md w-full hover:scale-105 transition duration-500" src={videoImageUrl} alt="thumb" onLoad={(e) => {
            if (e.target.width/e.target.height < 1.4) {
              e.target.src = "/images/no_video.png"
            }
          }} />
        </Link>
      </div>
      <div className="flex mt-2">
        <div className="min-w-[50px] p-1">
          <Link href={`/channel?channel_id=${channelId}`} className="">
            <img src={creatorImageUrl} alt="Avatar" className="h-10 w-10 rounded-full shadow-md hover:scale-105 transition duration-500" />
          </Link>
        </div>
        <Link href={`/watch?ytkidd_id=${ytkiddId}&v=${videoId}`}>
          <div className="flex flex-col w-full ml-1 pr-2 hover:scale-105 transition duration-500">
            <span className="font-medium text-md text-gray-900 break-words tracking-tight line-clamp-2">
              {shortedVideoTitle}
            </span>
            <span className="text-sm break-words">{creatorName}</span>
          </div>
        </Link>
      </div>
    </div>
  )
}

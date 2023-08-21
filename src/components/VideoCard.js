'use client'

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
      <div>
        <Link href={`/watch?ytkidd_id=${ytkiddId}&v=${videoId}`}>
          <img className="rounded-xl shadow-md w-full" src={videoImageUrl} alt="thumb" />
        </Link>
      </div>
      <div className="flex mt-2">
        <div className="min-w-[50px] p-1">
          <Link href={`/channel?channel_id=${channelId}`} className="">
            <img src={creatorImageUrl} alt="Avatar" className="h-10 w-10 rounded-full" />
          </Link>
        </div>
        <Link href={`/watch?ytkidd_id=${ytkiddId}&v=${videoId}`}>
          <div className="flex flex-col w-full ml-1 pr-2">
            <span className="font-medium text-md text-gray-900 break-words">
              {shortedVideoTitle}
            </span>
            <span className="text-sm break-words">{creatorName}</span>
            <span className="text-xs mt-1">
              <i className="fa-solid fa-eye" /> {viewedCounts} x viewed﹒
              <i className="fa-solid fa-clock" /> {watchedDurations} mins watched
            </span>
          </div>
        </Link>
      </div>
    </div>
  )
}

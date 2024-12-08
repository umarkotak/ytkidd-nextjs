

import Link from 'next/link'

export default function VideoCard({
  ytkiddId,
  videoImageUrl,
  channelId,
  creatorImageUrl,
  shortedVideoTitle,
  creatorName,
}) {
  return (
    <div className="">
      <div className=''>
        <Link className='' href={`/watch/${ytkiddId}`}>
          <img className="rounded-xl shadow-md w-full hover:scale-105 transition duration-500" src={videoImageUrl} alt="thumb" onLoad={(e) => {
            if (e.target.width/e.target.height < 1.4) {
              e.target.src = "/images/no_video.png"
            }
          }} />
        </Link>
      </div>
      <div className="flex mt-2">
        <div className="min-w-[50px] p-1">
          <Link href={`/channels/${channelId}`} className="">
            <img src={creatorImageUrl} alt="Avatar" className="h-10 w-10 rounded-full shadow-md hover:scale-105 transition duration-500" />
          </Link>
        </div>
        <Link href={`/watch/${ytkiddId}`}>
          <div className="flex flex-col w-full ml-1 pr-2 hover:scale-105 transition duration-500">
            <span className="text-[16px] font-medium text-gray-900 break-words tracking-tight line-clamp-2">
              {shortedVideoTitle}
            </span>
            <span className="text-[14px] break-words mt-1">{creatorName}</span>
          </div>
        </Link>
      </div>
    </div>
  )
}

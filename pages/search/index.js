

import { useGetVideos } from '@/hooks'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import Link from 'next/link'
import { Img } from 'react-image'

export default function Search() {
  const { searchVideosWithKeyword, searchVideos } = useGetVideos()
  const keywordSearch = useSearchParams()?.get('keyword')

  const resultText = keywordSearch && !searchVideos?.data.length ? 'Result not found' : 'Result'
  const descriptionText =
    keywordSearch && searchVideos?.data.length > 0
      ? `About ${searchVideos?.data.length} videos`
      : 'enter keywords to find your video'

  useEffect(() => {
    searchVideosWithKeyword({ keyword: keywordSearch })
  }, [keywordSearch])

  if (searchVideos?.isLoading) {
    return (
      <main className="pb-[100px] p-4">
        <div className="w-full mx-auto pb-10">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-2 bg-slate-300 rounded h-3 w-20"></div>
            <div className="h-2 bg-slate-300 rounded h-3 w-60"></div>
          </div>
        </div>
        {[...Array(4).keys()].map((index) => (
          <div key={index} className="rounded-md w-full mx-auto pb-4">
            <div className="animate-pulse flex space-x-2">
              <div className="rounded-xl bg-slate-300 h-24 w-44"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-2 bg-slate-300 rounded h-3 w-60"></div>
                <div className="h-2 bg-slate-300 rounded h-3 w-40"></div>
                <div className="h-2 bg-slate-300 rounded h-3 w-40"></div>
              </div>
            </div>
          </div>
        ))}
      </main>
    )
  }

  return (
    <main className="pb-[100px] p-4">
      <div className="mb-6">
        <h1 className="text-xl">{resultText}</h1>
        <small>{descriptionText}</small>
      </div>
      <div className="w-full">
        {searchVideos?.data?.map((oneVideo, idx) => (
          <div className="mb-5 flex" key={idx}>
            <div className="min-w-[168px] max-w-[168px] h-[94px]">
              <Link href={`/watch?ytkidd_id=${oneVideo.ytkidd_id}&v=${oneVideo.video_id}`}>
                <img
                  className="rounded-xl shadow-md w-full h-full"
                  src={oneVideo.video_image_url}
                  alt="thumb"
                />
              </Link>
            </div>
            <Link
              href={`/watch?ytkidd_id=${oneVideo.ytkidd_id}&v=${oneVideo.video_id}`}
              className="pr-2"
            >
              <div className="w-full ml-2 flex flex-col">
                <span className="font-medium text-md text-gray-900">{oneVideo.video_title}</span>
                <span className="flex text-sm text-gray-800 mt-1 items-center">
                  <Link
                    href={`/channel?channel_id=${oneVideo.channel_id}`}
                    className="flex-none mr-2"
                  >
                    <Img
                      src={[
                        oneVideo.creator_image_url,
                        oneVideo.creator_image_url,
                        '/images/youtube.png',
                      ]}
                      alt="Avatar"
                      className="w-full max-h-7 min-h-7 max-w-7 min-w-7 rounded-full"
                    />
                  </Link>
                  <span className="flex-auto">{oneVideo.creator_name}</span>
                </span>
                <span className="text-xs mt-1 text-gray-700">
                  <i className="fa-solid fa-eye" /> {oneVideo.GetViewedCount(oneVideo.video_id)}x
                  viewed﹒
                  <i className="fa-solid fa-clock" />{' '}
                  {oneVideo.GetWatchedDuration(oneVideo.video_id)} mins watched
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </main>
  )
}

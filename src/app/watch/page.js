'use client'

import { useRef, useState, useEffect } from 'react'
import YouTube from 'react-youtube'

export default function Watch() {
  const videoPlayerDivRef = useRef()

  const [videoPlayerHeight, setVideoPlayerHeight] = useState(360)

  useEffect(() => {
    if (!videoPlayerDivRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      var res = Math.floor(videoPlayerDivRef.current.offsetWidth / (16 / 9))
      setVideoPlayerHeight(res)
    });
    resizeObserver.observe(videoPlayerDivRef.current);
    return () => resizeObserver.disconnect(); // clean up
  }, []);

  return (
    <main className='ml-2 mr-4'>
      <div className="flex">
        <div ref={videoPlayerDivRef} id="video-content" className="w-full mr-4">
          <YouTube id="video-player" videoId="CstEyd_-Whk" opts={{
            height: `${videoPlayerHeight}`,
            width: '100%',
            playerVars: {
              // https://developers.google.com/youtube/player_parameters
              autoplay: 0,
            },
          }} />
        </div>
        <div id="suggestion-content" className="min-w-[402px]">
          {[1,2,3,4,5,6,7,8,9,10,1,2,3,4,5,6,7,8,9,10,1,2].map((v)=>(
            <div className='mb-4 flex'>
              <div className='min-w-[168px] h-[94px]'>
                <img className="rounded-xl shadow-md w-full h-full" src="https://i.ytimg.com/vi/cl2P-B7T3Xo/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDhtsv7HeAkn4kwLhnnXdkYm4XtBw" alt="thumb" />
              </div>
              <div className='w-full ml-2 flex flex-col'>
                <span className="font-medium text-md text-gray-900 leading-5">Some long title goes here and here and there somewhere...</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

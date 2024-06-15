

import ReactHlsPlayer from "@ducanh2912/react-hls-player"

export default function HlsPlayer() {

  return (
    <main className="pb-[100px] p-4 w-full">
      <div className='mb-6'>
        <h1 className='text-xl'>Watch Statistic</h1>
        <small>track how much you watch video</small>
      </div>
      <div className="w-full">
        <ReactHlsPlayer
          src="https://ww2.video-content-cdn.com/www032.vipanicdn.net/streamhls/af098cf8bdc24ea7207c1c3da0397a3c/ep.1.1681177011.720.m3u8"
          autoPlay={false}
          controls={true}
          width="100%"
          height="auto"
        />
      </div>
    </main>
  )
}

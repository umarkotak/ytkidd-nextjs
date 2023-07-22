import Link from 'next/link'

export default function Home() {
  return (
    <main className='pb-[100px] p-4'>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">
        {[1,2,3,4,5,6,7,8,9,10,1,2,3,4,5,6,7,8,9,10,1,2].map((v)=>(
          <div>
            <div>
              <Link href="/watch">
                <img className="rounded-xl shadow-md" src="https://i.ytimg.com/vi/cl2P-B7T3Xo/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDhtsv7HeAkn4kwLhnnXdkYm4XtBw" alt="thumb" />
              </Link>
            </div>
            <div className="flex mt-2">
              <div className="min-w-[50px] p-1">
                <Link href="/watch" className="">
                  <img src="http://placekitten.com/300/300" alt="Avatar" className="h-10 w-10 rounded-full" />
                </Link>
              </div>
              <Link href="/watch">
                <div className="flex flex-col w-full ml-1 pr-2">
                  <span className="font-medium text-md text-gray-900">Some long title goes here and here and there somewhere...</span>
                  <span className="text-sm">yt kidd </span>
                  <span className="text-xs mt-1"><i className="fa-solid fa-eye"/> 0x viewed﹒<i className="fa-solid fa-clock"/> 10 mins watched</span>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

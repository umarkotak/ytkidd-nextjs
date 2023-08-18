'use client'

import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="fixed z-50 top-0 border-b-2 border-gray-200 w-full bg-white px-4 flex justify-between items-center h-16" style={{zIndex: 10}}>
      <div className="flex items-center">
        <div className="mr-4">
          <button className="p-1" onClick={() => {HideSideBar()}}>
            <i className="fa-solid fa-bars" />
          </button>
        </div>
        <div>
          <Link href="/">
            <h1 className="text-xl font-bold text-gray-800">YT Kidd</h1>
          </Link>
        </div>
      </div>

      <div className="w-1/2">
        <div className="relative flex items-center">
          <input type="text" placeholder="Search" className="w-full border border-gray-400 rounded-full px-4 py-2 focus:outline-none focus:ring focus:border-blue-300 text-gray-600 placeholder-gray-400" />
          <button className="ml-[-55px] py-2 px-4 hover:bg-gray-100 rounded-full">
            <i className="fa-solid fa-magnifying-glass" />
          </button>
        </div>
      </div>

      <div>
        <img src="/images/youtube.png" alt="Avatar" className="h-8 w-8 rounded-full" />
      </div>
    </nav>
  )
}

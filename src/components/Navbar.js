'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useSearchParams } from 'next/navigation'
import { useCronitor } from '@cronitorio/cronitor-rum-nextjs'

export default function Navbar() {
  useCronitor('3f97b0a02f683b7af499e046f0495786', {
    debug: false
  })

  const router = useRouter()
  const keywordSearch = useSearchParams()?.get('keyword')
  const [keyword, setKeyword] = useState('')

  const onSearch = () => {
    router.push(`/search?keyword=${keyword}`)
  }

  const handleKeyDown = (event) => {
    // trigger search when press Enter
    if (event.key === 'Enter') router.push(`/search?keyword=${keyword}`)
  }

  function HideSideBar() {
    var element = document.getElementById("sidebar")
    element.classList.toggle("hidden")

    if (window.location.pathname === "/watch") {
      return
    }

    if (window.innerWidth <= 470) {
      var element = document.getElementById("content-section")
      element.classList.remove("ml-[200px]")
      element.classList.add("mobile-mode")
    } else {
      var element = document.getElementById("content-section")
      element.classList.toggle("ml-[200px]")
    }
  }

  return (
    <nav
      className="fixed z-50 top-0 border-b-2 border-gray-200 w-full bg-white px-4 flex justify-between items-center h-16"
      style={{ zIndex: 10 }}
    >
      <div className="flex items-center">
        <div className="mr-4">
          <button
            className="p-1"
            onClick={() => {
              HideSideBar()
            }}
          >
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
          <div className="w-full">
            <input
              type="text"
              placeholder="Search"
              className="w-full border border-gray-400 rounded-full px-4 py-2 focus:outline-none focus:ring focus:border-blue-300 text-gray-600 placeholder-gray-400"
              onFocus={() => (!keywordSearch ? router.push('/search') : () => {})}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="ml-[-55px] py-2 px-4 hover:bg-gray-100 rounded-full"
              onClick={() => onSearch()}
            >
              <i className="fa-solid fa-magnifying-glass" />
            </button>
          </div>
        </div>
      </div>

      <div>
        <img src="/images/youtube.png" alt="Avatar" className="h-8 w-8 rounded-full" />
      </div>
    </nav>
  )
}

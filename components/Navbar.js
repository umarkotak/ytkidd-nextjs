import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useSearchParams } from 'next/navigation'
import { useCronitor } from '@cronitorio/cronitor-rum-nextjs'
import { LogInIcon, Menu } from 'lucide-react'

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
      element.classList.remove("pl-[200px]")
      element.classList.add("mobile-mode")
    } else {
      var element = document.getElementById("content-section")
      element.classList.toggle("pl-[200px]")
    }
  }

  return (
    <nav
      className="fixed z-40 top-0 border-b-2 border-gray-300 w-full bg-white px-4 flex justify-between items-center h-12 backdrop-blur-md bg-opacity-50 shadow-sm"
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
            <Menu />
          </button>
        </div>
        <div>
          <a href="/" className='flex flex-row gap-0 items-center'>
            <img src="/images/cookie_kid_logo_circle.png" className='w-10 h-10' />
            <h1 className="text-xl font-bold text-gray-800">Cookie Kid</h1>
          </a>
        </div>
      </div>

      <div className='flex gap-2 items-center'>
        <Link href="/login" className='btn btn-sm'><LogInIcon size={14} /> login</Link>
        <img src="https://placehold.co/200" alt="Avatar" className="h-8 w-8 rounded-full" />
      </div>
    </nav>
  )
}

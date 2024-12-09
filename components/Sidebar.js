

import { useState, useEffect } from "react"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart2, Book, Home, Pencil, School, Settings, UserCheck } from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()

  const [activeMenu, setActiveMenu] = useState({})

  useEffect(() => {
    const onResize = () => {
      var element = document.getElementById("content-section")
      if (window.location.pathname === "/watch") {
        return
      }

      if (window.innerWidth <= 470) {
        element.classList.remove("pl-[200px]")
        element.classList.add("mobile-mode")
      } else if (element.classList.contains("mobile-mode")) {
        element.classList.remove("mobile-mode")
        var sideElement = document.getElementById("sidebar")
        if (!sideElement.classList.contains("hidden")) {
          element.classList.add("pl-[200px]")
        }
      }
    }

    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("resize", onResize)
    }
  }, [])

  useEffect(() => {
    var sideElement = document.getElementById("sidebar")
    var element = document.getElementById("content-section")

    if (window.innerWidth <= 470 || `${pathname}`.startsWith("/watch")) {
      sideElement.classList.add("hidden")
      element.classList.remove("pl-[200px]")
    } else {
      sideElement.classList.remove("hidden")
      element.classList.add("pl-[200px]")
    }
  }, [pathname])

  return (
    <div id="sidebar" className={`fixed z-50 bg-white border-r-2 border-gray-200 text-black h-screen w-[200px]`}>
      <div className="flex flex-col py-2">
        <Link href="/">
          <div className={`px-5 py-2 ${pathname === "/" ? "bg-gray-200" : "bg-white"} hover:bg-gray-300 flex items-center`}>
            <Home size={18} /><span className="ml-2">Home</span>
          </div>
        </Link>
        <Link href="/channels">
          <div className={`px-5 py-2 ${`${pathname}`.startsWith("/channels") ? "bg-gray-200" : "bg-white"} hover:bg-gray-300 flex items-center`}>
            <UserCheck size={18} /><span className="ml-2">Channels</span>
          </div>
        </Link>
        <Link href="/books">
          <div className={`px-5 py-2 ${`${pathname}`.startsWith("/books") ? "bg-gray-200" : "bg-white"} hover:bg-gray-300 flex items-center`}>
            <Book size={18} /><span className="ml-2">Books</span>
          </div>
        </Link>
        <Link href="/drawing">
          <div className={`px-5 py-2 ${pathname === "/drawing" ? "bg-gray-200" : "bg-white"} hover:bg-gray-300 flex items-center`}>
            <Pencil size={18} /><span className="ml-2">Drawing</span>
          </div>
        </Link>
        <Link href="/learn">
          <div className={`px-5 py-2 ${`${pathname}`.startsWith("/learn") ? "bg-gray-200" : "bg-white"} hover:bg-gray-300 flex items-center`}>
            <School size={18} /><span className="ml-2">Learn</span>
          </div>
        </Link>
        <Link href="/stats">
          <div className={`px-5 py-2 ${`${pathname}`.startsWith("/stats") ? "bg-gray-200" : "bg-white"} hover:bg-gray-300 flex items-center`}>
            <BarChart2 size={18} /><span className="ml-2">Stats</span>
          </div>
        </Link>
        <Link href="/setting">
          <div className={`px-5 py-2 ${`${pathname}`.startsWith("/setting") ? "bg-gray-200" : "bg-white"} hover:bg-gray-300 flex items-center`}>
            <Settings size={18} /><span className="ml-2">Setting</span>
          </div>
        </Link>
        <span className="text-center">
          ﹒
        </span>
        <a href="https://trakteer.id/marumaru" target="_blank" className="px-5 py-2">
          <img
            id="wse-buttons-preview"
            src="https://cdn.trakteer.id/images/embed/trbtn-red-1.png"
            height="40"
            style={{border:"0px", height:"40px"}}
            alt="Trakteer Saya"
            className="w-full"
          />
        </a>
        <span className="text-center">
          ﹒
        </span>
        <span className="px-5 text-xs" onClick={()=>console.log(activeMenu)}>
          A youtube content library curated by human for kids
        </span>
        <span className="hidden">
          tailwind class trigger
        </span>
      </div>
    </div>
  )
}

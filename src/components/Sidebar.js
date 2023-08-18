'use client'

import { useState, useEffect } from "react"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
        element.classList.remove("ml-[200px]")
        element.classList.add("mobile-mode")
      } else if (element.classList.contains("mobile-mode")) {
        element.classList.remove("mobile-mode")
        var sideElement = document.getElementById("sidebar")
        if (!sideElement.classList.contains("hidden")) {
          element.classList.add("ml-[200px]")
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

    if (window.innerWidth <= 470 || pathname === "/watch") {
      sideElement.classList.add("hidden")
      element.classList.remove("ml-[200px]")
    } else {
      sideElement.classList.remove("hidden")
      element.classList.add("ml-[200px]")
    }
  }, [pathname])

  function DecideContentSectionMargin() {

  }

  return (
    <div id="sidebar" className={`fixed z-50 bg-white border-r-2 border-gray-200 text-black h-screen w-[200px]`}>
      <div className="flex flex-col py-2">
        <Link href="/">
          <div className={`px-5 py-2 ${pathname === "/" ? "bg-gray-100" : "bg-white"} hover:bg-gray-200`}>
            <i className="fa-solid fa-house w-[34px]"/><span className="">Home</span>
          </div>
        </Link>
        <Link href="/channels">
          <div className={`px-5 py-2 ${pathname === "/channels" ? "bg-gray-100" : "bg-white"} hover:bg-gray-200`}>
            <i className="fa-solid fa-user-check w-[34px]"/><span className="">Channels</span>
          </div>
        </Link>
        <Link href="/stats">
          <div className={`px-5 py-2 ${pathname.startsWith("/stats") ? "bg-gray-100" : "bg-white"} hover:bg-gray-200`}>
            <i className="fa-solid fa-chart-simple w-[34px]"/><span className="">Stats</span>
          </div>
        </Link>
        {/* <Link href="/setting">
          <div className={`px-5 py-2 ${pathname.startsWith("/setting") ? "bg-gray-100" : "bg-white"} hover:bg-gray-200`}>
            <i className="fa-solid fa-gear w-[34px]"/><span className="">Setting</span>
          </div>
        </Link> */}
        {/* <Link href="/about">
          <div className={`px-5 py-2 ${pathname.startsWith("/about") ? "bg-gray-100" : "bg-white"} hover:bg-gray-200`}>
            <i className="fa-solid fa-face-smile w-[34px]"/><span className="">About</span>
          </div>
        </Link> */}
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

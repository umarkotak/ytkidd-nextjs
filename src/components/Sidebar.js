'use client'

import { useState, useEffect } from "react"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()

  const [sideBarFixed, setSideBarFixed] = useState(true)

  const [activeMenu, setActiveMenu] = useState({})

  useEffect(() => {
    var key = window.location.pathname
    var tempActiveMenu = {}
    tempActiveMenu[key] = true
    setActiveMenu(tempActiveMenu)
  }, [])

  return (
    <div id="sidebar" className={`${sideBarFixed ? "fixed" : ""} bg-white border-r-2 border-gray-200 text-black h-screen w-[200px]`}>
      <div className="flex flex-col py-2">
        <Link href="/">
          <div className={`px-5 py-2 ${pathname === "/" ? "bg-gray-100" : "bg-white"} hover:bg-gray-200`}>
            <i className="fa-solid fa-house w-[34px]"/><span className="">Home</span>
          </div>
        </Link>
        <Link href="/stats">
          <div className={`px-5 py-2 ${pathname.startsWith("/stats") ? "bg-gray-100" : "bg-white"} hover:bg-gray-200`}>
            <i className="fa-solid fa-chart-simple w-[34px]"/><span className="">Stats</span>
          </div>
        </Link>
        <Link href="/setting">
          <div className={`px-5 py-2 ${pathname.startsWith("/setting") ? "bg-gray-100" : "bg-white"} hover:bg-gray-200`}>
            <i className="fa-solid fa-gear w-[34px]"/><span className="">Setting</span>
          </div>
        </Link>
        <Link href="/about">
          <div className={`px-5 py-2 ${pathname.startsWith("/about") ? "bg-gray-100" : "bg-white"} hover:bg-gray-200`}>
            <i className="fa-solid fa-face-smile w-[34px]"/><span className="">About</span>
          </div>
        </Link>
        <span className="text-center">
          ﹒
        </span>
        <span className="px-5 text-xs" onClick={()=>console.log(activeMenu)}>
          A youtube content library curated by human for kids
        </span>
      </div>
    </div>
  )
}

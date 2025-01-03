

import { useState, useEffect } from "react"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart2, Book, BotMessageSquare, Gamepad2, Home, Pencil, School, Settings, UserCheck } from "lucide-react"

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

    if (window.innerWidth <= 470 || `${pathname}`.startsWith("/watch") || `${pathname}`.startsWith("/sahabat_ai/chat")) {
      sideElement.classList.add("hidden")
      element.classList.remove("pl-[200px]")
    } else {
      sideElement.classList.remove("hidden")
      element.classList.add("pl-[200px]")
    }
  }, [pathname])

  return (
    <div id="sidebar" className={`fixed z-40 bg-white border-t-2 border-r-2 border-gray-200 text-black h-screen w-[200px]`}>
      <div className="flex flex-col py-0">
        <SidebarItem currPathname={pathname} icon={<Home size={18} />} text="Home" targetPath="/" mode="equal" />
        <SidebarItem currPathname={pathname} icon={<UserCheck size={18} />} text={"Channels"} targetPath={"/channels"} />
        <SidebarItem currPathname={pathname} icon={<Book size={18} />} text={"Books"} targetPath={"/books"} />
        <SidebarItem currPathname={pathname} icon={<Pencil size={18} />} text={"Workbooks"} targetPath={"/workbooks"} />
        <SidebarItem currPathname={pathname} icon={<BotMessageSquare size={18} />} text={"Sahabat AI"} targetPath={"/sahabat_ai"} />
        <SidebarItem currPathname={pathname} icon={<Gamepad2 size={18} />} text={"Games"} targetPath={"/games"} />
        {/* <Link href="/learn">
          <div className={`px-5 py-2 ${`${pathname}`.startsWith("/learn") ? "bg-gray-200" : "bg-white"} hover:bg-gray-300 flex items-center`}>
            <School size={18} /><span className="ml-2">Learn</span>
          </div>
        </Link> */}
        {/* <Link href="/stats">
          <div className={`px-5 py-2 ${`${pathname}`.startsWith("/stats") ? "bg-gray-200" : "bg-white"} hover:bg-gray-300 flex items-center`}>
            <BarChart2 size={18} /><span className="ml-2">Stats</span>
          </div>
        </Link> */}
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
          your relatively educative content library for kids
        </span>
        <span className="hidden">
          tailwind class trigger
        </span>
      </div>
    </div>
  )
}

function SidebarItem({currPathname, icon, text, targetPath, mode}) {
  if (mode === "equal") {
    return(
      <a href={targetPath}>
        <div className={`px-5 py-2 ${`${currPathname}` === targetPath ? "bg-gray-200" : "bg-white"} hover:bg-gray-300 flex items-center`}>
          {icon}<span className="ml-2">{text}</span>
        </div>
      </a>
    )
  }

  return(
    <Link href={targetPath}>
      <div className={`px-5 py-2 ${`${currPathname}`.startsWith(targetPath) ? "bg-gray-200" : "bg-white"} hover:bg-gray-300 flex items-center`}>
        {icon}<span className="ml-2">{text}</span>
      </div>
    </Link>
  )
}

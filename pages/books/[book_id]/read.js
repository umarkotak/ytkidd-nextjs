import ytkiddAPI from "@/apis/ytkidApi"
import { classNames, FullScreenMode } from "@react-pdf-viewer/core"
import { ArrowLeft, ArrowRight, FullscreenIcon } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

var tmpBookDetail = {}
var tmpMaxPageNumber = 0
export default function Read() {
  const router = useRouter()

  const [bookDetail, setBookDetail] = useState({})
  const searchParams = useSearchParams()
  const [activePage, setActivePage] = useState({})
  const [activePageNumber, setActivePageNumber] = useState(1)
  const [imageLoading, setImageLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    tmpBookDetail = {}
    tmpMaxPageNumber = 0
  }, [])

  useEffect(() => {
    setImageLoading(true)
    GetBookDetail(router.query.book_id)
  }, [router])

  useEffect(() => {
    if (!tmpBookDetail.id) { return }
    if (!tmpBookDetail.contents) { return }

    var pageNumber = parseInt(searchParams.get("page"))
    var pageIndex = pageNumber - 1
    if (pageIndex <= 0) { pageIndex = 0 }
    if (pageIndex >= tmpMaxPageNumber) { pageIndex = tmpMaxPageNumber - 1 }

    setActivePageNumber(pageIndex+1)

    if (!tmpBookDetail.contents[pageIndex] || !tmpBookDetail.contents[pageIndex].image_file_url) { return }
    setActivePage(tmpBookDetail.contents[pageIndex])
  }, [router, bookDetail])

  async function GetBookDetail(bookID) {
    if (!bookID) { return }

    if (bookDetail.id === parseInt(bookID)) { return }

    try {
      const response = await ytkiddAPI.GetBookDetail("", {}, {
        book_id: bookID
      })
      const body = await response.json()
      if (response.status !== 200) {
        return
      }

      tmpBookDetail = body.data
      tmpMaxPageNumber = tmpBookDetail.contents.length
      setBookDetail(tmpBookDetail)

      for(const oneContent of tmpBookDetail.contents) {
        const newImage = new Image();
        newImage.src = oneContent.image_file_url;
        window[oneContent.image_file_url] = newImage;
      }

    } catch (e) {
      console.error(e)
    }
  }

  function NextPage() {
    if (activePageNumber >= tmpMaxPageNumber) { return }
    setImageLoading(true)
    router.push({
      pathname: `/books/${router.query.book_id}/read`,
      search: `?page=${activePageNumber+1}`
    })
  }

  function PrevPage() {
    if (activePageNumber <= 1) { return }
    setImageLoading(true)
    router.push({
      pathname: `/books/${router.query.book_id}/read`,
      search: `?page=${activePageNumber-1}`
    })
  }

  function ToggleFullScreen() {
    setIsFullscreen(!isFullscreen)
  }

  function ImageLoaded() {
    setImageLoading(false)
  }

  return(
    <main className="p-2 w-full">
      <div
        className={`${isFullscreen ? `
          absolute top-0 left-0 w-full h-screen z-50 bg-white
        ` : `
          max-h-[calc(100vh-100px)] relative
        `}`}
      >
        <img
          className={`${isFullscreen ? `
            object-contain absolute top-0 left-0 w-full h-screen
          ` : `
            max-h-[calc(100vh-100px)] object-contain mx-auto rounded-lg
          `}`}
          src={activePage.image_file_url}
          onLoad={()=>ImageLoaded()}
        />
        <div className={`absolute z-20 top-0 left-0 w-full h-full bg-black bg-opacity-10 backdrop-blur-sm ${imageLoading ? "block" : "hidden"}`}>
          <div className="mx-auto text-center text-xl flex flex-col h-full justify-center">
            <div>
              <span className="bg-white py-1 px-2 rounded-lg">Loading...</span>
            </div>
          </div>
        </div>
        <button
          className="absolute z-10 top-2 right-14 rounded-lg flex justify-start items-center hover:scale-110 bg-white bg-opacity-50 duration-500 p-2"
        >
          <span className="text-black">{activePageNumber} / {tmpMaxPageNumber}</span>
        </button>
        <button
          className="absolute z-10 top-2 right-2 rounded-lg flex justify-start items-center hover:scale-110 bg-white bg-opacity-50 duration-500 p-2"
          onClick={()=>ToggleFullScreen()}
        >
          <span className="text-black"><FullscreenIcon size={26} /></span>
        </button>
        <button
          className="absolute z-0 top-0 left-0 w-1/2 h-full bg-transparent hover:bg-black hover:bg-opacity-5 rounded-l-lg flex justify-start items-center"
          onClick={()=>PrevPage()}
        >
          <span className="bg-white opacity-50"><ArrowLeft /></span>
        </button>
        <button
          className="absolute z-0 top-0 right-0 w-1/2 h-full bg-transparent hover:bg-black hover:bg-opacity-5 rounded-r-lg flex justify-end items-center"
          onClick={()=>NextPage()}
        >
          <span className="bg-white opacity-50"><ArrowRight /></span>
        </button>
      </div>
    </main>
  )
}

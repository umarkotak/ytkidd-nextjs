import ytkiddAPI from "@/apis/ytkidApi"
import { classNames } from "@react-pdf-viewer/core"
import { ArrowLeft, ArrowRight } from "lucide-react"
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

  useEffect(() => {
    tmpBookDetail = {}
    tmpMaxPageNumber = 0

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
  }, [searchParams, bookDetail])

  async function GetBookDetail(bookID) {
    if (!bookID) { return }

    if (bookDetail.id === bookID) { return }

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

      tmpBookDetail.contents.forEach((oneContent) => {
        const newImage = new Image();
        newImage.src = oneContent.image_file_url;
        window[oneContent.image_file_url] = newImage;
      });

    } catch (e) {
      console.error(e)
    }
  }

  function NextPage() {
    router.push({
      pathname: `/books/${router.query.book_id}/read`,
      search: `?page=${activePageNumber+1}`
    })
  }

  function PrevPage() {
    router.push({
      pathname: `/books/${router.query.book_id}/read`,
      search: `?page=${activePageNumber-1}`
    })
  }

  function ImageLoaded() {
    setImageLoading(false)
  }

  return(
    <main className="p-2 w-full">
      <div className="max-h-[calc(100vh-100px)] relative">
        <img
          className="max-h-[calc(100vh-100px)] object-contain mx-auto rounded-lg"
          src={activePage.image_file_url}
          onLoad={()=>ImageLoaded()}
        />
        <div className={`absolute top-0 left-0 w-full h-full bg-black bg-opacity-10 backdrop-blur-sm ${imageLoading ? "block" : "hidden"}`}>
          <div className="mx-auto text-center flex flex-col h-full justify-center">
            loading...
          </div>
        </div>
        <button
          className="absolute top-0 left-0 w-1/2 h-full bg-transparent hover:bg-black hover:bg-opacity-5 rounded-l-lg flex justify-start items-center"
          onClick={()=>PrevPage()}
        >
          <span className="bg-white opacity-50"><ArrowLeft /></span>
        </button>
        <button
          className="absolute top-0 right-0 w-1/2 h-full bg-transparent hover:bg-black hover:bg-opacity-5 rounded-r-lg flex justify-end items-center"
          onClick={()=>NextPage()}
        >
          <span className="bg-white opacity-50"><ArrowRight /></span>
        </button>
      </div>
      <p className="mt-2 text-center">click left or right side of the image to change page</p>
    </main>
  )
}

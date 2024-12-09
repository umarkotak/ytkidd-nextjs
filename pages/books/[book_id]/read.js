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

  useEffect(() => {
    tmpBookDetail = {}
    tmpMaxPageNumber = 0

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

  return(
    <main className="p-4 w-full">
      <div className="h-[calc(100vh-100px)] relative">
        <img
          className="h-full object-contain mx-auto rounded-lg"
          src={activePage.image_file_url}
        />
        <button
          className="absolute top-0 left-0 w-1/2 h-full bg-transparent hover:bg-black hover:opacity-5 rounded-l-lg"
          onClick={()=>PrevPage()}
        ></button>
        <button
          className="absolute top-0 right-0 w-1/2 h-full bg-transparent hover:bg-black hover:opacity-5 rounded-r-lg"
          onClick={()=>NextPage()}
        ></button>
      </div>
      <p className="mt-2 text-center">click left or right side of the image to change page</p>
    </main>
  )
}

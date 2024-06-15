import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { DocumentViewer } from 'react-documents'

export default function Books() {
  const [bookList, setBookList] = useState([])
  const [activeBook, setActiveBook] = useState({})
  const searchParams = useSearchParams()

  useEffect(() => {
    GetBookList()
  }, [searchParams])

  useEffect(() => {
    bookList.forEach((oneBook) => {
      if (oneBook.title.toLowerCase() === searchParams.get("book_title").toLowerCase()) {
        setActiveBook(oneBook)
      }
    })
  }, [bookList])

  async function GetBookList() {
    fetch('/data/pdf_books.json').then((response) => response.json()).then((json) => {
      setBookList(json)
    })
  }

  return(
    <main className="pb-[100px] p-4">
      <div className="min-h-screen">
        <DocumentViewer
          queryParams="hl=En"
          url={activeBook.book_url}
          viewer={"pdf"}
          className="h-full min-h-screen w-full"
        >
        </DocumentViewer>

        {/* <iframe
          className="min-h-screen w-full"
          src={activeBook.book_url}
        /> */}
      </div>
    </main>
  )
}

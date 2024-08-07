import { classNames } from "@react-pdf-viewer/core"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function Books() {
  const [bookList, setBookList] = useState([])
  const searchParams = useSearchParams()

  useEffect(() => {
    GetBookList()
  }, [])

  async function GetBookList() {
    fetch('/data/pdf_books.json').then((response) => response.json()).then((json) => {
      setBookList(json)
    })
  }

  return(
    <main className="pb-[100px] p-4">
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-x-5 gap-y-8">
          {bookList.map((oneBook) => (<>
            <Link href={`/books/read?slug=${oneBook.slug}`} className="h-full">
              <div className="border p-1 shadow-sm rounded-lg h-full">
                <img
                  className="flex-none w-full h-72 object-cover z-0"
                  src={oneBook.image}
                />

                <div className="">
                  <p className="bg-white text-sm">{oneBook.title}</p>
                </div>
              </div>
            </Link>
          </>))}
        </div>
      </div>
    </main>
  )
}

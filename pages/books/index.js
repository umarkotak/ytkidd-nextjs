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
            <Link href={`/books/read?slug=${oneBook.slug}`}>
              <div className="flex flex-col border p-1 shadow-sm rounded-lg">
                <img
                  className="flex-none w-full"
                  src={oneBook.image}
                />

                <div>
                  <p className="text-lg">{oneBook.title}</p>
                </div>
              </div>
            </Link>
          </>))}
        </div>
      </div>
    </main>
  )
}

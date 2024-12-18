import ytkiddAPI from "@/apis/ytkidApi"
import { classNames } from "@react-pdf-viewer/core"
import { PlusIcon } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function DevBooks() {
  const [bookList, setBookList] = useState([])
  const searchParams = useSearchParams()
  const [bookParams, setBookParams] = useState({})

  useEffect(() => {
    GetBookList(bookParams)
  }, [searchParams])

  async function GetBookList(params) {
    try {
      const response = await ytkiddAPI.GetBooks("", {}, params)
      const body = await response.json()
      if (response.status !== 200) {
        return
      }

      setBookList(body.data.books)
    } catch (e) {
      console.error(e)
    }
  }

  async function DeleteBook(bookID) {
    if (!confirm("are you sure want to delete this book?")) { true }

    try {
      const response = await ytkiddAPI.DeleteBook("", {}, {
        book_id: bookID
      })
      if (response.status !== 200) {
        return
      }

      GetBookList(bookParams)
    } catch (e) {
      console.error(e)
    }
  }

  return(
    <main className="pb-[100px] p-4">
      <div>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl">Manage Book</span>
          </div>
          <div>
            <Link href="/admin/books/add" className="btn btn-sm flex gap-1"><PlusIcon size={18} /> Add Book</Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-x-5 gap-y-8">
          {bookList.map((oneBook) => (
            <div>
              <Link href={`/books/${oneBook.id}/read?page=1`} className="h-full" key={oneBook.id}>
                <div className="border p-1 shadow-sm rounded-lg h-full">
                  <img
                    className="flex-none w-full h-64 object-cover z-0 rounded-lg hover:scale-105 transition duration-500"
                    src={oneBook.cover_file_url}
                  />

                  <div className="m-1 flex flex-col gap-2">
                    <p className="bg-white text-sm text-center">{oneBook.title}</p>
                  </div>
                </div>
              </Link>
              <div className="flex items-center justify-end">
                <button
                  className="btn btn-xs bg-error"
                  onClick={()=>DeleteBook(oneBook.id)}
                >delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

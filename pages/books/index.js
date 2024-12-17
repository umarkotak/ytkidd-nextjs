import ytkiddAPI from "@/apis/ytkidApi"
import { classNames } from "@react-pdf-viewer/core"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function Books() {
  const [bookList, setBookList] = useState([])
  const searchParams = useSearchParams()
  const [enableDev, setEnableDev] = useState(false)

  useEffect(() => {
    GetBookList({})

    if (searchParams && searchParams.get("dev")==="true") {
      setEnableDev(true)
    } else {
      setEnableDev(false)
    }
  }, [searchParams])

  async function GetBookList(params) {
    try {
      params.types = "default"
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

  return(
    <main className="pb-[100px] p-4">
      <div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-x-5 gap-y-8">
          {bookList.map((oneBook) => (
            <Link href={`/books/${oneBook.id}/read?page=1`} className="h-full" key={oneBook.id}>
              <div className="border p-1 shadow-sm rounded-lg h-full">
                <img
                  className="flex-none w-full h-72 object-cover z-0 rounded-lg hover:scale-105 transition duration-500"
                  src={oneBook.cover_file_url}
                />

                <div className="m-1 flex flex-col gap-2">
                  <p className="bg-white text-sm text-center">{oneBook.title}</p>
                  {enableDev && <div className="flex items-center justify-end">
                    <button className="btn btn-xs bg-error">delete</button>
                  </div>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}

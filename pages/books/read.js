import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import dynamic from 'next/dynamic';
const PDFViewer = dynamic(() => import('@/components/PdfViewer'), {
  ssr: false
});

export default function Books() {
  const [bookList, setBookList] = useState([])
  const [activeBook, setActiveBook] = useState({})
  const searchParams = useSearchParams()

  useEffect(() => {
    GetBookList()
  }, [searchParams])

  useEffect(() => {
    if (!searchParams) { return }

    bookList.forEach((oneBook) => {
      if (oneBook.slug.toLowerCase() === `${searchParams.get("slug")}`.toLowerCase()) {
        setActiveBook(oneBook)
      }
    })
  }, [bookList])

  async function GetBookList() {
    fetch('/data/pdf_books.json').then((response) => response.json()).then((json) => {
      setBookList(json)
    })
  }

  // const defaultLayoutPluginInstance = defaultLayoutPlugin({
  //   sidebarTabs: (defaultTabs) => [],
  // });

  return(
    <main className="pb-[100px] p-4">
      {
        activeBook.attachment &&
        <div className="w-full mx-auto">
          <PDFViewer pdfUrl={activeBook.attachment} />
        </div>
      }
    </main>
  )
}

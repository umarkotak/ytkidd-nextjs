import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { DocumentViewer } from 'react-documents'

import { Viewer, Worker, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

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
      if (oneBook.title.toLowerCase() === `${searchParams.get("book_title")}`.toLowerCase()) {
        setActiveBook(oneBook)
      }
    })
  }, [bookList])

  async function GetBookList() {
    fetch('/data/pdf_books.json').then((response) => response.json()).then((json) => {
      setBookList(json)
    })
  }

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return(
    <main className="pb-[100px] p-4">
      {
        activeBook.book_url &&
        <div className="w-full max-w-[1024px] mx-auto">
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
            <div>
              <Viewer
                fileUrl={activeBook.book_url}
                defaultScale={SpecialZoomLevel.PageWidth}
                plugins={[defaultLayoutPluginInstance]}
              />
            </div>
          </Worker>
        </div>
      }
    </main>
  )
}



import { useState, useEffect } from 'react'

import { useParams, useSearchParams } from 'next/navigation'
import WordPill from '@/components/WordPill'

export default function Reading() {
  const params = useParams()
  const queryParams = useSearchParams()

  const [bookPages, setBookPages] = useState([])
  const [activeBookPage, setActiveBookPage] = useState({})

  useEffect(() => {
    CallGetData()
  }, [queryParams])

  async function CallGetData() {
    const response = await GetData()
    const body = await response.json()

    console.log("RES", body)
    setBookPages(body)

    if (body.length >= 1) {
      setActiveBookPage(body[0])
    }
  }

  async function GetData() {
    var uri = `/data/books/reading-book1.json`
    const response = await fetch(uri, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    return response
  }

  function changePage(bookPage) {
    setActiveBookPage(bookPage)
  }

  return (
    <main className="pb-[100px] p-4">
      <div className='flex flex-row'>
        <div className='w-full grid grid-cols-2 gap-4'>
          <div className='w-full col-span-2 flex flex-wrap gap-1'>
            {bookPages.map((bookPage, idx) => (
              <button
                className={`py-1 px-2 rounded-lg hover:bg-yellow-300 ${bookPage.id === activeBookPage.id ? "bg-yellow-400" : "bg-yellow-200"}`}
                onClick={() => changePage(bookPage)}
              >
                {bookPage.name}
              </button>
            ))}
          </div>

          {activeBookPage?.left_contents && <div className='text-center flex flex-col gap-4'>
            {activeBookPage?.left_contents?.map((v) => (
              <WordPill word={v} />
            ))}
          </div>}

          {activeBookPage?.right_contents && <div className='text-center flex flex-col gap-4'>
            {activeBookPage?.right_contents?.map((v) => (
              <WordPill word={v} />
            ))}
          </div>}

          {activeBookPage?.central_contents && <div className='text-center flex flex-col gap-4 w-full col-span-2'>
            {activeBookPage?.central_contents?.map((sentence) => (
              <div className='flex gap-2'>
                {sentence.map((word) => (
                    <WordPill word={word} />
                ))}
              </div>
            ))}
          </div>}

          <div className='w-full text-2xl mt-6 col-span-2'>
            <div className='w-full flex flex-wrap justify-center gap-4'>
              {activeBookPage?.last_contents?.map((v) => (
                <WordPill word={v} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

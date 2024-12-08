

import { useState, useEffect } from 'react'
import Link from 'next/link'

import { BookA } from 'lucide-react'

export default function Learn() {

  return (
    <main className="pb-[100px] p-4">
      <div className="mb-4 flex overflow-x-auto w-full pb-4">
        <Link
          href={`/learn/reading`}
          className="flex-shrink-0 py-2 pl-2 pr-3 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center mr-2"
        >
          <BookA size={18} />
          <span className="ml-2 text-sm">Reading</span>
        </Link>
      </div>
    </main>
  )
}

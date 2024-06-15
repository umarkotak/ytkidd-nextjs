

import Utils from '@/models/Utils'
import Link from 'next/link'

export default function WordPill({word}) {
  return (
    <button
      className="py-1 px-2 border rounded-lg text-3xl hover:bg-slate-100"
      style={{fontFamily: "'Muli', sans-serif"}}
      onClick={()=>Utils.SpeakText(word)}
    >
      {word}
    </button>
  )
}

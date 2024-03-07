'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function VideoQuiz({
  ts
}) {
  const [show, setShow] = useState(true)
  const [selectedAnswer, setSelectedAnswer] = useState(null)

  useEffect(() => {
    setShow(true)
  },[ts])

  return (
    <div className={`${show ? "block" : "hidden"}`}>
      <div className={`w-full h-screen fixed top-0 left-0 backdrop-blur-md bg-black bg-opacity-80 z-20`} />
      <div className='fixed top-6 left-0 right-0 mx-auto rounded-lg overflow-hidden bg-white h-4/5 max-w-lg w-full z-30'>
        <div className='flex justify-between p-2 items-center bg-red-100'>
          <span>
            Quiz Time!
          </span>
          <button
            className='py-2 px-3 bg-red-400 rounded-md hover:bg-red-500'
            onClick={()=>{setShow(false)}}
          >X</button>
        </div>

        <div>
          <div id="box_title" className='flex justify-center text-lg mt-8'>
            {quizzes[0].question_message}
          </div>
          <div id="box_question" className='flex justify-center text-lg mt-28'>
            <span className='text-[100px] font-bold'>{quizzes[0].question.value}</span>
          </div>
          <div id="box_answer" className='grid grid-cols-2 mt-20 p-3 gap-4'>
            {quizzes[0].answers.map((v, idx)=>(
              <button
                className={`w-full p-2 rounded-lg hover:bg-blue-400 ${selectedAnswer == idx ? "bg-blue-500" : "bg-blue-300"}`}
                onClick={(e)=>{
                  setSelectedAnswer(idx)
                }}
              >
                {v.display}
              </button>
            ))}
          </div>
          {/* <div id="box_active_answer">
            {selectedAnswer && <>
              {selectedAnswer}
            </>}
          </div> */}
          <div id="box_submit" className='flex justify-end p-3'>
            <button className='p-3 rounded-lg bg-green-300 hover:bg-green-400'>
              <i className="fa-solid fa-check mr-2"></i> JAWAB
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

var quizzes = [
  {
    question_type: "match_word_and_voice",
    question_message: "Pilih mana suara yang tepat",
    answer_type: "multiple_choice",
    question: {
      value: "BA BA"
    },
    answers: [
      {
        value: "BA BA",
        display: "1",
        is_answer: true,
      },
      {
        value: "CA CA",
        display: "2",
        is_answer: false,
      },
      {
        value: "DA DA",
        display: "3",
        is_answer: false,
      },
      {
        value: "FA FA",
        display: "4",
        is_answer: false,
      },
    ],
  }
]

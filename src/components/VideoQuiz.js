'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function VideoQuiz({
  ts
}) {
  const [show, setShow] = useState(true)
  const [selectedAnswerIdx, setSelectedAnswerIdx] = useState(null)
  const [activeQuizzes, setActiveQuizzes] = useState([])
  const [quizCurrIndex, setQuizCurrIndex] = useState(0)

  useEffect(() => {

  },[])

  useEffect(() => {
    setSelectedAnswerIdx(null)
    setActiveQuizzes(quizzes)
    setQuizCurrIndex(0)

    setShow(true)
  },[ts])

  function answerClick(idx) {
    setSelectedAnswerIdx(idx)

    speakText(activeQuizzes[quizCurrIndex].answers[idx].value)
  }

  function submitAnswer() {
    var tmpActiveQuiz = activeQuizzes[quizCurrIndex]

    if (tmpActiveQuiz.question_type === "match_word_and_voice") {
      if (tmpActiveQuiz.question.value === tmpActiveQuiz.answers[selectedAnswerIdx].value) {
        speakText("JAWABANMU BENAR!")

        if (quizCurrIndex == activeQuizzes.length-1) {
          setShow(false)
        }

        setQuizCurrIndex(quizCurrIndex+1)
      } else {
        speakText("JAWABANMU SALAH!")
      }
    }
  }

  function speakText(message) {
    if (!('speechSynthesis' in window)) { return }

    let speakData = new SpeechSynthesisUtterance()
    speakData.volume = 1
    speakData.rate = 0.7
    speakData.pitch = 1
    speakData.text = message
    speakData.lang = 'id-ID'

    speechSynthesis.speak(speakData)
  }

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
            {activeQuizzes[quizCurrIndex]?.question_message}
          </div>
          <div id="box_question" className='flex justify-center text-lg mt-28'>
            <span className='text-[100px] ' style={{fontFamily: "'Muli', sans-serif"}}>
              {activeQuizzes[quizCurrIndex]?.question.value}
            </span>
          </div>
          <div id="box_answer" className='grid grid-cols-2 mt-20 p-3 gap-4'>
            {activeQuizzes[quizCurrIndex]?.answers.map((v, idx)=>(
              <button
                className={`w-full p-2 rounded-lg hover:bg-green-300 ${selectedAnswerIdx == idx ? "bg-green-400" : "bg-blue-300"}`}
                onClick={(e)=>{answerClick(idx)}}
                key={idx}
              >
                {v.display}
              </button>
            ))}
          </div>
          {/* <div id="box_active_answer">
            {selectedAnswerIdx && <>
              {selectedAnswerIdx}
            </>}
          </div> */}
          <div id="box_submit" className='flex justify-end p-3'>
            <button
              className='p-3 rounded-lg bg-green-300 hover:bg-green-400'
              onClick={()=>submitAnswer()}
            >
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
      value: "ba ba"
    },
    answers: [
      { value: "ba ba", display: "1", },
      { value: "ca ca", display: "2", },
      { value: "da da", display: "3", },
      { value: "fa fa", display: "4", },
    ],
  },
  {
    question_type: "match_word_and_voice",
    question_message: "Pilih mana suara yang tepat",
    answer_type: "multiple_choice",
    question: {
      value: "ca ca"
    },
    answers: [
      { value: "ya ya", display: "1", },
      { value: "ca ca", display: "2", },
      { value: "da da", display: "3", },
      { value: "fa fa", display: "4", },
    ],
  },
]

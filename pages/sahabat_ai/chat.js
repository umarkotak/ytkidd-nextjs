import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, BotMessageSquare, MessageCircleQuestion,  } from 'lucide-react'
import 'regenerator-runtime/runtime'
const ReactPlayerCsr = dynamic(() => import('@/components/ReactPlayerCsr'), { ssr: false })
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

import ytkiddAPI from '@/apis/ytkidApi'
import Utils from '@/models/Utils'
import Markdown from 'react-markdown'

const tokenizer = require('sbd')

const sentenceSplitterOpt = {
  "newline_boundaries" : true,
  "html_boundaries"    : false,
  "sanitize"           : true,
  "allowed_tags"       : false,
  "preserve_whitespace" : false,
  "abbreviations"      : null
}
var chatHistories = []

export default function Home() {
  const searchParams = useSearchParams()

  const [userInput, setUserInput] = useState('')
  const [messages, setMessages] = useState([])
  const [avatarState, setAvatarState] = useState('idle')
  const [avatarActiveVid, setAvatarActiveVid] = useState('')
  const playerRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  async function handleSubmit() {
    processText(userInput)
  }

  async function processText(t) {
    setPlaying(true)
    setUserInput('')
    resetTranscript()
    setMessages([{ role: 'user', content: t }, ...messages])

    chatHistories.push({
      role: "user",
      content: t,
    })

    var params = {
      "messages": chatHistories
    }
    // var params = {
    //   "messages": [
    //     { role: 'user', content: t }
    //   ]
    // }

    const response = await ytkiddAPI.PostAIChat("", {}, params)
    const body = await response.json()

    var textResult = body.data.content

    setMessages([{ role: 'assistant', content: body.data.content }, { role: 'user', content: t }, ...messages])
    chatHistories.push({
      role: "assistant",
      content: body.data.content,
    })

    const container = document.getElementsByClassName('chat-container')
    container.scrollTop = container.scrollHeight

    nativeSpeak(textResult)
  }

  useEffect(() => {
    if (avatarState === "idle") {
      setAvatarActiveVid('/videos/ai-idle.m3u8')
    } else if (avatarState === "talk") {
      setAvatarActiveVid('/videos/ai-talk.m3u8')
    } else {
      setAvatarActiveVid('/videos/ai-idle.m3u8')
    }
  }, [avatarState])

  var synth
  const [voices, setVoices] = useState([])
  if (typeof(window) !== 'undefined') {
    synth = window.speechSynthesis
    synth.onvoiceschanged = () => {
      var tmpVoices = synth.getVoices()
      setVoices(tmpVoices)
    }
  }

  function nativeSpeak(text) {
    setPlaying(true)

    if (text === "") { return }
    setAvatarState("talk")
    synth.cancel()

    var sentences = tokenizer.sentences(text, sentenceSplitterOpt)

    text = removeEmoticons(text)

    sentences.forEach((sentence, idx) => {
      iterateArrayInBatches(`${sentence}`.split(' '), 26, function(batch) {
        var joinedText = batch.join(" ")
        let speech = new SpeechSynthesisUtterance()
        speech.voice = getIDVoice()
        speech.lang = "id-ID"
        speech.text = joinedText
        speech.rate = 1.4
        speech.pitch = 1.5
        speech.volume = 1
        if (idx >= sentences.length-1) {
          speech.onend = () => {setAvatarState("idle")}
        }
        synth.speak(speech)
      })
    })
  }

  function getIDVoice() {
    voices.forEach((v)=>{
      if (v.lang === "id-ID") {
        return v
      }
    })
  }

  const commands = [
    {
      command: ':content (*)',
      callback: (content, c2) => {
        setUserInput(`${content} ${c2}`)
        processText(`${content} ${c2}`)
      },
      matchInterim: false,
    },
  ]
  const {transcript, listening, resetTranscript, browserSupportsSpeechRecognition} = useSpeechRecognition({commands})

  useEffect(() => {
    const listener = event => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault()
        processText(document.getElementById("input_params").value)
      }
    }
    document.addEventListener("keydown", listener)
    return () => {
      document.removeEventListener("keydown", listener)
    }
  }, [])

  function startListening() {
    synth.cancel()
    setAvatarState("idle")
    SpeechRecognition.startListening({ language: 'id' })
  }

  var vidHeight = "600px"

  return (
    <main className="pb-[100px] p-4">
      <div className='flex flex-col gap-1'>
        <div className='w-full max-w-[480px] mx-auto mb-2'>
          <div className='w-full rounded-lg overflow-hidden border border-black relative h-[600px]'>
            <div className={`scale-[2.8]`}>
              <ReactPlayerCsr
                url={'/videos/ai-idle.m3u8'}
                width={"100%"}
                height={vidHeight}
                playing={playing}
                loop={true}
              />
            </div>
            <div className={`scale-[2.8] absolute top-0 transition-opacity ease-in duration-700 ${avatarState === 'talk' ? 'opacity-100' : 'opacity-0'}`}>
              <ReactPlayerCsr
                url={'/videos/ai-talk.m3u8'}
                width={"100%"}
                height={vidHeight}
                playing={playing}
                loop={true}
              />
            </div>
            <div className='absolute bottom-2 right-2'>
              <button
                type='button'
                className="btn btn-error btn-lg text-white"
                onClick={()=>startListening()}
              >
                {!listening ? "🗣️ Speak" : "🦻🏻 Listening"}
              </button>
            </div>
          </div>
        </div>

        <div className='w-full max-w-[480px] mx-auto mb-2'>
          <div id="chatbox" className="chat-container h-96 overflow-y-auto p-4 bg-green-200 rounded-lg">
            {transcript && transcript !== "" && <>
              <div
                className={`text-black chat-message mb-2 ${
                  'text-right text-blue-500'
                }`}
              >
                <p>
                  <span className="font-bold">user</span>
                </p>
                <div className={'flex justify-end'}>
                  <p className='text-xs bg-white p-2 rounded-lg max-w-xs shadow-sm'>
                    {transcript}
                  </p>
                </div>
              </div>
            </>}
            {messages.map((message, index) => (
              <div
                key={index+message}
                className={`text-black chat-message mb-2 ${
                  message.role === 'user' ? 'text-right text-blue-500' : 'text-left text-black'
                }`}
              >
                <p className=''>
                  <span className="font-bold">{message.role}</span>
                </p>
                <div className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                  <p className='text-xs bg-white p-2 rounded-lg max-w-xs shadow-sm overflow-auto'>
                    <Markdown>
                      {message.content}
                    </Markdown>
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className='flex flex-col gap-1 mt-2 text-black'>
            {/* {voices.map((v, idx)=>(
              v.lang !== "id-ID" ? null :
              <div className='bg-white rounded-lg p-1' key={v.lang+v.name}>
                {idx}: {v.lang} - {v.name}
              </div>
            ))} */}
          </div>
        </div>
      </div>
    </main>
  )
}

function iterateArrayInBatches(array, batchSize, callback) {
  for (let i = 0; i < array.length; i += batchSize) {
    const batch = array.slice(i, i + batchSize);
    callback(batch);
  }
}

function removeEmoticons(text) {
  // Regular expression to match most emoticons (including variations with noses, etc.)
  const emoticonRegex = /[:;8=xX]['"`^]?[-o\*\^]?[\)\]\(\[dDpP\/\\|@3<>]/g;

  // Replace matched emoticons with an empty string
  return removeEmojis(text.replace(emoticonRegex, ''));
}

function removeEmojis(text) {
  // Use a regular expression to match Unicode characters in the emoji range
  const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}]/gu;

  // Replace matched emojis with an empty string
  return text.replace(emojiRegex, '');
}

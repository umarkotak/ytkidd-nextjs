

import Utils from "@/models/Utils";
import { useEffect, useState } from "react";

export default function Setting() {
  const [lockSetting, setLockSetting] = useState(true)

  const [val1, setVal1] = useState(0)
  const [val2, setVal2] = useState(0)
  const [lockAnswer, setLockAnswer] = useState(null)

  useEffect(()=>{
    setVal1(Utils.GetRandomNumber(1, 10))
    setVal2(Utils.GetRandomNumber(1, 10))
  }, [])

  function unclockSetting() {
    console.log(lockAnswer, "-", (val1+val2))
    if (parseInt(lockAnswer) === parseInt(val1+val2)) {
      console.log("masuk")
      setLockSetting(false)
    }
  }

  return (
    <main className="p-2">
      <div className="w-full flex text-lg items-center mb-4">
        <span className="p-2">{val1}</span> + <span className="p-2">{val2}</span> =
        <input
          type="number"
          className="ml-2 p-2 rounded w-20 border"
          onChange={(e)=>{setLockAnswer(e.target.value)}}
        ></input>
        <button className="ml-2 p-2 border rounded hover:bg-slate-200" onClick={()=>{unclockSetting()}}>
          buka setting
        </button>
      </div>

      <div className={`w-full flex flex-col ${lockSetting ? "hidden" : "block"}`}>
        <div className="flex-col">
          <p className="text-lg pb-2">Aktifkan quiz?</p>

          <div className="flex gap-2">
            <button className="p-2 rounded border">
              Status: {localStorage.getItem("YTKIDD:QUIZ:ENABLE") || "on"}
            </button>

            <button
              className="p-2 rounded border bg-green-300 hover:bg-green-400"
              onClick={()=>{localStorage.setItem("YTKIDD:QUIZ:ENABLE", "on"); window.location.reload()}}
            >On</button>

            <button
              className="p-2 rounded border bg-red-300 hover:bg-red-400"
              onClick={()=>{localStorage.setItem("YTKIDD:QUIZ:ENABLE", "off"); window.location.reload()}}
            >Off</button>
          </div>
        </div>

        <div className="flex-col mt-4">
          <p className="text-lg pb-2">Tampilkan jawaban setelah diklik 2x?</p>

          <div className="flex gap-2">
            <button className="p-2 rounded border">
              Status: {localStorage.getItem("YTKIDD:QUIZ:SHOW_ANSWER") || "on"}
            </button>

            <button
              className="p-2 rounded border bg-green-300 hover:bg-green-400"
              onClick={()=>{localStorage.setItem("YTKIDD:QUIZ:SHOW_ANSWER", "on"); window.location.reload()}}
            >On</button>

            <button
              className="p-2 rounded border bg-red-300 hover:bg-red-400"
              onClick={()=>{localStorage.setItem("YTKIDD:QUIZ:SHOW_ANSWER", "off"); window.location.reload()}}
            >Off</button>
          </div>
        </div>

        <div className="flex-col mt-4">
          <p className="text-lg pb-2">Tampilkan tombol tutup quiz?</p>

          <div className="flex gap-2">
            <button className="p-2 rounded border">
              Status: {localStorage.getItem("YTKIDD:QUIZ:ALLOW_DISMISS") || "on"}
            </button>

            <button
              className="p-2 rounded border bg-green-300 hover:bg-green-400"
              onClick={()=>{localStorage.setItem("YTKIDD:QUIZ:ALLOW_DISMISS", "on"); window.location.reload()}}
            >On</button>

            <button
              className="p-2 rounded border bg-red-300 hover:bg-red-400"
              onClick={()=>{localStorage.setItem("YTKIDD:QUIZ:ALLOW_DISMISS", "off"); window.location.reload()}}
            >Off</button>
          </div>
        </div>

        <div className="flex-col mt-4">
          <p className="text-lg pb-2">Ganti soal quiz ketika salah jawab 2x?</p>

          <div className="flex gap-2">
            <button className="p-2 rounded border">
              Status: {localStorage.getItem("YTKIDD:QUIZ:CHANGE_QUESTION_ON_WRONG") || "on"}
            </button>

            <button
              className="p-2 rounded border bg-green-300 hover:bg-green-400"
              onClick={()=>{localStorage.setItem("YTKIDD:QUIZ:CHANGE_QUESTION_ON_WRONG", "on"); window.location.reload()}}
            >On</button>

            <button
              className="p-2 rounded border bg-red-300 hover:bg-red-400"
              onClick={()=>{localStorage.setItem("YTKIDD:QUIZ:CHANGE_QUESTION_ON_WRONG", "off"); window.location.reload()}}
            >Off</button>
          </div>
        </div>
      </div>
    </main>
  )
}

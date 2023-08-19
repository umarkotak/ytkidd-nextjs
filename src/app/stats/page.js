'use client'

import { useState, useEffect } from 'react'
import { ComposedChart, Bar, LabelList, Cell, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function Stats() {
  const [activeDate, setActiveDate] = useState({
    name: "N/A"
  })
  const [limitDays, setLimitDays] = useState(7)
  const [dateStat, setDateStat] = useState([])

  useEffect(() => {
    if (!localStorage) { return }

    var dateList = []

    for (let idx = 0; idx < limitDays; idx++) {
      var currDate = new Date()
      currDate.setDate(currDate.getDate() - idx)
      dateList.unshift(`${currDate.getFullYear()}-${currDate.getMonth()+1}-${currDate.getDate()}`)
    }

    var tempDateStat = []

    dateList.forEach((oneDate) => {
      var currentDateStat

      if (localStorage.getItem(`YTKIDD:DAILY_VIDEO_STAT:${oneDate}`)) {
        currentDateStat = JSON.parse(localStorage.getItem(`YTKIDD:DAILY_VIDEO_STAT:${oneDate}`))
      } else {
        currentDateStat = {
          "total_watch_duration": 0,
          "view_count": 0,
          "latest_watched_at_unix": 0
        }
      }

      tempDateStat.push({
        name: oneDate,
        total_watch_duration: Math.floor(currentDateStat.total_watch_duration/60),
        view_count: currentDateStat.view_count,
      })
    })

    setDateStat(tempDateStat)
    setActiveDate(tempDateStat[tempDateStat.length-1])
  }, [])

  const handleClick = (data, index) => {
    setActiveDate(data)
  }

  function AddSample() {
    var key = `YTKIDD:DAILY_VIDEO_STAT:2023-8-17`
    localStorage.setItem(key, JSON.stringify({
      "total_watch_duration": 1000,
      "view_count": 10,
      "latest_watched_at_unix": 0
    }))
  }

  return (
    <main className="pb-[100px] p-4 w-full">
      <div className='mb-6'>
        <h1 className='text-xl'>Watch Statistic</h1>
        <small>track how much you watch video</small>
      </div>
      <div className="w-full h-[300px]">
        <ResponsiveContainer>
          <ComposedChart width={500} height={400} data={dateStat}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" fill='#020617'/>
            {/* <YAxis fill='#020617' /> */}
            <Tooltip/>
            <Legend/>
            <Bar dataKey="view_count" onClick={handleClick} barSize={20} fill='#0284c7'>
              {dateStat.map((entry, index) => (
                <>
                  {console.log(entry)}
                  <Cell cursor="pointer" fill={entry.name === activeDate.name ? '#e11d48' : '#0284c7'} key={`cell-${index}`}/>
                </>
              ))}
            </Bar>
            <Line type="monotone" dataKey="total_watch_duration" stroke="#16a34a">
              <>
                {/* <LabelList dataKey="view_count" fill={'#000000'} position="top"/> */}
              </>
            </Line>
          </ComposedChart>
        </ResponsiveContainer>

        {/* <button onClick={()=>AddSample()} className='bg-gray-200 p-2 rounded-xl'>Add sample</button> */}
      </div>

      <div>
        <div className='mb-6'>
          <div className='flex items-center'>
            <button className='p-2 bg-gray-300 hover:bg-gray-400 rounded-lg mr-2'><i className='fa-solid fa-arrow-left'/></button>
            <h1 className='text-xl mr-2'>{activeDate.name} Stat</h1>
            <button className='p-2 bg-gray-300 hover:bg-gray-400 rounded-lg mr-2'><i className='fa-solid fa-arrow-right'/></button>
          </div>
          <small>track how much you watch video</small>
        </div>
      </div>
    </main>
  )
}

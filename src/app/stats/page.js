'use client'

import { useState, useEffect } from 'react'
import { ComposedChart, Bar, LabelList, Cell, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function Stats() {
  const [activeIndex, setActiveIndex] = useState(0)
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
  }, [])

  const handleClick = (data, index) => {
    setActiveIndex(index)
  };

  const activeItem = dateStat[activeIndex];

  return (
    <main className="pb-[100px] p-4 w-full">
      <div className='mb-6'>
        <h1 className='text-xl'>Watch Statistic</h1>
        <small>track how much you watch the video</small>
      </div>
      <div className="w-full h-[300px]">
        <ResponsiveContainer>
          <ComposedChart width={500} height={400} data={dateStat}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" fill='#020617'/>
            {/* <YAxis fill='#020617' /> */}
            <Tooltip/>
            <Legend/>
            <Bar dataKey="total_watch_duration" onClick={handleClick} barSize={20} fill='#0284c7'>
              {dateStat.map((entry, index) => (
                <>
                  <Cell cursor="pointer" fill={index === activeIndex ? '#0284c7' : '#0284c7'} key={`cell-${index}`}/>
                </>
              ))}
            </Bar>
            <Line type="monotone" dataKey="view_count" stroke="#16a34a">
              <>
                {/* <LabelList dataKey="view_count" fill={'#000000'} position="top"/> */}
              </>
            </Line>
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div>
        {/* <p className="content">{`Uv of "${activeItem.name}": ${activeItem.uv}`}</p> */}
      </div>
    </main>
  )
}

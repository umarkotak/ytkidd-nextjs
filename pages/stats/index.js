

import { useState, useEffect } from 'react'
import { ComposedChart, Bar, LabelList, Cell, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

import YtVideo from '@/models/YtVideo'
import VideoCard from '@/components/VideoCard'

export default function Stats() {
  const [activeDate, setActiveDate] = useState({
    name: "N/A"
  })
  const [limitDays, setLimitDays] = useState(7)
  const [dateStat, setDateStat] = useState([])
  const [videoList, setVideoList] = useState([])

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

      if (localStorage.getItem(`COOKIEKID:DAILY_VIDEO_STAT:${oneDate}`)) {
        currentDateStat = JSON.parse(localStorage.getItem(`COOKIEKID:DAILY_VIDEO_STAT:${oneDate}`))
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
    var key = `COOKIEKID:DAILY_VIDEO_STAT:2023-8-22`
    localStorage.setItem(key, JSON.stringify({
      "total_watch_duration": 1000,
      "view_count": 10,
      "latest_watched_at_unix": 0
    }))
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-200 bg-opacity-80 p-2 rounded-xl">
          <p className="">Date: {label}</p>
          <p className="">{(payload[0].value)} x watched</p>
          <p className="">total: {payload[1].value} mins</p>
        </div>
      )
    }
    return null
  }

  useEffect(() => {
    if (!localStorage) { return }

    var dailyWatchHistoryKey = `COOKIEKID:DAILY_VIDEO_HISTORY:${activeDate.name}`

    if (!localStorage.getItem(dailyWatchHistoryKey)) {
      setVideoList([])
      return
    }

    var tmpVideoList = JSON.parse(localStorage.getItem(dailyWatchHistoryKey))

    var videoListObj = tmpVideoList.map((oneVideo) => {
      return new YtVideo(oneVideo)
    })

    setVideoList(videoListObj)

  }, [activeDate])

  function PrevDate() {
    var tmpCurrDate = activeDate.name
    setActiveDate({
      name: decreaseDate(tmpCurrDate, 1)
    })
  }

  function NextDate() {
    var tmpCurrDate = activeDate.name
    setActiveDate({
      name: increaseDate(tmpCurrDate, 1)
    })
  }

  function formatDate(date) {
    const parts = date.split('-');
    return new Date(parts[0], parseInt(parts[1]) - 1, parts[2]);
  }

  function increaseDate(date, days) {
    const formattedDate = formatDate(date);
    formattedDate.setDate(formattedDate.getDate() + days);
    return `${formattedDate.getFullYear()}-${formattedDate.getMonth()+1}-${formattedDate.getDate()}`
  }

  function decreaseDate(date, days) {
    const formattedDate = formatDate(date);
    formattedDate.setDate(formattedDate.getDate() - days);
    return `${formattedDate.getFullYear()}-${formattedDate.getMonth()+1}-${formattedDate.getDate()}`
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
            <Tooltip content={<CustomTooltip />} />
            <Legend/>
            <Bar dataKey="view_count" onClick={handleClick} barSize={20} fill='#0284c7'>
              {dateStat.map((entry, index) => (
                <>
                  {/* {console.log(entry)} */}
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
      </div>

      {/* <div>
        <button onClick={()=>AddSample()} className='bg-gray-200 p-2 rounded-xl'>Add sample</button>
      </div> */}

      <div className='mt-4'>
        <div className='mb-6'>
          <div className='flex items-center'>
            <button
              className='py-2 px-3 bg-gray-300 hover:bg-gray-400 rounded-2xl mr-2'
              onClick={()=>PrevDate()}
            ><i className='fa-solid fa-arrow-left'/></button>

            <h1 className='text-xl mr-2'>{activeDate.name} History</h1>

            <button
              className='py-2 px-3 bg-gray-300 hover:bg-gray-400 rounded-2xl mr-2'
              onClick={()=>NextDate()}
            ><i className='fa-solid fa-arrow-right'/></button>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">
            {videoList.map((oneVideo) => (
              <VideoCard
                key={oneVideo.video_id}
                ytkiddId={oneVideo.ytkidd_id}
                videoId={oneVideo.video_id}
                videoImageUrl={oneVideo.video_image_url}
                channelId={oneVideo.channel_id}
                creatorImageUrl={oneVideo.creator_image_url}
                shortedVideoTitle={oneVideo.shorted_video_title}
                creatorName={oneVideo.creator_name}
                viewedCounts={oneVideo.GetViewedCount(oneVideo.video_id)}
                watchedDurations={oneVideo.GetWatchedDuration(oneVideo.video_id)}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

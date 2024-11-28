import { useState, useEffect, useRef } from 'react'

import ChannelList from '@/components/ChannelList'
import VideoCard from '@/components/VideoCard'

import { useGetChannels, useGetVideos } from '@/hooks'

export default function Home() {
  const [imageUrls, setImageUrls] = useState([])
  const [color, setColor] = useState("#000000")

  useEffect(() => {
    setImageUrls([
      "https://placehold.co/720",
      "https://placehold.co/720",
    ])
  })

  return (
    <main className="pb-[100px] p-4">
      <div className='flex flex-col'>
        <h1>Draw on Image</h1>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        {imageUrls.map((oneImageUrl) => (
          <div>
            <ImageCanvas image_url={oneImageUrl} color={color} />
          </div>
        ))}
      </div>
    </main>
  )
}

function ImageCanvas(props) {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [canvasWidth, setCanvasWidth] = useState(0)
  const [canvasHeight, setCanvasHeight] = useState(0)

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent
    setIsDrawing(true)

    const ctx = canvasRef.current.getContext("2d")
    ctx.strokeStyle = props.color
    ctx.lineWidth = 5
    ctx.lineCap = "round"
    ctx.beginPath()
    ctx.moveTo(offsetX, offsetY)
  }

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return
    const { offsetX, offsetY } = nativeEvent

    const ctx = canvasRef.current.getContext("2d")
    ctx.lineTo(offsetX, offsetY)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    const ctx = canvasRef.current.getContext("2d")
    ctx.closePath()
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    const img = new Image()
    img.src = props.image_url
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      setCanvasWidth(img.width)
      setCanvasHeight(img.height)
      ctx.drawImage(img, 0, 0)
    }
  }, [])

  return(
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      style={{ border: "1px solid #000", cursor: "crosshair", width: `${canvasWidth}px`, height: `${canvasHeight}px` }}
    />
  )
}

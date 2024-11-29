import { Eraser, FileIcon, Pencil } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export default function DrawingApp() {
  const [tool, setTool] = useState('draw')
  const [color, setColor] = useState('#000000')
  const [brushSize, setBrushSize] = useState(2)
  const [imageUrls, setImageUrls] = useState([
    // "https://i.ibb.co/xYX6ST5/Menulis-Alfabet-page-0002.jpg",
    // "https://i.ibb.co/bbt5b9M/Menulis-Alfabet-page-0003.jpg",
    // "https://i.ibb.co/rdkxRQ0/Menulis-Alfabet-page-0004.jpg",
    // "https://i.ibb.co/rwm6rDc/Menulis-Alfabet-page-0005.jpg",
    // "https://i.ibb.co/68FBZzn/Menulis-Alfabet-page-0006.jpg",
    // "https://i.ibb.co/DDWQS3v/Menulis-Alfabet-page-0007.jpg",
    // "https://i.ibb.co/HPHRW5d/Menulis-Alfabet-page-0008.jpg",
    // "https://i.ibb.co/BqSmQ50/Menulis-Alfabet-page-0009.jpg",
    // "https://i.ibb.co/1mNvFx0/Menulis-Alfabet-page-0010.jpg",
    // "https://i.ibb.co/7CkwBGH/Menulis-Alfabet-page-0011.jpg",
    // "https://i.ibb.co/1XZTYJd/Menulis-Alfabet-page-0012.jpg",
    // "https://i.ibb.co/5Mg0gRb/Menulis-Alfabet-page-0013.jpg",
    // "https://i.ibb.co/tLWv7Fz/Menulis-Alfabet-page-0014.jpg",
    // "https://i.ibb.co/MhQ2CqT/Menulis-Alfabet-page-0015.jpg",
    // "https://i.ibb.co/JRYtdZr/Menulis-Alfabet-page-0016.jpg",
    // "https://i.ibb.co/44QHJZZ/Menulis-Alfabet-page-0017.jpg",
    // "https://i.ibb.co/QFjzDc0/Menulis-Alfabet-page-0018.jpg",
    // "https://i.ibb.co/xmFS13G/Menulis-Alfabet-page-0019.jpg",
    // "https://i.ibb.co/Rj6hZ75/Menulis-Alfabet-page-0020.jpg",
    // "https://i.ibb.co/JK5W7rh/Menulis-Alfabet-page-0021.jpg",
    // "https://i.ibb.co/XtPBt4s/Menulis-Alfabet-page-0022.jpg",
    // "https://i.ibb.co/8DqvmtL/Menulis-Alfabet-page-0023.jpg",
    // "https://i.ibb.co/GW9813s/Menulis-Alfabet-page-0024.jpg",
    // "https://i.ibb.co/ZhWR3rR/Menulis-Alfabet-page-0025.jpg",
    // "https://i.ibb.co/sW6y6Rc/Menulis-Alfabet-page-0026.jpg",
    // "https://i.ibb.co/V2Kpn8X/Menulis-Alfabet-page-0027.jpg",
    // "https://i.ibb.co/YNBP7Jg/Menulis-Alfabet-page-0028.jpg",
    // "https://i.ibb.co/wJjwTwP/Menulis-Alfabet-page-0029.jpg",
    // "https://i.ibb.co/CHrLbJx/Menulis-Alfabet-page-0030.jpg",
    // "https://i.ibb.co/6HWJSSC/Menulis-Alfabet-page-0031.jpg",
    // "https://i.ibb.co/KVByYFH/Menulis-Alfabet-page-0032.jpg",
    // "https://i.ibb.co/gVM9b72/Menulis-Alfabet-page-0033.jpg",
    // "https://i.ibb.co/sbQcj3W/Menulis-Alfabet-page-0034.jpg",
    // "https://i.ibb.co/zhF8CXd/Menulis-Alfabet-page-0035.jpg",
    "https://i.ibb.co/XSR0s2B/Menulis-Alfabet-page-0036.jpg",
    "https://i.ibb.co/HpB1RVX/Menulis-Alfabet-page-0037.jpg",
    "https://i.ibb.co/FsQdFsf/Menulis-Alfabet-page-0038.jpg",
    "https://i.ibb.co/4N0VWXx/Menulis-Alfabet-page-0039.jpg",
    "https://i.ibb.co/tZscb2x/Menulis-Alfabet-page-0040.jpg",
    "https://i.ibb.co/B6vjJZg/Menulis-Alfabet-page-0041.jpg",
    "https://i.ibb.co/QN9YDX3/Menulis-Alfabet-page-0042.jpg",
    "https://i.ibb.co/d0s8ZrN/Menulis-Alfabet-page-0043.jpg",
    "https://i.ibb.co/zf9Fv2L/Menulis-Alfabet-page-0044.jpg",
    "https://i.ibb.co/hmMSfRM/Menulis-Alfabet-page-0045.jpg",
    "https://i.ibb.co/f1Y03rG/Menulis-Alfabet-page-0046.jpg",
    "https://i.ibb.co/GVZb79m/Menulis-Alfabet-page-0047.jpg",
    "https://i.ibb.co/phLCSqf/Menulis-Alfabet-page-0048.jpg",
    "https://i.ibb.co/t8gVpLs/Menulis-Alfabet-page-0049.jpg",
    "https://i.ibb.co/0jVxgPw/Menulis-Alfabet-page-0050.jpg",
    "https://i.ibb.co/3dLYp2p/Menulis-Alfabet-page-0051.jpg",
    "https://i.ibb.co/dgWcpgM/Menulis-Alfabet-page-0052.jpg",
    "https://i.ibb.co/Gk5qJW3/Menulis-Alfabet-page-0053.jpg",
  ])

  return (
    <div className="pb-[100px] p-4 flex flex-col items-center justify-center">
      <div className='max-w-[720px]'>
        <div className='flex w-full justify-start'>
          <h1 className="text-2xl">Children Worksheet</h1>
        </div>

        <div className="mt-2 sticky top-16 z-40 flex flex-wrap items-center gap-4 bg-zinc-100 border p-2 rounded-lg w-full">
          <div className="flex items-center space-x-2">
            <label>Tools:</label>
            <button
              onClick={() => setTool('draw')}
              className={`p-2 border rounded-lg flex items-center ${tool === 'draw' ? 'bg-blue-200' : 'bg-white'}`}
            >
              <Pencil size={16} className='mr-2' /> Draw
            </button>
            <button
              onClick={() => setTool('erase')}
              className={`p-2 border rounded-lg flex items-center ${tool === 'erase' ? 'bg-blue-200' : 'bg-white'}`}
            >
              <Eraser size={16} className='mr-2' /> Eraser
            </button>
          </div>

          {tool === 'draw' && (
            <div className="flex items-center space-x-2">
              <label>Color:</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 w-14 rounded-lg"
              />
            </div>
          )}

          <div className="flex items-center space-x-2">
            <label>Brush Size:</label>
            <input
              type="range"
              min="1"
              max="50"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-32"
            />
            <span>{brushSize}</span>
          </div>
        </div>

        <div className='mt-4 flex flex-col gap-4'>
          {imageUrls.map((imageUrl, index) => (
            <DrawingCanvas
              key={index}
              imageUrl={imageUrl}
              tool={tool}
              color={color}
              brushSize={brushSize}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function DrawingCanvas({ imageUrl, tool, color, brushSize }) {
  const imageCanvasRef = useRef(null)
  const drawingCanvasRef = useRef(null)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const [isDrawing, setIsDrawing] = useState(false)

  // Coordinate calculation function
  const getCoordinates = (e) => {
    const canvas = drawingCanvasRef.current
    const rect = canvas.getBoundingClientRect()

    let clientX, clientY
    if (e.touches) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    }
  }

  // Clear canvas function
  const clearCanvas = () => {
    const drawingCtx = drawingCanvasRef.current.getContext('2d')
    drawingCtx.clearRect(0, 0, drawingCanvasRef.current.width, drawingCanvasRef.current.height)
  }

  // Drawing functions
  const startDrawing = (e) => {
    if (!tool) return
    
    // Prevent default to stop scrolling
    e.preventDefault()
    
    // Stop propagation to prevent parent element scrolling
    e.stopPropagation()
    
    const { x, y } = getCoordinates(e)
    const drawingCtx = drawingCanvasRef.current.getContext('2d')
    
    // Configure context based on tool
    if (tool === 'draw') {
      drawingCtx.globalCompositeOperation = 'source-over'
      drawingCtx.strokeStyle = color
    } else {
      // Erase mode: use destination-out to erase only drawing layer
      drawingCtx.globalCompositeOperation = 'destination-out'
      drawingCtx.strokeStyle = 'rgba(0,0,0,1)'
    }

    drawingCtx.lineWidth = brushSize
    drawingCtx.lineCap = 'round'
    drawingCtx.lineJoin = 'round'
    drawingCtx.beginPath()
    drawingCtx.moveTo(x, y)

    setIsDrawing(true)
  }

  const draw = (e) => {
    if (!tool || !isDrawing) return
    
    // Prevent default to stop scrolling
    e.preventDefault()
    
    // Stop propagation to prevent parent element scrolling
    e.stopPropagation()
    
    const { x, y } = getCoordinates(e)
    
    const drawingCtx = drawingCanvasRef.current.getContext('2d')
    
    drawingCtx.lineTo(x, y)
    drawingCtx.stroke()
  }

  const stopDrawing = (e) => {
    // Prevent default to stop scrolling
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    setIsDrawing(false)
    const drawingCtx = drawingCanvasRef.current.getContext('2d')
    drawingCtx.closePath()
  }

  // Effect to add passive event listeners and prevent scrolling
  useEffect(() => {
    const canvas = drawingCanvasRef.current

    // Passive event listeners for touch events
    const touchStartOptions = { passive: false }
    const touchMoveOptions = { passive: false }

    // Prevent default touch behavior
    const preventScroll = (e) => {
      if (tool) {
        e.preventDefault()
      }
    }

    canvas.addEventListener('touchstart', preventScroll, touchStartOptions)
    canvas.addEventListener('touchmove', preventScroll, touchMoveOptions)

    // Cleanup listeners
    return () => {
      canvas.removeEventListener('touchstart', preventScroll)
      canvas.removeEventListener('touchmove', preventScroll)
    }
  }, [tool])

  // Initial setup of canvases
  useEffect(() => {
    const imageCanvas = imageCanvasRef.current
    const drawingCanvas = drawingCanvasRef.current

    const img = new Image()
    // img.crossOrigin = "Anonymous"
    img.src = imageUrl
    
    img.onload = () => {
      // Set consistent size for all canvases
      const width = img.width
      const height = img.height
      
      imageCanvas.width = width
      imageCanvas.height = height
      drawingCanvas.width = width
      drawingCanvas.height = height

      setCanvasSize({ width, height })

      // Draw image on image canvas
      const imageCtx = imageCanvas.getContext('2d')
      imageCtx.drawImage(img, 0, 0)
    }
  }, [imageUrl])

  return (
    <div className="flex flex-col">
      <div className="flex justify-end items-center space-x-2 border rounded-t-lg p-2">
        <button 
          onClick={clearCanvas} 
          className="px-4 py-2 bg-red-500 text-white rounded flex items-center"
        >
          <FileIcon size={16} className='mr-2' /> Clear
        </button>
      </div>
      <div 
        className="relative touch-none mx-auto w-full border rounded-b-lg overflow-hidden" // Added touch-none to prevent default touch behaviors
      >
        {/* Base image canvas (bottom layer) */}
        <canvas
          ref={imageCanvasRef}
          className="absolute top-0 left-0 pointer-events-none border rounded-xl border-black hidden"
          style={{ zIndex: 1 }}
        />

        <img
          src={imageUrl}
        />

        {/* Drawing canvas (top layer) */}
        <canvas
          ref={drawingCanvasRef}
          className="absolute top-0 left-0 block"
          style={{ zIndex: 2, cursor: "crosshair" }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
    </div>
  )
}
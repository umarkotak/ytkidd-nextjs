import { Eraser, FileIcon, Pencil } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export default function DrawingApp() {
  const [tool, setTool] = useState('draw')
  const [color, setColor] = useState('#000000')
  const [brushSize, setBrushSize] = useState(2)
  const [imageUrls, setImageUrls] = useState([
    "https://iili.io/2lQbwla.md.jpg",
    "https://iili.io/2lQbjKg.md.jpg",
    "https://iili.io/2lQbXiF.md.jpg",
    "https://iili.io/2lQb8DN.md.jpg",
    "https://iili.io/2lQbUxI.md.jpg",
    "https://iili.io/2lQbgVt.md.jpg",
    "https://iili.io/2lQbPls.md.jpg",
    "https://iili.io/2lQb6fn.md.jpg",
    "https://iili.io/2lQbiUG.md.jpg",
    "https://iili.io/2lQbLJf.md.jpg",
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
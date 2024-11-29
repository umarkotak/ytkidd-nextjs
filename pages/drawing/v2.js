import { useState, useRef, useEffect } from 'react'

export default function DrawingApp() {
  const [tool, setTool] = useState('draw')
  const [color, setColor] = useState('#000000')
  const [brushSize, setBrushSize] = useState(3)
  const [imageUrls, setImageUrls] = useState([
    "https://i.pinimg.com/736x/7d/ea/8d/7dea8d9ba7771ab5755637aba144d636.jpg",
    "https://i.pinimg.com/736x/1f/04/c7/1f04c76f0025524c953ae90f3cf8d3fc.jpg",
    "https://i.pinimg.com/736x/d9/b0/85/d9b08593a3fec3de0a879b906eb7ee9a.jpg",
    "https://i.pinimg.com/736x/00/71/f6/0071f670f26779a4401f47aee0862301.jpg",
  ])

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Drawing Canvas</h1>
      
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <label>Tools:</label>
          <button 
            onClick={() => setTool('draw')}
            className={`p-2 border ${tool === 'draw' ? 'bg-blue-200' : 'bg-white'}`}
          >
            Draw
          </button>
          <button 
            onClick={() => setTool('erase')}
            className={`p-2 border ${tool === 'erase' ? 'bg-blue-200' : 'bg-white'}`}
          >
            Erase
          </button>
        </div>

        {tool === 'draw' && (
          <div className="flex items-center space-x-2">
            <label>Color:</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-10 w-14"
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
    e.preventDefault()
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
    const { x, y } = getCoordinates(e)
    
    e.preventDefault()
    
    const drawingCtx = drawingCanvasRef.current.getContext('2d')
    
    drawingCtx.lineTo(x, y)
    drawingCtx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    const drawingCtx = drawingCanvasRef.current.getContext('2d')
    drawingCtx.closePath()
  }

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
    <div className="space-y-2">
      <div className="flex justify-end items-center space-x-2">
        <button 
          onClick={clearCanvas} 
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Clear
        </button>
      </div>
      <div 
        className="relative" 
        style={{ 
          width: canvasSize.width, 
          height: canvasSize.height 
        }}
      >
        {/* Base image canvas (bottom layer) */}
        <canvas
          ref={imageCanvasRef}
          className="absolute top-0 left-0 pointer-events-none"
          style={{ zIndex: 1 }}
        />

        {/* Drawing canvas (top layer) */}
        <canvas
          ref={drawingCanvasRef}
          className="absolute top-0 left-0"
          style={{ zIndex: 3, cursor: "crosshair" }}
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
import { useEffect, useRef, useState, useCallback } from "react"
import { ArrowLeft, ArrowRight, Eraser, MenuIcon, PencilIcon, Fullscreen } from "lucide-react"
import { useRouter } from "next/router"
import { useSearchParams } from "next/navigation"
import ytkiddAPI from "@/apis/ytkidApi"

// Constants
const TOOLS = {
  DRAW: 'draw',
  ERASER: 'eraser'
}

const DEFAULT_BRUSH_CONFIG = {
  size: 3,
  color: '#ff0000'
}

// Custom hook for managing book state
const useBookReader = (bookId) => {
  const [bookState, setBookState] = useState({
    details: {},
    activePage: {},
    pageNumber: 1,
    maxPages: 0,
    canvasStates: {} // Store canvas states for each page
  })

  const fetchBookDetail = useCallback(async () => {
    if (!bookId || bookState.details.id === parseInt(bookId)) return

    try {
      const response = await ytkiddAPI.GetBookDetail("", {}, { book_id: bookId })
      if (response.status !== 200) return

      const { data } = await response.json()
      
      // Preload images
      data.contents.forEach(content => {
        const img = new Image()
        img.src = content.image_file_url
        window[content.image_file_url] = img
      })

      setBookState(prev => ({
        ...prev,
        details: data,
        maxPages: data.contents.length,
        canvasStates: {} // Reset canvas states when loading new book
      }))

      return data
    } catch (error) {
      console.error('Error fetching book details:', error)
    }
  }, [bookId, bookState.details.id])

  return { bookState, setBookState, fetchBookDetail }
}

// Drawing Canvas Component
const DrawingCanvas = ({ 
  isFullscreen, 
  imageLoaded, 
  imageUrl, 
  tool, 
  brushConfig, 
  className,
  pageNumber,
  onCanvasStateChange,
  initialState 
}) => {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const tempStateRef = useRef(null) // Store temporary canvas state during resize

  // Save canvas state
  const saveCanvasState = useCallback(() => {
    if (!canvasRef.current) return
    const state = canvasRef.current.toDataURL()
    onCanvasStateChange(pageNumber, state)
  }, [pageNumber, onCanvasStateChange])

  // Save temporary state before resize
  const saveTempState = useCallback(() => {
    if (!canvasRef.current) return
    tempStateRef.current = canvasRef.current.toDataURL()
  }, [])

  // Restore canvas state
  const restoreCanvas = useCallback((state) => {
    if (!canvasRef.current || !state) return
    
    const ctx = canvasRef.current.getContext('2d')
    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
    }
    img.src = state
  }, [])

   // Handle canvas resize
   const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const img = document.getElementById("workbook-image")
    if (!img) return

    saveTempState() // Save current state before resize
    
    canvas.width = img.width
    canvas.height = img.height

    // Restore the saved state after resize
    if (tempStateRef.current) {
      restoreCanvas(tempStateRef.current)
    }
  }, [saveTempState, restoreCanvas])

  // Load initial state
  useEffect(() => {
    if (!canvasRef.current || !initialState) return
    restoreCanvas(initialState)
  }, [initialState, restoreCanvas])

  useEffect(() => {
    resizeCanvas()
  }, [isFullscreen, imageLoaded, imageUrl, resizeCanvas])

  const getCoordinates = useCallback((e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    }
  }, [])

  const initializeDrawing = useCallback((e) => {
    if (!tool) return
    e.preventDefault()
    e.stopPropagation()

    const ctx = canvasRef.current.getContext('2d')
    const { x, y } = getCoordinates(e)

    ctx.globalCompositeOperation = tool === TOOLS.DRAW ? 'source-over' : 'destination-out'
    ctx.strokeStyle = tool === TOOLS.DRAW ? brushConfig.color : 'rgba(0,0,0,1)'
    ctx.lineWidth = brushConfig.size
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(x, y)

    setIsDrawing(true)
  }, [tool, brushConfig, getCoordinates])

  const draw = useCallback((e) => {
    if (!tool || !isDrawing) return
    e.preventDefault()
    e.stopPropagation()

    const ctx = canvasRef.current.getContext('2d')
    const { x, y } = getCoordinates(e)
    
    ctx.lineTo(x, y)
    ctx.stroke()
  }, [tool, isDrawing, getCoordinates])

  const stopDrawing = useCallback((e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setIsDrawing(false)
    canvasRef.current.getContext('2d').closePath()
    saveCanvasState() // Save canvas state when drawing stops
  }, [saveCanvasState])

  const preventDefaultTouchAction = useCallback((e) => {
    if (tool) {
      e.preventDefault()
      e.stopPropagation()
    }
  }, [tool])

  useEffect(() => {
    const canvas = canvasRef.current
    const img = document.getElementById("workbook-image")
    if (img) {
      canvas.width = img.width
      canvas.height = img.height
    }
  }, [imageUrl, imageLoaded, isFullscreen])

  useEffect(() => {
    const canvas = canvasRef.current
    const options = { passive: false }
    
    canvas.addEventListener('touchstart', preventDefaultTouchAction, options)
    canvas.addEventListener('touchmove', preventDefaultTouchAction, options)

    return () => {
      canvas.removeEventListener('touchstart', preventDefaultTouchAction)
      canvas.removeEventListener('touchmove', preventDefaultTouchAction)
    }
  }, [tool, preventDefaultTouchAction])

  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
        className="mx-auto object-contain"
        style={{ zIndex: 2, cursor: "crosshair" }}
        onMouseDown={initializeDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onTouchStart={initializeDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
    </div>
  )
}

// Main Component
export default function Read() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { bookState, setBookState, fetchBookDetail } = useBookReader(router.query.book_id)
  
  const [uiState, setUiState] = useState({
    imageLoading: true,
    isFullscreen: false,
    showTools: true,
    imageLoaded: new Date(),
    tool: TOOLS.DRAW,
    brushConfig: DEFAULT_BRUSH_CONFIG
  })

  // Handle canvas state changes
  const handleCanvasStateChange = useCallback((pageNumber, canvasState) => {
    setBookState(prev => ({
      ...prev,
      canvasStates: {
        ...prev.canvasStates,
        [pageNumber]: canvasState
      }
    }))
  }, [setBookState])

  useEffect(() => {
    setUiState(prev => ({ ...prev, imageLoading: true }))
    fetchBookDetail()
  }, [router, fetchBookDetail])

  useEffect(() => {
    if (!bookState.details.id || !bookState.details.contents) return

    const pageNumber = Math.max(1, Math.min(
      parseInt(searchParams.get("page")) || 1,
      bookState.maxPages
    ))

    const pageIndex = pageNumber - 1
    const activePage = bookState.details.contents[pageIndex]

    if (activePage?.image_file_url) {
      setBookState(prev => ({
        ...prev,
        activePage,
        pageNumber
      }))
    }
  }, [router, bookState.details, searchParams, bookState.maxPages])

  const navigatePage = useCallback((increment) => {
    const newPage = bookState.pageNumber + increment
    if (newPage < 1 || newPage > bookState.maxPages) return

    setUiState(prev => ({ ...prev, imageLoading: true }))
    router.push({
      pathname: `/workbooks/${router.query.book_id}/read`,
      search: `?page=${newPage}`
    })
  }, [bookState.pageNumber, bookState.maxPages, router])

  return (
    <main className="p-2 w-full">
      <div className={`${uiState.isFullscreen ? 'absolute top-0 left-0 w-full h-screen z-50 bg-white' : 'max-h-[calc(100vh-100px)] relative'}`}>
      <img
          id="workbook-image"
          className={`${uiState.isFullscreen ? 'h-screen mx-auto' : 'max-h-[calc(100vh-100px)] object-contain mx-auto rounded-lg'}`}
          src={bookState.activePage.image_file_url}
          onLoad={() => setUiState(prev => ({ 
            ...prev, 
            imageLoading: false,
            imageLoaded: new Date()
          }))}
        />
        
        <DrawingCanvas
          isFullscreen={uiState.isFullscreen}
          imageLoaded={uiState.imageLoaded}
          key={`${bookState.pageNumber}-${uiState.imageLoaded}`}
          imageUrl={bookState.activePage.image_file_url}
          tool={uiState.tool}
          brushConfig={uiState.brushConfig}
          pageNumber={bookState.pageNumber}
          onCanvasStateChange={handleCanvasStateChange}
          initialState={bookState.canvasStates[bookState.pageNumber]}
          className={`${uiState.isFullscreen ? 'object-contain absolute top-0 left-0 w-full h-screen' : 'max-h-[calc(100vh-100px)] absolute top-0 left-0 w-full'}`}
        />

        {/* Loading Overlay */}
        {uiState.imageLoading && (
          <div className="absolute z-20 top-0 left-0 w-full h-full bg-black bg-opacity-10 backdrop-blur-sm">
            <div className="mx-auto text-center text-xl flex flex-col h-full justify-center">
              <div>
                <span className="bg-white py-1 px-2 rounded-lg">Loading...</span>
              </div>
            </div>
          </div>
        )}

        {/* Tools Menu */}
        <div className="w-12 absolute z-10 top-2 left-2 flex flex-col items-center gap-2 bg-white bg-opacity-80 rounded-lg border border-black shadow-sm py-1">
          <button
            className="rounded-lg flex justify-start items-center hover:scale-110 duration-500 p-1"
            onClick={() => setUiState(prev => ({ ...prev, showTools: !prev.showTools }))}
          >
            <MenuIcon size={18} />
          </button>
        </div>

        {uiState.showTools && (
          <div className="w-12 absolute z-10 top-12 left-2 flex flex-col items-center gap-2 bg-white bg-opacity-80 rounded-lg border border-black shadow-sm px-0.5 py-2">
            <button
              className={`rounded-lg flex justify-start items-center hover:scale-110 duration-500 p-1 ${uiState.tool === TOOLS.DRAW ? "bg-green-300" : ""}`}
              onClick={() => setUiState(prev => ({ ...prev, tool: TOOLS.DRAW }))}
            >
              <PencilIcon size={18} />
            </button>
            
            <input
              type="color"
              value={uiState.brushConfig.color}
              onChange={(e) => setUiState(prev => ({ 
                ...prev, 
                brushConfig: { ...prev.brushConfig, color: e.target.value }
              }))}
              className="w-8"
            />
            
            <input
              type="number"
              className="border rounded-md w-full text-center"
              min="1"
              max="50"
              value={uiState.brushConfig.size}
              onChange={(e) => setUiState(prev => ({ 
                ...prev, 
                brushConfig: { ...prev.brushConfig, size: parseInt(e.target.value, 10) }
              }))}
            />
            
            <button
              className={`rounded-lg flex justify-start items-center hover:scale-110 duration-500 p-1 ${uiState.tool === TOOLS.ERASER ? "bg-green-300" : ""}`}
              onClick={() => setUiState(prev => ({ ...prev, tool: TOOLS.ERASER }))}
            >
              <Eraser size={18} />
            </button>
          </div>
        )}

        {/* Navigation Controls */}
        <div className="absolute z-10 top-2 right-2 flex gap-1 bg-white bg-opacity-80 rounded-full border border-black shadow-sm px-1 py-0.5">
          <button
            className="rounded-lg flex justify-start items-center hover:scale-110 duration-500 p-1"
            onClick={() => navigatePage(-1)}
          >
            <ArrowLeft size={18} />
          </button>
          
          <span className="text-black text-[14px] p-1">
            {bookState.pageNumber} / {bookState.maxPages}
          </span>
          
          <button
            className="rounded-lg flex justify-start items-center hover:scale-110 duration-500 p-1"
            onClick={() => navigatePage(1)}
          >
            <ArrowRight size={18} />
          </button>
          
          <button
            className="rounded-lg flex justify-start items-center hover:scale-110 duration-500 p-1"
            onClick={() => setUiState(prev => ({ ...prev, isFullscreen: !prev.isFullscreen }))}
          >
            <Fullscreen size={18} />
          </button>
        </div>
      </div>
    </main>
  )
}
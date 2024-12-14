import ytkiddAPI from "@/apis/ytkidApi"
import { classNames, FullScreenMode } from "@react-pdf-viewer/core"
import { ArrowLeft, ArrowRight, FileIcon, FullscreenIcon } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"

var tmpBookDetail = {}
var tmpMaxPageNumber = 0
export default function Read() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [bookDetail, setBookDetail] = useState({})
  const [activePage, setActivePage] = useState({})
  const [activePageNumber, setActivePageNumber] = useState(1)
  const [imageLoading, setImageLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  // state for drawing
  const [tool, setTool] = useState('draw')
  const [color, setColor] = useState('#ff0000')
  const [brushSize, setBrushSize] = useState(3)
  const [imageLoaded, setImageLoaded] = useState(new Date)

  useEffect(() => {
    tmpBookDetail = {}
    tmpMaxPageNumber = 0
  }, [])

  useEffect(() => {
    setImageLoading(true)
    GetBookDetail(router.query.book_id)
  }, [router])

  useEffect(() => {
    if (!tmpBookDetail.id) { return }
    if (!tmpBookDetail.contents) { return }

    var pageNumber = parseInt(searchParams.get("page"))
    var pageIndex = pageNumber - 1
    if (pageIndex <= 0) { pageIndex = 0 }
    if (pageIndex >= tmpMaxPageNumber) { pageIndex = tmpMaxPageNumber - 1 }

    setActivePageNumber(pageIndex+1)

    if (!tmpBookDetail.contents[pageIndex] || !tmpBookDetail.contents[pageIndex].image_file_url) { return }
    setActivePage(tmpBookDetail.contents[pageIndex])
  }, [router, bookDetail])

  async function GetBookDetail(bookID) {
    if (!bookID) { return }

    if (bookDetail.id === parseInt(bookID)) { return }

    try {
      const response = await ytkiddAPI.GetBookDetail("", {}, {
        book_id: bookID
      })
      const body = await response.json()
      if (response.status !== 200) {
        return
      }

      tmpBookDetail = body.data
      tmpMaxPageNumber = tmpBookDetail.contents.length
      setBookDetail(tmpBookDetail)

      for(const oneContent of tmpBookDetail.contents) {
        const newImage = new Image();
        newImage.src = oneContent.image_file_url;
        window[oneContent.image_file_url] = newImage;
      }

    } catch (e) {
      console.error(e)
    }
  }

  function NextPage() {
    if (activePageNumber >= tmpMaxPageNumber) { return }
    setImageLoading(true)
    router.push({
      pathname: `/workbooks/${router.query.book_id}/read`,
      search: `?page=${activePageNumber+1}`
    })
  }

  function PrevPage() {
    if (activePageNumber <= 1) { return }
    setImageLoading(true)
    router.push({
      pathname: `/workbooks/${router.query.book_id}/read`,
      search: `?page=${activePageNumber-1}`
    })
  }

  function ToggleFullScreen() {
    setIsFullscreen(!isFullscreen)
  }

  function ImageLoaded() {
    setImageLoading(false)
    setImageLoaded(new Date)
  }

  return(
    <main className="p-2 w-full">
      <div
        className={`${isFullscreen ? `
          absolute top-0 left-0 w-full h-screen z-50 bg-white
        ` : `
          max-h-[calc(100vh-100px)] relative
        `}`}
      >
        <img
          id="workbook-image"
          className={`${isFullscreen ? `
            h-screen mx-auto
          ` : `
            max-h-[calc(100vh-100px)] object-contain mx-auto rounded-lg
          `}`}
          src={activePage.image_file_url}
          onLoad={()=>ImageLoaded()}
        />
        <DrawingCanvas
          isFullscreen={isFullscreen}
          imageLoaded={imageLoaded}
          key={activePageNumber}
          imageUrl={activePage.image_file_url}
          tool={tool}
          color={color}
          brushSize={brushSize}
          className={`${isFullscreen ? `
            object-contain absolute top-0 left-0 w-full h-screen
          ` : `
            max-h-[calc(100vh-100px)] absolute top-0 left-0 w-full
          `}`}
        />
        <div className={`absolute z-20 top-0 left-0 w-full h-full bg-black bg-opacity-10 backdrop-blur-sm ${imageLoading ? "block" : "hidden"}`}>
          <div className="mx-auto text-center text-xl flex flex-col h-full justify-center">
            <div>
              <span className="bg-white py-1 px-2 rounded-lg">Loading...</span>
            </div>
          </div>
        </div>
        <div className="absolute z-10 top-2 right-2 flex gap-2">
          <button
            className="rounded-lg flex justify-start items-center hover:scale-110 bg-white bg-opacity-50 duration-500 p-2"
            onClick={()=>PrevPage()}
          >
            <span className="text-black"><ArrowLeft /></span>
          </button>
          <button
            className="rounded-lg flex justify-start items-center hover:scale-110 bg-white bg-opacity-50 duration-500 p-2"
          >
            <span className="text-black">{activePageNumber} / {tmpMaxPageNumber}</span>
          </button>
          <button
            className="rounded-lg flex justify-start items-center hover:scale-110 bg-white bg-opacity-50 duration-500 p-2"
            onClick={()=>NextPage()}
          >
            <span className="text-black"><ArrowRight /></span>
          </button>
          <button
            className="rounded-lg flex justify-start items-center hover:scale-110 bg-white bg-opacity-50 duration-500 p-2"
            onClick={()=>ToggleFullScreen()}
          >
            <span className="text-black"><FullscreenIcon size={26} /></span>
          </button>
        </div>
      </div>
    </main>
  )
}

function DrawingCanvas({ isFullscreen, imageLoaded, imageUrl, tool, color, brushSize, className, canvasWidth, canvasHeight }) {
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

  useEffect(() => {
    const drawingCanvas = drawingCanvasRef.current
    const imgDimension = getImageDimensionsSync("workbook-image")
    drawingCanvas.width = imgDimension.width
    drawingCanvas.height = imgDimension.height
  }, [imageUrl, imageLoaded, isFullscreen])

  return (
    <div className={className}>
      <canvas
        ref={drawingCanvasRef}
        className="mx-auto object-contain"
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
  )
}

function getImageDimensionsSync(imageId) {
  const img = document.getElementById(imageId);

  if (!img) {
    console.error(`Image with ID "${imageId}" not found.`);
    return null;
  }

  // CRUCIAL: This only works if the image is already loaded!
  return { width: img.width, height: img.height };
}

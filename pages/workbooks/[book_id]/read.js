import ytkiddAPI from "@/apis/ytkidApi"
import { classNames, FullScreenMode } from "@react-pdf-viewer/core"
import { ArrowLeft, ArrowRight, Eraser, FileIcon, FullscreenIcon, MenuIcon, PencilIcon } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/router"
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"

var tmpBookDetail = {}
var tmpMaxPageNumber = 0
export default function Read() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const drawingCanvas = useRef(null)
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
  const [showTool, setShowTool] = useState(true)

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

      const preloadImage = async (imageUrl) => {
        const image = new Image();
        image.src = imageUrl;
        await new Promise((resolve, reject) => {
          image.onload = resolve;
          image.onerror = reject;
        });
      };

      for(const oneContent of tmpBookDetail.contents) {
        await preloadImage(oneContent.image_file_url);
        console.log("PRELOADED", oneContent.image_file_url)
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
          absolute top-0 left-0 w-full z-50 bg-white object-contain max-h-screen
        ` : `
          max-h-[calc(100vh-100px)] relative
        `}`}
      >
        <img
          id="workbook-image"
          className={`border rounded ${isFullscreen ? `
            max-h-screen mx-auto object-contain
          ` : `
            max-h-[calc(100vh-100px)] object-contain mx-auto rounded-lg
          `}`}
          src={activePage.image_file_url}
          onLoad={()=>ImageLoaded()}
        />
        <DrawingCanvas
          ref={drawingCanvas}
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
          bookID={bookDetail.id}
          pageID={activePage.id}
        />
        <div className={`absolute z-20 top-0 left-0 w-full h-full bg-black bg-opacity-10 backdrop-blur-sm ${imageLoading ? "block" : "hidden"}`}>
          <div className="mx-auto text-center text-xl flex flex-col h-full justify-center">
            <div>
              <span className="bg-white py-1 px-2 rounded-lg">Loading...</span>
            </div>
          </div>
        </div>
        <div className="w-12 absolute z-10 top-2 left-2 flex flex-col items-center gap-2 bg-white bg-opacity-80 rounded-lg border border-black shadow-sm py-1">
          <button
            className={`rounded-lg flex justify-start items-center hover:scale-110 duration-500 p-1`}
            onClick={()=>setShowTool(!showTool)}
          >
            <span className="text-black"><MenuIcon size={18} /></span>
          </button>
        </div>
        <div className={`w-12 absolute z-10 top-12 left-2 flex flex-col items-center gap-2 bg-white bg-opacity-80 rounded-lg border border-black shadow-sm px-0.5 py-2 ${showTool ? "block" : "hidden"}`}>
          <button
            className={`rounded-lg flex justify-start items-center hover:scale-110 duration-500 p-1 ${tool === "draw" ? "bg-green-300" : ""}`}
            onClick={()=>setTool("draw")}
          >
            <span className="text-black"><PencilIcon size={18} /></span>
          </button>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8"
          />
          <input
            type="number"
            id="brushSize"
            className="border rounded-md w-full text-center"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value, 10))}
          />
          <button
            className={`rounded-lg flex justify-start items-center hover:scale-110 duration-500 p-1 ${tool === "eraser" ? "bg-green-300" : ""}`}
            onClick={()=>setTool("eraser")}
          >
            <span className="text-black"><Eraser size={18} /></span>
          </button>
          <button
            className={`rounded-lg flex justify-start items-center hover:scale-110 duration-500 p-1 ${tool === "eraser" ? "bg-green-300" : ""}`}
            onClick={()=>{ drawingCanvas.current.clearCanvas() }}
          >
            <span className="text-black"><FileIcon size={18} /></span>
          </button>
        </div>
        <div className="absolute z-10 top-2 right-2 flex gap-1 bg-white bg-opacity-80 rounded-full border border-black shadow-sm px-1 py-0.5">
          <button
            className="rounded-lg flex justify-start items-center hover:scale-110 duration-500 p-1"
            onClick={()=>PrevPage()}
          >
            <span className="text-black"><ArrowLeft size={18} /></span>
          </button>
          <button
            className="rounded-lg flex justify-start items-center p-1"
          >
            <span className="text-black text-[14px]">{activePageNumber} / {tmpMaxPageNumber}</span>
          </button>
          <button
            className="rounded-lg flex justify-start items-center hover:scale-110 duration-500 p-1"
            onClick={()=>NextPage()}
          >
            <span className="text-black"><ArrowRight size={18} /></span>
          </button>
          <button
            className="rounded-lg flex justify-start items-center hover:scale-110 duration-500 p-1"
            onClick={()=>ToggleFullScreen()}
          >
            <span className="text-black"><FullscreenIcon size={18} /></span>
          </button>
        </div>
      </div>
    </main>
  )
}

const DrawingCanvas = forwardRef(function DrawingCanvas({ isFullscreen, imageLoaded, imageUrl, tool, color, brushSize, className, bookID, pageID }, ref) {
  const drawingCanvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const tempStateRef = useRef(null)

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

  useImperativeHandle(ref, () => ({
    clearCanvas: clearCanvas,
  }))

  // Clear canvas function
  const clearCanvas = () => {
    if (!confirm("Are you sure want to clear canvas?")) { return }

    const drawingCtx = drawingCanvasRef.current.getContext('2d')
    drawingCtx.clearRect(0, 0, drawingCanvasRef.current.width, drawingCanvasRef.current.height)

    saveDrawingState(bookID, pageID)
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

    saveDrawingState(bookID, pageID)
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

  function loadDrawingState(bookID, pageID) {
    if (!bookID || !pageID) { return }

    var key = `COOKIEKID:DRAWING_STATE:BOOK:${bookID}:PAGE:${pageID}`
    try {
      var tempCanvasDrawingUrl = localStorage.getItem(key)

      if (!tempCanvasDrawingUrl || tempCanvasDrawingUrl === "") { return }

      const drawingCanvas = drawingCanvasRef.current

      const ctx = drawingCanvas.getContext('2d')
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0, drawingCanvas.width, drawingCanvas.height)
      }
      img.src = tempCanvasDrawingUrl
    } catch (e) {

    }
  }

  function saveDrawingState(bookID, pageID) {
    if (!bookID || !pageID) { return }

    var key = `COOKIEKID:DRAWING_STATE:BOOK:${bookID}:PAGE:${pageID}`
    try {
      const drawingCanvas = drawingCanvasRef.current
      if (!drawingCanvas) { return }

      console.log("DRAWING SAVED")
      localStorage.setItem(key, drawingCanvas.toDataURL())
    } catch(e) {

    }
  }

  useEffect(() => {
    const drawingCanvas = drawingCanvasRef.current
    const imgDimension = getImageDimensionsSync("workbook-image")

    const tempCanvasDrawingUrl = drawingCanvas.toDataURL()

    drawingCanvas.width = imgDimension.width
    drawingCanvas.height = imgDimension.height

    console.log("CANVAS SIZE", drawingCanvas.width, drawingCanvas.height, bookID, pageID)
    const ctx = drawingCanvas.getContext('2d')
    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, 0, 0, drawingCanvas.width, drawingCanvas.height)
    }
    img.src = tempCanvasDrawingUrl
  }, [isFullscreen])

  useEffect(() => {
    const drawingCanvas = drawingCanvasRef.current
    const imgDimension = getImageDimensionsSync("workbook-image")

    drawingCanvas.width = imgDimension.width
    drawingCanvas.height = imgDimension.height

    loadDrawingState(bookID, pageID)
  }, [imageUrl, imageLoaded])

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
})

function getImageDimensionsSync(imageId) {
  const img = document.getElementById(imageId);

  if (!img) {
    console.error(`Image with ID "${imageId}" not found.`);
    return null;
  }

  // CRUCIAL: This only works if the image is already loaded!
  return { width: img.width, height: img.height };
}

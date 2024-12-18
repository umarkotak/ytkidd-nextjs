import ytkiddAPI from "@/apis/ytkidApi"
import Utils from "@/models/Utils"
import { classNames } from "@react-pdf-viewer/core"
import { BookIcon, PlusIcon } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

const defaultBookParams = {
  pdf_url: "",
  title: "",
  slug: "",
  custom_image_slug: "",
  description: "",
  img_format: "jpeg", // jpeg,png
  book_type: "default", // default,workbook
}
export default function DevBooks() {
  const searchParams = useSearchParams()

  const [bookPdfFile, setBookPdfFile] = useState(null)
  const [uploadMode, setUploadMode] = useState("pdf")
  const [bookParams, setBookParams] = useState(defaultBookParams)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
  }, [])

  const handleFileChange = (event) => {
    setBookPdfFile(event.target.files[0])
  }

  const handleParamsChange = (event, field) => {
    if (field === "title") {
      setBookParams({...bookParams,
        "slug": Utils.Slugify(event.target.value),
        "custom_image_slug": Utils.Slugify(event.target.value),
        "title": event.target.value,
      })
      return
    }

    setBookParams({...bookParams, [field]: event.target.value})
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append("pdf_file", bookPdfFile)
    formData.append("pdf_url", bookParams.pdf_url)
    formData.append("title", bookParams.title)
    formData.append("slug", bookParams.slug)
    formData.append("custom_image_slug", bookParams.custom_image_slug)
    formData.append("description", bookParams.description)
    formData.append("img_format", bookParams.img_format)
    formData.append("book_type", bookParams.book_type)

    try {
      const response = await fetch(`${ytkiddAPI.Host}/ytkidd/api/books/insert_from_pdf`, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        setIsSubmitting(false)
      } else {
        const errorData = await response.json()
        toast.error(errorData.error.internal_error)
        setIsSubmitting(false)
        return
      }
    } catch (error) {
      toast.error(error)
      setIsSubmitting(false)
      return
    }

    setBookPdfFile(null)
    setBookParams(defaultBookParams)
    toast("Add book success!", {
      onClose: ((reason) => {})
    })
  }

  return(
    <main className="pb-[100px] p-4">
      <div className="container max-w-[720px] mx-auto shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl flex gap-1 items-center"><BookIcon size={24} /> Add Book</span>
          </div>
          <div className="flex gap-1">
            <button
              className={`btn btn-sm ${uploadMode === "pdf" ? "btn-primary" : ""}`}
              onClick={()=>setUploadMode("pdf")}
            >PDF</button>
            <button
              className={`btn btn-sm ${uploadMode === "url" ? "btn-primary" : ""}`}
              onClick={()=>setUploadMode("url")}
            >URL</button>
          </div>
        </div>

        <form className="flex flex-col gap-3 mt-4" onSubmit={handleSubmit}>
          { uploadMode === "pdf" ? <div>
            <label className="text-lg">Upload Pdf Book</label>
            <input
              type="file" className="file-input file-input-bordered w-full"
              accept="application/pdf"
              onChange={(e)=>handleFileChange(e)}
            />
          </div> : <div>
            <label className="text-lg">Url Pdf Book</label>
            <input
              type="text" placeholder="pdf file url" className="input input-bordered w-full"
              onChange={(e)=>handleParamsChange(e, "pdf_url")}
              value={bookParams.pdf_url}
            />
          </div> }
          <div>
            <label className="text-lg">Title</label>
            <input
              type="text" placeholder="" className="input input-bordered w-full"
              onChange={(e)=>handleParamsChange(e, "title")}
              value={bookParams.title}
            />
          </div>
          <div className="flex gap-2">
            <div className="w-full">
              <label className="text-lg">Slug</label>
              <input
                type="text" placeholder="" className="input input-bordered w-full"
                onChange={(e)=>handleParamsChange(e, "slug")}
                value={bookParams.slug}
              />
            </div>
            <div className="w-full">
              <label className="text-lg">Custom Image Slug</label>
              <input
                type="text" placeholder="" className="input input-bordered w-full"
                onChange={(e)=>handleParamsChange(e, "custom_image_slug")}
                value={bookParams.custom_image_slug}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-full">
              <label className="text-lg">Book Type</label>
              <select
                className="select select-bordered w-full"
                onChange={(e)=>handleParamsChange(e, "book_type")}
                value={bookParams.book_type}
              >
                <option value="default">Default</option>
                <option value="workbook">Workbook</option>
              </select>
            </div>
            <div className="w-full">
              <label className="text-lg">Image Format</label>
              <select
                className="select select-bordered w-full"
                onChange={(e)=>handleParamsChange(e, "img_format")}
                value={bookParams.img_format}
              >
                <option value="jpeg">Jpeg</option>
                <option value="png">Png</option>
              </select>
            </div>
          </div>
          <div className="w-full">
            <label className="text-lg">Description</label>
            <input
              type="text" placeholder="" className="input input-bordered w-full"
              onChange={(e)=>handleParamsChange(e, "description")}
              value={bookParams.description}
            />
          </div>
          <div className="w-full flex justify-end">
            <button type="submit" className="btn" disabled={isSubmitting}>Submit</button>
          </div>
        </form>
      </div>
    </main>
  )
}

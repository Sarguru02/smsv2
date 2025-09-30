"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useRef } from "react"
import { Upload, Download, FileText } from "lucide-react"
import { AuthClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { upload } from "@vercel/blob/client";
import { useAuth } from "../auth-provider"

type SampleCSVConfig = {
  headers: string[]
  sampleData: string[][]
  filename: string
}

type FormatRequirement = {
  title: string
  requirements: string[]
}

type Props = {
  title: string
  description: string
  type: string
  processEndpoint: string
  sampleCSV: SampleCSVConfig
  formatRequirements: FormatRequirement
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onUploadComplete?: (jobId: string) => void
}

export default function BatchUploadDialog({ 
  title,
  description,
  type,
  processEndpoint,
  sampleCSV,
  formatRequirements,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  onUploadComplete 
}: Props) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = externalOpen !== undefined ? externalOpen : internalOpen
  const setOpen = externalOnOpenChange || setInternalOpen
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth();

  const downloadSampleCSV = () => {
    const csvContent = [
      sampleCSV.headers.join(","),
      ...sampleCSV.sampleData.map(row => row.join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", sampleCSV.filename)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "text/csv") {
      setSelectedFile(file)
    } else {
      alert("Please select a valid CSV file")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a CSV file")
      return
    }

    setUploading(true)

    try {
      // Show uploading toast
      toast.loading("Uploading CSV file...", {
        id: "upload-toast"
      })

      const jobId = crypto.randomUUID();

      // Upload to Vercel Blob
      const fileName = "studentDetails/" + selectedFile.name;
      await upload(fileName, selectedFile, {
        access: 'public',
        handleUploadUrl: '/api/upload',
        clientPayload: JSON.stringify({
          type: type,
          jobId,
          processEndpoint: processEndpoint,
          fileName,
          userId: user?.id,
        }),
        headers: AuthClient.getAuthHeaders(),
      })

      // Show success message
      toast.success("File uploaded successfully! Processing students...", {
        id: "upload-toast"
      })

      // Reset form
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      setOpen(false)

      // Call callback and navigate to jobs page
      if (onUploadComplete) {
        onUploadComplete(jobId)
      }

    } catch (error) {
      console.error('Upload error:', error)
      toast.error("Failed to upload file. Please try again.", {
        id: "upload-toast"
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {externalOpen === undefined && (
        <DialogTrigger asChild>
          <Button className="w-full" variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Upload CSV
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Download Sample Button */}
          <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
            <h3 className="font-medium mb-2">Download Sample CSV</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Download a sample CSV file with the correct format and headers
            </p>
            <Button onClick={downloadSampleCSV} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download Sample
            </Button>
          </div>

          {/* File Upload */}
          <div className="space-y-3">
            <Label htmlFor="csvFile">Select CSV File</Label>
            <div className="relative">
              <div
                className={`
                  border-2 border-dashed rounded-lg p-6 text-center transition-colors
                  ${selectedFile
                    ? 'border-green-300 bg-green-50 dark:border-green-600 dark:bg-green-900/20'
                    : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
                  }
                  ${uploading ? 'opacity-50 pointer-events-none' : ''}
                `}
              >
                <Input
                  id="csvFile"
                  type="file"
                  accept=".csv"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  disabled={uploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="space-y-2">
                  {selectedFile ? (
                    <>
                      <FileText className="w-8 h-8 mx-auto text-green-600" />
                      <div>
                        <p className="font-medium text-green-700 dark:text-green-400">
                          {selectedFile.name}
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-500">
                          File selected successfully
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mx-auto text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-700 dark:text-gray-300">
                          Click to select CSV file
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          or drag and drop your file here
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Format Requirements */}
          <div className="border rounded-lg p-3 bg-blue-50 dark:bg-blue-900/20">
            <h4 className="font-medium text-sm mb-2">{formatRequirements.title}:</h4>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              {formatRequirements.requirements.map((requirement, index) => (
                <li key={index}>• {requirement}</li>
              ))}
            </ul>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary" disabled={uploading}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
          >
            {uploading ? "Uploading..." : "Upload CSV"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Download, FileText, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface BulkResult {
  data: any[]
  filename: string
}

export default function BulkPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<BulkResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const requiredColumns = [
    "Age",
    "Income",
    "ProductQuality",
    "ServiceQuality",
    "PurchaseFrequency",
    "Gender",
    "Country",
    "FeedbackScore",
    "LoyaltyLevel",
  ]

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type !== "text/csv") {
      setError("Please select a CSV file")
      return
    }
    setFile(selectedFile)
    setError(null)
    setResult(null)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileSelect(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsProcessing(true)
    setError(null)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/predict_bulk", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Upload failed")
      }

      // Handle CSV response
      const csvText = await response.text()
      const rows = csvText.split("\n").map((row) => row.split(","))
      const headers = rows[0]
      const data = rows.slice(1).filter((row) => row.length === headers.length)

      setResult({
        data: data.map((row) => {
          const obj: any = {}
          headers.forEach((header, index) => {
            obj[header] = row[index]
          })
          return obj
        }),
        filename: `predictions_${file.name}`,
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!result) return

    const headers = Object.keys(result.data[0])
    const csvContent = [
      headers.join(","),
      ...result.data.map((row) => headers.map((header) => row[header]).join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = result.filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bulk Forecast Tool</h1>
        <p className="text-gray-600">Upload a CSV file to get predictions for multiple customers at once</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>File Requirements</CardTitle>
              <CardDescription>Your CSV file must include these columns:</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {requiredColumns.map((column) => (
                  <div key={column} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    {column}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upload CSV File</CardTitle>
              <CardDescription>Drag and drop or click to select your file</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                {file ? (
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Drop your CSV file here</p>
                    <p className="text-xs text-gray-500">or click to browse</p>
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileInput} className="hidden" />

              {error && (
                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button onClick={handleUpload} disabled={!file || isProcessing} className="w-full mt-4">
                {isProcessing ? "Processing..." : "Generate Predictions"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div>
          {result ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Results Ready
                </CardTitle>
                <CardDescription>Processed {result.data.length} customer records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Preview (first 5 rows)</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-1">Age</th>
                            <th className="text-left p-1">Country</th>
                            <th className="text-left p-1">Predicted Score</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.data.slice(0, 5).map((row, index) => (
                            <tr key={index} className="border-b">
                              <td className="p-1">{row.Age}</td>
                              <td className="p-1">{row.Country}</td>
                              <td className="p-1 font-medium">{row.PredictedSatisfactionScore}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <Button onClick={handleDownload} className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Complete Results
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64 text-gray-500">
                Upload a CSV file to see results here
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

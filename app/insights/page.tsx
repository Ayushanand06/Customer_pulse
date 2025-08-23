"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// FIX: Changed to use underscore to match your filename
import { PlotViewer } from "@/components/plot_viewer"

const plotOptions = [
  { value: "distribution", label: "Satisfaction Score Distribution" },
  { value: "feature_importance", label: "Key Driver Analysis" },
  { value: "segment_comparison", label: "Segment Comparison" },
  { value: "correlation", label: "Correlation Explorer" },
]

const segmentOptions = [
  { value: "Country", label: "Country" },
  { value: "LoyaltyLevel", label: "Loyalty Level" },
  { value: "Gender", label: "Gender" },
  { value: "FeedbackScore", label: "Feedback Score" },
]

export default function InsightsPage() {
  const [selectedPlot, setSelectedPlot] = useState<string>("")
  const [selectedSegment, setSelectedSegment] = useState<string>("Country")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Insights Dashboard</h1>
        <p className="text-gray-600">Explore historical customer data to understand key drivers of satisfaction</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Controls Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Controls</CardTitle>
              <CardDescription>Select the type of analysis to view</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Analysis Type</label>
                <Select value={selectedPlot} onValueChange={setSelectedPlot}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select analysis type" />
                  </SelectTrigger>
                  <SelectContent>
                    {plotOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedPlot === "segment_comparison" && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Segment By</label>
                  <Select value={selectedSegment} onValueChange={setSelectedSegment}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {segmentOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>
                {plotOptions.find((p) => p.value === selectedPlot)?.label || "Select Analysis Type"}
              </CardTitle>
              <CardDescription>
                {selectedPlot === "distribution" && "View the overall distribution of customer satisfaction scores"}
                {selectedPlot === "feature_importance" && "Identify which customer attributes most impact satisfaction"}
                {selectedPlot === "segment_comparison" && "Compare satisfaction across different customer segments"}
                {selectedPlot === "correlation" && "Explore relationships between numerical features"}
                {!selectedPlot && "Choose an analysis type from the sidebar to begin"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedPlot ? (
                <PlotViewer
                  plotType={selectedPlot}
                  segment={selectedPlot === "segment_comparison" ? selectedSegment : undefined}
                />
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  Select an analysis type to view insights
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
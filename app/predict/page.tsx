// File: app/predict/page.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { PredictionResult } from "@/components/prediction_result"
import { Loader2 } from "lucide-react"

// ... (interfaces are the same)

export default function PredictPage() {
  // ... (useState hooks are the same)

  const handlePredict = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/predict_sigle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData),
      });
      if (!response.ok) {
        throw new Error("Prediction failed");
      }
      const result = await response.json();
      setPrediction(result);
    } catch (_err) { // Fixed ESLint warning
      setError("Failed to generate prediction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ... (isFormValid and the rest of the return JSX is the same, with the <SelectTrigger> typo fixed)
}
// NOTE: I'm providing the full component below for easy copy-paste
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { PredictionResult } from "@/components/prediction_result"
import { Loader2 } from "lucide-react"

interface CustomerData {
  Age: number
  Income: number
  ProductQuality: number
  ServiceQuality: number
  PurchaseFrequency: number
  Gender: string
  Country: string
  FeedbackScore: string
  LoyaltyLevel: string
}

interface PredictionResponse {
  predicted_score: number
  score_category: string
}

export default function PredictPage() {
  const [customerData, setCustomerData] = useState<CustomerData>({
    Age: 35,
    Income: 50000,
    ProductQuality: 5,
    ServiceQuality: 5,
    PurchaseFrequency: 6,
    Gender: "",
    Country: "",
    FeedbackScore: "",
    LoyaltyLevel: "",
  })

  const [prediction, setPrediction] = useState<PredictionResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePredict = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/predict_sigle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData),
      })

      if (!response.ok) {
        throw new Error("Prediction failed")
      }

      const result = await response.json()
      setPrediction(result)
    } catch (_err) {
      setError("Failed to generate prediction. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid =
    customerData.Gender && customerData.Country && customerData.FeedbackScore && customerData.LoyaltyLevel

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Predictive Simulator</h1>
        <p className="text-gray-600">Configure customer attributes to predict their satisfaction score</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Profile</CardTitle>
            <CardDescription>Enter customer details for prediction</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Numerical Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={customerData.Age}
                  onChange={(e) => setCustomerData((prev) => ({ ...prev, Age: Number.parseInt(e.target.value) || 0 }))}
                  min="18"
                  max="100"
                />
              </div>
              <div>
                <Label htmlFor="income">Annual Income ($)</Label>
                <Input
                  id="income"
                  type="number"
                  value={customerData.Income}
                  onChange={(e) =>
                    setCustomerData((prev) => ({ ...prev, Income: Number.parseInt(e.target.value) || 0 }))
                  }
                  min="0"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="frequency">Purchase Frequency (per year)</Label>
              <Input
                id="frequency"
                type="number"
                value={customerData.PurchaseFrequency}
                onChange={(e) =>
                  setCustomerData((prev) => ({ ...prev, PurchaseFrequency: Number.parseInt(e.target.value) || 0 }))
                }
                min="0"
              />
            </div>

            {/* Quality Sliders */}
            <div>
              <Label>Product Quality: {customerData.ProductQuality}/10</Label>
              <Slider
                value={[customerData.ProductQuality]}
                onValueChange={(value) => setCustomerData((prev) => ({ ...prev, ProductQuality: value[0] }))}
                max={10}
                min={1}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Service Quality: {customerData.ServiceQuality}/10</Label>
              <Slider
                value={[customerData.ServiceQuality]}
                onValueChange={(value) => setCustomerData((prev) => ({ ...prev, ServiceQuality: value[0] }))}
                max={10}
                min={1}
                step={1}
                className="mt-2"
              />
            </div>

            {/* Categorical Selects */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Gender</Label>
                <Select
                  value={customerData.Gender}
                  onValueChange={(value) => setCustomerData((prev) => ({ ...prev, Gender: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Country</Label>
                <Select
                  value={customerData.Country}
                  onValueChange={(value) => setCustomerData((prev) => ({ ...prev, Country: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USA">USA</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="UK">UK</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="France">France</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Feedback Score</Label>
                <Select
                  value={customerData.FeedbackScore}
                  onValueChange={(value) => setCustomerData((prev) => ({ ...prev, FeedbackScore: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select feedback" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Loyalty Level</Label>
                <Select
                  value={customerData.LoyaltyLevel}
                  onValueChange={(value) => setCustomerData((prev) => ({ ...prev, LoyaltyLevel: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select loyalty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bronze">Bronze</SelectItem>
                    <SelectItem value="Silver">Silver</SelectItem>
                    <SelectItem value="Gold">Gold</SelectItem>
                    <SelectItem value="Platinum">Platinum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={handlePredict} disabled={!isFormValid || isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Predicting...
                </>
              ) : (
                "Predict Satisfaction"
              )}
            </Button>

            {error && <div className="text-red-600 text-sm">{error}</div>}
          </CardContent>
        </Card>

        {/* Results */}
        <div>
          <PredictionResult prediction={prediction} />
        </div>
      </div>
    </div>
  )
}
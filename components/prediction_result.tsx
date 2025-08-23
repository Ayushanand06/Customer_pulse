// File: components/prediction_result.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface PredictionResponse {
  predicted_score: number
  score_category: string
}

interface PredictionResultProps {
  prediction: PredictionResponse | null
}

export function PredictionResult({ prediction }: PredictionResultProps) {
  if (!prediction) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64 text-gray-500">
          Configure customer details and click Predict Satisfaction to see results
        </CardContent>
      </Card>
    )
  }

  const { predicted_score, score_category } = prediction
  const scorePercentage = (predicted_score / 100) * 100

  const getScoreColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "high": return "text-green-600";
      case "medium": return "text-yellow-600";
      case "low": return "text-red-600";
      default: return "text-gray-600";
    }
  }

  const getScoreIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "high": return <TrendingUp className="h-6 w-6" />;
      case "medium": return <Minus className="h-6 w-6" />;
      case "low": return <TrendingDown className="h-6 w-6" />;
      default: return <Minus className="h-6 w-6" />;
    }
  }

  const getAdvice = (score: number) => {
    if (score >= 80) return "Excellent! This customer is highly satisfied. Consider them for loyalty programs or referral incentives."
    if (score >= 60) return "Good satisfaction level. Monitor for improvement opportunities and gather specific feedback."
    return "At-risk customer. Consider proactive outreach and personalized support to improve their experience."
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prediction Results</CardTitle>
        <CardDescription>Customer satisfaction analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-gray-200" stroke="currentColor" strokeWidth="3" fill="transparent" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className={getScoreColor(score_category)} stroke="currentColor" strokeWidth="3" strokeDasharray={`${scorePercentage}, 100`} strokeLinecap="round" fill="transparent" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold">{predicted_score.toFixed(1)}</div>
                <div className="text-xs text-gray-500">/ 100</div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className={getScoreColor(score_category)}>{getScoreIcon(score_category)}</div>
            <Badge variant={score_category.toLowerCase() === "high" ? "default" : score_category.toLowerCase() === "medium" ? "secondary" : "destructive"}>
              {score_category} Satisfaction
            </Badge>
          </div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Recommended Action</h4>
          <p className="text-sm text-blue-800">{getAdvice(predicted_score)}</p>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div><div className="text-2xl font-bold text-red-600">0-59</div><div className="text-xs text-gray-500">At Risk</div></div>
          <div><div className="text-2xl font-bold text-yellow-600">60-79</div><div className="text-xs text-gray-500">Moderate</div></div>
          <div><div className="text-2xl font-bold text-green-600">80-100</div><div className="text-xs text-gray-500">High</div></div>
        </div>
      </CardContent>
    </Card>
  )
}
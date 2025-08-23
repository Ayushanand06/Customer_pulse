import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Target, Upload, TrendingUp } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Customer Pulse</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform customer data into actionable insights with our predictive analytics dashboard
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <CardTitle>Insights Dashboard</CardTitle>
              </div>
              <CardDescription>
                Explore historical data and understand key drivers of customer satisfaction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2 mb-4">
                <li>• Satisfaction score distribution</li>
                <li>• Key driver analysis</li>
                <li>• Segment comparison</li>
                <li>• Correlation explorer</li>
              </ul>
              <Link href="/insights">
                <Button className="w-full">Explore Data</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-green-600" />
                <CardTitle>Predictive Simulator</CardTitle>
              </div>
              <CardDescription>
                Predict satisfaction scores for individual customers with what-if analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2 mb-4">
                <li>• Interactive input form</li>
                <li>• Real-time predictions</li>
                <li>• Qualitative context</li>
                <li>• Actionable advice</li>
              </ul>
              <Link href="/predict">
                <Button className="w-full">Start Predicting</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Upload className="h-8 w-8 text-purple-600" />
                <CardTitle>Bulk Forecast</CardTitle>
              </div>
              <CardDescription>Upload CSV files to get predictions for multiple customers at once</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2 mb-4">
                <li>• CSV file upload</li>
                <li>• Batch processing</li>
                <li>• Results preview</li>
                <li>• Download augmented data</li>
              </ul>
              <Link href="/bulk">
                <Button className="w-full">Upload Data</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">95%</h3>
              <p className="text-gray-600">Prediction Accuracy</p>
            </div>
            <div>
              <Target className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">10K+</h3>
              <p className="text-gray-600">Customers Analyzed</p>
            </div>
            <div>
              <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">Real-time</h3>
              <p className="text-gray-600">Insights Generation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

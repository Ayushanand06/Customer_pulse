import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { Navigation } from "@/components/navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Customer Pulse - Predictive Analytics Dashboard",
  description: "Transform customer data into actionable insights",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        {children}
      </body>
    </html>
  )
}

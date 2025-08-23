"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface PlotViewerProps {
  plotType: string;
  segment?: string;
}

export function PlotViewer({ plotType, segment }: PlotViewerProps) {
  const [plotUrl, setPlotUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start in loading state
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (plotType) {
      setIsLoading(true);
      setError(null);
      const params = new URLSearchParams({ plot_name: plotType });
      if (segment && plotType === "segment_comparison") {
        params.append("feature", segment);
      }
      // The API route now returns an image directly, so we can use it as the src
      setPlotUrl(`/api/plots?${params.toString()}`);
    }
  }, [plotType, segment]);

  // Handle loading and error states for the image itself
  const handleImageLoad = () => setIsLoading(false);
  const handleImageError = () => {
    setIsLoading(false);
    setError("Failed to load visualization.");
  };

  // If no plot is selected, show the initial message
  if (!plotType) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Select an analysis type to view insights
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-[400px]">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      )}

      {error && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center text-red-600">
          {error}
        </div>
      )}

      {plotUrl && (
        <img
          key={plotUrl} // Use a key to force re-render when the URL changes
          src={plotUrl}
          alt={`${plotType} visualization`}
          className={`w-full h-auto rounded-lg border transition-opacity duration-300 ${isLoading || error ? 'opacity-0' : 'opacity-100'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
    </div>
  );
}
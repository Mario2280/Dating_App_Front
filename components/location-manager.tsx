"use client"

import { Button } from "@/components/ui/button"
import { MapPin, CheckCircle, AlertCircle, Settings } from "lucide-react"
import { useLocation } from "@/contexts/location-context"
import { useEffect } from "react"

interface LocationManagerProps {
  onLocationGranted?: () => void
  onLocationDenied?: () => void
  showAsCard?: boolean
  visible?: boolean // New prop to control visibility
  className?: string
}

export default function LocationManager({
  onLocationGranted,
  onLocationDenied,
  showAsCard = true,
  visible = true, // Default to visible
  className = "",
}: LocationManagerProps) {
  const { isAvailable, location, isLoading, error, requestLocation, openLocationSettings, hasLocationPermission } =
    useLocation()

  const handleLocationRequest = async () => {
    if (!hasLocationPermission) {
      // Open settings to let user grant permission
      openLocationSettings()
    } else {
      // Permission already granted, just request location
      await requestLocation()
      if (onLocationGranted) {
        onLocationGranted()
      }
    }
  }

  // Add this useEffect after the existing handleLocationRequest function
  useEffect(() => {
    if (hasLocationPermission && onLocationGranted) {
      onLocationGranted()
    } else if (!hasLocationPermission && onLocationDenied) {
      //onLocationDenied()
    }
  }, [hasLocationPermission, onLocationGranted, onLocationDenied])

  // If not visible, render nothing but still initialize the hook
  if (!visible) {
    return null
  }

  if (!isAvailable) {
    return (
      <div className={`${showAsCard ? "bg-white rounded-2xl p-4 border border-gray-200" : ""} ${className}`}>
        <div className="flex items-center gap-3 mb-3">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span className="font-medium text-gray-900">Геолокация недоступна</span>
        </div>
        <div className="text-sm text-red-600">Location manager недоступен в этой среде</div>
      </div>
    )
  }

  const containerClass = showAsCard ? `bg-white rounded-2xl p-4 border border-gray-200 ${className}` : className

  return (
    <div className={containerClass}>
      <div className="flex items-center gap-3 mb-3">
        <MapPin className="h-5 w-5 text-blue-500" />
        <span className="font-medium text-gray-900">Доступ к геолокации</span>
        {hasLocationPermission && <CheckCircle className="h-5 w-5 text-green-500" />}
        {error && <AlertCircle className="h-5 w-5 text-red-500" />}
      </div>

      {!hasLocationPermission && (
        <Button
          onClick={handleLocationRequest}
          disabled={isLoading}
          className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-xl flex items-center gap-2"
        >
          {isLoading ? (
            "Запрашиваем доступ..."
          ) : (
            <>
              <Settings className="h-4 w-4" />
              Разрешить доступ к геолокации
            </>
          )}
        </Button>
      )}

      {hasLocationPermission && location && <div className="text-sm text-green-600">✓ Геолокация получена</div>}

      {error && <div className="text-sm text-red-600 mt-2">⚠ {error}</div>}
    </div>
  )
}

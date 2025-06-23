"use client"

import { useState, useEffect, useCallback } from "react"
import { locationManager, init } from "@telegram-apps/sdk-react"
import type { LocationData, ProfileData } from "@/lib/types"
import { saveProfileData, getProfileData } from "@/lib/telegram-auth"

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        LocationManager?: {
          isAccessGranted: boolean
        }
      }
    }
  }
}

interface UseLocationManagerReturn {
  isAvailable: boolean
  location: LocationData | null
  isLoading: boolean
  error: string | null
  requestLocation: () => Promise<void>
  openLocationSettings: () => void
  hasLocationPermission: boolean
}

export function useLocationManager(): UseLocationManagerReturn {
  const [isAvailable, setLocationManagerAvailable] = useState(false)
  const [location, setLocation] = useState<LocationData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasLocationPermission, setHasLocationPermission] = useState(false)

  // Initialize Telegram SDK
  useEffect(() => {
    init()
  }, [])

  // Mount location manager and check permission status
  useEffect(() => {
    const mountLocationManager = async () => {
      try {
        if (locationManager.mount.isAvailable()) {
          await locationManager.mount()
          setLocationManagerAvailable(true)
          setError(null)

          // Set initial permission state using direct Telegram WebApp API
          const checkPermission = () => {
            if (window.Telegram?.WebApp?.LocationManager) {
              const isGranted = window.Telegram.WebApp.LocationManager.isAccessGranted
              setHasLocationPermission(isGranted)
              return isGranted
            }
            return false
          }

          // Initial check
          checkPermission()

          // Set up polling to check permission status periodically
          const permissionCheckInterval = setInterval(() => {
            checkPermission()
          }, 1000) // Check every second

          // Also check when the app becomes visible again
          const handleVisibilityChange = () => {
            if (!document.hidden) {
              setTimeout(checkPermission, 500) // Small delay to ensure state is updated
            }
          }

          document.addEventListener("visibilitychange", handleVisibilityChange)

          // Cleanup function
          return () => {
            clearInterval(permissionCheckInterval)
            document.removeEventListener("visibilitychange", handleVisibilityChange)
          }
        } else {
          setError("Location manager не доступен в этой среде")
        }
      } catch (err) {
        console.error("Error mounting location manager:", err)
        setError("Ошибка инициализации location manager")
        // Even if mount fails, we might still be able to use it
        setLocationManagerAvailable(true)
      }
    }

    const cleanup = mountLocationManager()

    // Return cleanup function
    return () => {
      if (cleanup && typeof cleanup.then === "function") {
        cleanup.then((cleanupFn) => {
          if (typeof cleanupFn === "function") {
            cleanupFn()
          }
        })
      }
    }
  }, [])

  const openLocationSettings = useCallback(() => {
    if (isAvailable && locationManager.openSettings.isAvailable()) {
      locationManager.openSettings()
    } else {
      setError("Настройки геолокации недоступны")
    }
  }, [isAvailable])

  const requestLocation = useCallback(async () => {
    if (!isAvailable) {
      setError("Location manager не инициализирован")
      return
    }
    if (!hasLocationPermission) {
      setError("Доступ к геолокации не предоставлен")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      let locationData = null
      if (locationManager.requestLocation.isAvailable()) {
        locationData = await locationManager.requestLocation()
      }

      if (locationData) {
        const formattedLocation: LocationData = {
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          accuracy: locationData.accuracy || 0,
        }

        setLocation(formattedLocation)

        // Save location to profile data
        const existingProfile = getProfileData()
        if (existingProfile) {
          const updatedProfile: ProfileData = {
            ...existingProfile,
            location: `${formattedLocation.latitude},${formattedLocation.longitude}`,
          }
          saveProfileData(updatedProfile)
        }

        console.log("Location received:", formattedLocation)
      } else {
        setError("Не удалось получить геолокацию")
      }
    } catch (err) {
      console.error("Error requesting location:", err)
      setError("Ошибка при запросе геолокации")
    } finally {
      setIsLoading(false)
    }
  }, [isAvailable, hasLocationPermission])

  return {
    isAvailable,
    location,
    isLoading,
    error,
    requestLocation,
    openLocationSettings,
    hasLocationPermission,
  }
}

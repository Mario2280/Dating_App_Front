"use client"

import { useState, useEffect, useCallback } from "react"
import { locationManager, init } from "@telegram-apps/sdk-react"
import type { LocationData, ProfileData } from "@/lib/types"
import { saveProfileData, getProfileData } from "@/lib/telegram-auth"

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
    //init()
  }, [])

  // Mount location manager
  useEffect(() => {
    const mountLocationManager = async () => {
      try {
        if (locationManager.mount.isAvailable()) {
          await locationManager.mount()
          setLocationManagerAvailable(true)
          setError(null)
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

    mountLocationManager()
  }, [])

  const openLocationSettings = useCallback(() => {
    if (isAvailable && locationManager.openSettings.isAvailable()) {
      locationManager.openSettings()
    } else {
      setError("Настройки геолокации недоступны")
    }
  }, [isAvailable])

  const requestLocation = useCallback(async () => {
    let locationData = null;
    if (!isAvailable) {
      setError("Location manager не инициализирован")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
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
        setHasLocationPermission(true)

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
        setHasLocationPermission(false)
      }
    } catch (err) {
      console.error("Error requesting location:", err)
      setError("Ошибка при запросе геолокации")
      setHasLocationPermission(false)
    } finally {
      setIsLoading(false)
    }
  }, [isAvailable])

  // Auto-request location when available (for existing users)
  //useEffect(() => {
  //  const autoRequestLocation = async () => {
  //    if (isAvailable && !location && !isLoading) {
  //      // Check if we already have location permission
  //      try {
  //        await requestLocation()
  //      } catch (err) {
  //        // If auto-request fails, user needs to manually grant permission
  //        console.log("Auto location request failed, manual permission needed")
  //      }
  //    }
  //  }

  //  // Small delay to ensure everything is properly initialized
  //  const timer = setTimeout(autoRequestLocation, 1000)
  //  return () => clearTimeout(timer)
  //}, [isAvailable, location, isLoading, requestLocation])

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

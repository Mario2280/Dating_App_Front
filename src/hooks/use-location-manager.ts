"use client"

import { useState, useEffect } from "react"
import { locationManager, init, postEvent, on, off } from "@telegram-apps/sdk-react"
import type { LocationData } from "@/lib/types"
import { saveProfileData, getProfileData } from "@/lib/telegram-auth"

if(import.meta.env.VITE_NODE_ENV !== 'dev'){
  init()
}
  

interface UseLocationManagerReturn {
  isMounted: boolean
  location: LocationData | null
  isLoading: boolean
  error: string | null
  requestLocation: () => Promise<void>
  openLocationSettings: () => void
  hasLocationPermission: boolean
}

export function useLocationManager(): UseLocationManagerReturn {
  const [isMounted, setLocationManagerAvailable] = useState(false)
  const [location, setLocation] = useState<LocationData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasLocationPermission, setHasLocationPermission] = useState(false)

  useEffect(() => {
    let unsubscribeMounted: (() => void) | null = null
    let permissionCheckInterval: NodeJS.Timeout | null = null

    const handleLocationChecked = (data: {
      available: boolean
      access_requested: boolean
      access_granted: boolean
    }) => {
      console.log('Location checked:', data)
      setHasLocationPermission(data.access_granted)
      if(data.access_granted){
        off('location_checked', handleLocationChecked)
        if (unsubscribeMounted) unsubscribeMounted()
        if (permissionCheckInterval) clearInterval(permissionCheckInterval)
        document.removeEventListener("visibilitychange", handleVisibilityChange)
        return
      }
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Проверяем разрешение при возвращении на вкладку
        postEvent('web_app_check_location')
      }
    }

    const mountManager = async () => {
      try {
        if (locationManager.isSupported() && !locationManager.isMounting()) {
          await locationManager.mount()
        }
      } catch (err) {
        console.error("Mount error:", err)
      }
    }

    const setupSubscriptions = () => {
      // Подписываемся на событие проверки локации
      on('location_checked', handleLocationChecked)
      // Подписываемся на изменение состояния монтирования
      unsubscribeMounted = locationManager.isMounted.sub((mounted) => {
        console.log('Mount status changed:', mounted)
        setLocationManagerAvailable(mounted)
        
        if (mounted) {
          // Первоначальная проверка разрешений
          postEvent('web_app_check_location')
          
          document.addEventListener("visibilitychange", handleVisibilityChange)

          // Периодическая проверка разрешений
          permissionCheckInterval = setInterval(() => {
            
            postEvent('web_app_check_location')
          }, 1000)
        }
      })
    }

    mountManager().then(setupSubscriptions)

    //return () => {
    //  off('location_checked', handleLocationChecked)
    //  if (unsubscribeMounted) unsubscribeMounted()
    //  if (permissionCheckInterval) clearInterval(permissionCheckInterval)
    //  document.removeEventListener("visibilitychange", handleVisibilityChange)
    //}
  }, [])

  const openLocationSettings = () => {
    if (isMounted) {
      locationManager.openSettings()
    } else {
      setError("Location manager не инициализирован")
    }
  }

  const requestLocation = async () => {
    if (!isMounted) {
      setError("Location manager не инициализирован")
      return
    }
    if(!hasLocationPermission) {
      setError("Доступ к геолокации не предоставлен")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Запрашиваем актуальное состояние разрешений
      postEvent('web_app_check_location')
      
      // Ждем немного для получения ответа
      await new Promise(resolve => setTimeout(resolve, 300))

      if (!hasLocationPermission) {
        setError("Доступ к геолокации не предоставлен")
        return
      }

      const locationData = await locationManager.requestLocation()
      
      if (locationData) {
        const formattedLocation: LocationData = {
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          accuracy: locationData.accuracy || 0,
        }

        setLocation(formattedLocation)

        // Сохраняем в профиль
        const existingProfile = getProfileData()
        if (existingProfile) {
          saveProfileData({
            ...existingProfile,
            location: `${formattedLocation.latitude},${formattedLocation.longitude}`,
          })
        }
      } else {
        setError("Не удалось получить геолокацию")
      }
    } catch (err) {
      console.error("Error requesting location:", err)
      setError("Ошибка при запросе геолокации")
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isMounted,
    location,
    isLoading,
    error,
    requestLocation,
    openLocationSettings,
    hasLocationPermission,
  }
}
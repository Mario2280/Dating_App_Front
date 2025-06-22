"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useLocationManager } from "@/hooks/use-location-manager"
import type { LocationData } from "@/lib/types"

interface LocationContextType {
  isAvailable: boolean
  location: LocationData | null
  isLoading: boolean
  error: string | null
  requestLocation: () => Promise<void>
  openLocationSettings: () => void
  hasLocationPermission: boolean
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

interface LocationProviderProps {
  children: ReactNode
}

export function LocationProvider({ children }: LocationProviderProps) {
  const locationManager = useLocationManager()

  return <LocationContext.Provider value={locationManager}>{children}</LocationContext.Provider>
}

export function useLocation() {
  const context = useContext(LocationContext)
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider")
  }
  return context
}

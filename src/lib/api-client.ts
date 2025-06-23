import { instance } from './api.interceptor'
import { HttpMethod } from './methods'
import { WalletInfo } from './types'
import { UrlConfig } from './url.config'

// Client-side API functions to replace Next.js API routes
const API_BASE_URL = "http://localhost:3001/"

export const apiClient = {
  async get(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },

  async post(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },

  async put(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },

  async delete(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },
}

// Wallet API functions
export const walletApi = {
  async getBalance(id: string) {
    return apiClient.get(`/wallet/balance/${id}`)
  },
  async connectWallet(walletData: WalletInfo): Promise<WalletInfo> {
    return instance({
      url: `${UrlConfig.WALLET}/connect`,
      method: HttpMethod.POST,
      data: walletData,
    }).then((response) => response.data)
  },

  async disconnectWallet(walletId: string): Promise<void> {
    return instance({
      url: `${UrlConfig.WALLET}/disconnect/${walletId}`,
      method: HttpMethod.DELETE,
    }).then((response) => response.data)
  },

  async getConnectedWallets(): Promise<WalletInfo[]> {
    return instance({
      url: `${UrlConfig.WALLET}/list`,
      method: HttpMethod.GET,
    }).then((response) => response.data)
  },

  async getWalletBalance(walletId: string): Promise<{ balance: string; currency: string }> {
    return instance({
      url: `${UrlConfig.WALLET}/balance/${walletId}`,
      method: HttpMethod.GET,
    }).then((response) => response.data)
  },
  async connect(walletData: any) {
    return apiClient.post("/wallet/connect", walletData)
  },

  async disconnect(id: string) {
    return apiClient.delete(`/wallet/disconnect/${id}`)
  },

  async list() {
    return apiClient.get("/wallet/list")
  },
}

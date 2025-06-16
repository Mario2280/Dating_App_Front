import { instance } from "./api.interceptor"
import { UrlConfig } from "./url.config"
import { HttpMethod } from "./methods"
import type { WalletInfo } from "@/components/ton-wallet-connector"

const WalletService = {
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
}

export default WalletService

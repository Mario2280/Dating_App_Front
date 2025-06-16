import { instance } from "./api.interceptor"
import { UrlConfig } from "./url.config"
import { HttpMethod } from "./methods"

export interface StripePaymentMethod {
  id: string
  type: "stripe"
  card_last4: string
  card_brand: string
  exp_month: number
  exp_year: number
}

export interface TonWalletConnection {
  id: string
  type: "ton"
  wallet_address: string
  wallet_name: string
}

export type PaymentMethod = StripePaymentMethod | TonWalletConnection

const PaymentService = {
  async connectStripeCard(cardData: {
    number: string
    exp_month: number
    exp_year: number
    cvc: string
  }): Promise<StripePaymentMethod> {
    return instance({
      url: `${UrlConfig.PAYMENT}/stripe/connect`,
      method: HttpMethod.POST,
      data: cardData,
    }).then((response) => response.data)
  },

  async connectTonWallet(walletData: {
    wallet_address: string
    signature: string
  }): Promise<TonWalletConnection> {
    return instance({
      url: `${UrlConfig.PAYMENT}/ton/connect`,
      method: HttpMethod.POST,
      data: walletData,
    }).then((response) => response.data)
  },

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    return instance({
      url: `${UrlConfig.PAYMENT}/methods`,
      method: HttpMethod.GET,
    }).then((response) => response.data)
  },
}

export default PaymentService

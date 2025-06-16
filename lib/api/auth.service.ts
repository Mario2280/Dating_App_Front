import { instance } from "./api.interceptor"
import { UrlConfig } from "./url.config"
import { HttpMethod } from "./methods"
import type { TelegramUser, ProfileData } from "../types"

export interface AuthResponse {
  isValid: boolean
  profile?: ProfileData
  needsRegistration?: boolean
}

const AuthService = {
  async validateTelegramAuth(telegramUser: TelegramUser): Promise<AuthResponse> {
    return instance({
      url: `${UrlConfig.AUTH}/validate`,
      method: HttpMethod.POST,
      data: telegramUser,
    }).then((response) => response.data)
  },

  async createProfile(profileData: ProfileData): Promise<ProfileData> {
    return instance({
      url: `${UrlConfig.PROFILE}/create`,
      method: HttpMethod.POST,
      data: profileData,
    }).then((response) => response.data)
  },

  async updateProfile(profileData: Partial<ProfileData>): Promise<ProfileData> {
    return instance({
      url: `${UrlConfig.PROFILE}/update`,
      method: HttpMethod.PUT,
      data: profileData,
    }).then((response) => response.data)
  },

  async getProfile(telegramId: number): Promise<ProfileData> {
    return instance({
      url: `${UrlConfig.PROFILE}/${telegramId}`,
      method: HttpMethod.GET,
    }).then((response) => response.data)
  },
}

export default AuthService

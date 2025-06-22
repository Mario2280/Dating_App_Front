export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  auth_date: number
  hash: string
}


export interface LocationData {
  latitude: number
  longitude: number
  accuracy: number
}
export interface ProfileData {
  telegram_id: number
  name: string
  age: number
  gender?: "MALE" | "FEMALE"
  bio?: string
  purpose?: "RELATIONSHIP" | "FRIENDSHIP" | "FLIRTING" | "DECIDEWHENMEET"
  weight?: number
  height?: number
  build?: "SLIM" | "ATHLETIC" | "AVERAGE" | "STOCKY" | "MUSCULAR" | "OVERWEIGHT"
  language?: "RUSSIAN" | "ENGLISH" | "SPANISH" | "FRENCH" | "GERMAN" | "CHINESE" | "JAPANESE" | "OTHER"
  orientation?: "HETEROSEXUAL" | "HOMOSEXUAL" | "BISEXUAL" | "PANSEXUAL" | "ASEXUAL" | "DEMISEXUAL"
  alcohol?: "NEVER" | "RARELY" | "OFTEN" | "QUIT"
  smoking?: "NEVER" | "SOMETIME" | "REGULARLY" | "QUIT"
  kids?: "NONE" | "HAVE" | "HAVE_AND_WANT_MORE" | "DONT_WANT" | "WANT"
  living_condition?: "WITH_PARENTS" | "RENT" | "OWN_HOUSE" | "OWN_APARTMENT" | "COMMUNAL" | "DORMITORY"
  income?: "BELOW_AVERAGE" | "AVERAGE" | "ABOVE_AVERAGE" | "HIGH" | "VERY_HIGH"
  education?:
    | "SECONDARY"
    | "SPECIALIZED_SECONDARY"
    | "INCOMPLETE_HIGHER"
    | "HIGHER"
    | "BACHELOR"
    | "MASTER"
    | "PHD"
    | "MBA"
  interests?: string[]
  location: LocationData | string
  photos?: string[]
  profile_photo?: string // Add this field for storing the main profile photo
  payment_methods?: string[]
  wallets?: WalletInfo[]
  isModerator?: boolean;
}

export interface WalletInfo {
  //id: string
  type: "ton" | "stripe"
  address?: string
  chain?: string
  name?: string
  connected_at: string
}

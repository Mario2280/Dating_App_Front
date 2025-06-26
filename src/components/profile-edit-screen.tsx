"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, Camera, Plus, ChevronDown, Check, Calendar, Wallet, Crown, User, X } from "lucide-react"
import BottomNavigation from "./bottom-navigation"
import ScrollingDatePickerModal from "./scrolling-date-picker"
import InstagramOAuthConnector from "./instagram-oauth-connector"
import { walletApi as WalletService } from "@/lib/api-client"
import type { WalletInfo } from "@/lib/types"
import WalletConnectionModal from "./wallet-connection-modal"
import PremiumPopup from "./premium-popup"
import { Img as Image } from 'react-image';
import type { Screen } from "@/App"
import { calculateAgeFromDate } from './profile-details-screen'
import AuthService, { type CompleteProfileData } from "@/lib/auth.service"
import { getProfileData, getTelegramUser, saveProfileData } from "@/lib/telegram-auth"
import { getPaymentType } from "@/lib/telegram-auth"
interface ProfileEditScreenProps {
  onBack: () => void
  onSave: () => void
  navigateToScreen: (screen: Screen) => void
}

// Database enum mappings
const genderOptions = {
  MALE: "Мужчина",
  FEMALE: "Женщина",
}

const purposeOptions = {
  RELATIONSHIP: "Серьезные отношения",
  FRIENDSHIP: "Дружба",
  FLIRTING: "Флирт",
  DECIDEWHENMEET: "Решу при встрече",
}

const educationOptions = {
  SECONDARY: "Среднее образование",
  SPECIALIZED_SECONDARY: "Среднее специальное",
  INCOMPLETE_HIGHER: "Неполное высшее",
  HIGHER: "Высшее образование",
  BACHELOR: "Бакалавр",
  MASTER: "Магистр",
  PHD: "Кандидат наук",
  MBA: "MBA",
}

const incomeOptions = {
  BELOW_AVERAGE: "Ниже среднего",
  AVERAGE: "Средний",
  ABOVE_AVERAGE: "Выше среднего",
  HIGH: "Высокий",
  VERY_HIGH: "Очень высокий",
}

const livingConditionsOptions = {
  WITH_PARENTS: "С родителями",
  RENT: "Снимаю жилье",
  OWN_HOUSE: "Собственный дом",
  OWN_APARTMENT: "Собственная квартира",
  COMMUNAL: "Коммунальная квартира",
  DORMITORY: "Общежитие",
}

const kidsOptions = {
  NONE: "Нет детей",
  HAVE: "Есть дети",
  HAVE_AND_WANT_MORE: "Есть и хочу еще",
  DONT_WANT: "Не хочу детей",
  WANT: "Хочу детей",
}

const smokingOptions = {
  NEVER: "Никогда",
  SOMETIMES: "Иногда",
  REGULARLY: "Регулярно",
  QUIT: "Бросил(а)",
}

const alcoholOptions = {
  NEVER: "Никогда",
  RARELY: "Редко",
  OFTEN: "Часто",
  QUIT: "Бросил(а)",
}

const orientationOptions = {
  HETEROSEXUAL: "Гетеросексуал",
  HOMOSEXUAL: "Гомосексуал",
  BISEXUAL: "Бисексуал",
  PANSEXUAL: "Пансексуал",
  ASEXUAL: "Асексуал",
  DEMISEXUAL: "Демисексуал",
}

const languageOptions = {
  RUSSIAN: "Русский",
  ENGLISH: "Английский",
  SPANISH: "Испанский",
  FRENCH: "Французский",
  GERMAN: "Немецкий",
  CHINESE: "Китайский",
  JAPANESE: "Японский",
  OTHER: "Другой",
}

const buildOptions = {
  SLIM: "Худощавое",
  ATHLETIC: "Спортивное",
  AVERAGE: "Среднее",
  STOCKY: "Плотное",
  MUSCULAR: "Мускулистое",
  OVERWEIGHT: "Полное",
}

const interests = [
  { id: "photo", label: "Фото" },
  { id: "shopping", label: "Покупки" },
  { id: "karaoke", label: "Караоке" },
  { id: "yoga", label: "Йога" },
  { id: "cooking", label: "Готовка" },
  { id: "tennis", label: "Теннис" },
  { id: "running", label: "Бег" },
  { id: "swimming", label: "Плавание" },
  { id: "art", label: "Искусство" },
  { id: "travel", label: "Поездки" },
  { id: "extreme", label: "Экстрим" },
  { id: "music", label: "Музыка" },
  { id: "drinks", label: "Выпивка" },
  { id: "games", label: "Видеоигры" },
]


export default function ProfileEditScreen({ onBack, onSave, navigateToScreen }: ProfileEditScreenProps) {
  const [currentProfile, setCurrentProfile] = useState<Partial<CompleteProfileData> | null>(null)
  const [photosToDelete, setPhotosToDelete] = useState<number[]>([])
  const [firstName, setFirstName] = useState("Анна")
  const [profileImage, setProfileImage] = useState()
  const [photos, setPhotos] = useState<(string | null)[]>([])
  const [birthDate, setBirthDate] = useState("")
  // Basic info
  const [age, setAge] = useState(19)
  const [selectedGender, setSelectedGender] = useState<keyof typeof genderOptions | "">("")
  const [location, setLocation] = useState("Минск, Беларусь")
  const tgData = getTelegramUser()
  // Profile details
  const [selectedPurpose, setSelectedPurpose] = useState<keyof typeof purposeOptions | "">("")
  const [selectedEducation, setSelectedEducation] = useState<keyof typeof educationOptions | "">("")
  const [weight, setWeight] = useState(55)
  const [height, setHeight] = useState(165)
  const [selectedBuild, setSelectedBuild] = useState<keyof typeof buildOptions | "">("")
  const [selectedLanguage, setSelectedLanguage] = useState<keyof typeof languageOptions | "">("")
  const [selectedOrientation, setSelectedOrientation] = useState<keyof typeof orientationOptions | "">("")
  const [selectedAlcohol, setSelectedAlcohol] = useState<keyof typeof alcoholOptions | "">("")
  const [selectedSmoking, setSelectedSmoking] = useState<keyof typeof smokingOptions | "">("")
  const [selectedKids, setSelectedKids] = useState<keyof typeof kidsOptions | "">("")
  const [selectedLivingCondition, setSelectedLivingCondition] = useState<keyof typeof livingConditionsOptions | "">("")
  const [selectedIncome, setSelectedIncome] = useState<keyof typeof incomeOptions | "">("")



  // Social media
  // Remove the Instagram URL state and input
  // const [instagramUrl, setInstagramUrl] = useState("instagram.com/anna_sankevich")

  // Add Instagram connection state
  const [instagramConnected, setInstagramConnected] = useState(false)
  const [instagramUrl, setInstagramUrl] = useState("")
  const [spotifyConnected, setSpotifyConnected] = useState(false)
  const [spotifyUrl, setSpotifyUrl] = useState("")
  const [bio, setBio] = useState("Привет! Я Аня. Мне нравится общаться с новыми людьми. Обожаю читать...")
  const [selectedInterests, setSelectedInterests] = useState({
    shopping: true,
    running: true,
    travel: true,
    music: true,
    art: false,
  })

  // Add notification state variables after other state declarations
  const [notificationSettings, setNotificationSettings] = useState({
    matches: true,
    messages: true,
    likes: true,
    superLikes: false,
    promotions: false,
    updates: true,
  })

  // Add visibility state
  const [profileVisible, setProfileVisible] = useState(true)
  const [isPremium, setIsPremium] = useState(false) // This should come from user's premium status
  const [showPremiumPopup, setShowPremiumPopup] = useState(false)

  // Wallet state
  const [connectedWallet, setConnectedWallet] = useState<WalletInfo | null>(null)
  const [isLoadingWallet, setIsLoadingWallet] = useState(true)
  const [walletConnected, setWalletConnected] = useState(getPaymentType() === "stripe")
  const [showWalletModal, setShowWalletModal] = useState(false)
  // Dropdown states

  // Photo selection modal
  const [showPhotoSelector, setShowPhotoSelector] = useState(false)
  const [selectedMainPhotoIndex, setSelectedMainPhotoIndex] = useState(0)
  const [dropdownStates, setDropdownStates] = useState({
    gender: false,
    purpose: false,
    education: false,
    build: false,
    language: false,
    orientation: false,
    alcohol: false,
    smoking: false,
    kids: false,
    livingCondition: false,
    income: false,
  })
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const profileImageRef = useRef<HTMLInputElement>(null)
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setIsLoadingWallet(true)
        const wallets = await WalletService.getConnectedWallets()
        if (wallets.length > 0) {
          setConnectedWallet(wallets[0])
        }
      } catch (error) {
        console.error("Failed to fetch wallet data:", error)
      } finally {
        setIsLoadingWallet(false)
      }
    }

    fetchWalletData()
  }, [])

  // Add useEffect to load user profile data
  useEffect(() => {
    const loadUserData = () => {
      const profile = getProfileData() as CompleteProfileData
      if (profile) {
        setCurrentProfile(profile)

        // Load basic info
        setFirstName(profile.name?.split(" ")[0] || "")
        setAge(profile.age || 18)
        setSelectedGender(profile.gender || "")
        setLocation((profile.location as string) || "")

        // Load profile photo
        if (profile.profile_photo) {
          setProfileImage(profile.profile_photo)
        }

        // Load gallery photos
        if (profile.photos && profile.photos.length > 0) {
          setPhotos(profile.photos)
        }

        // Load other profile details
        setSelectedPurpose(profile.purpose || "")
        setSelectedEducation(profile.education || "")
        setWeight(profile.weight || 55)
        setHeight(profile.height || 165)
        setSelectedBuild(profile.build || "")
        setSelectedLanguage(profile.language || "")
        setSelectedOrientation(profile.orientation || "")
        setSelectedAlcohol(profile.alcohol || "")
        setSelectedSmoking(profile.smoking || "")
        setSelectedKids(profile.kids || "")
        setSelectedLivingCondition(profile.living_condition || "")
        setSelectedIncome(profile.income || "")
        setBio(profile.bio || "")

        
        // Load social media
        if (profile.instagram_url) {
          setInstagramUrl(profile.instagram_url)
          setInstagramConnected(true)
        }
        if (profile.spotify_url) {
          setSpotifyUrl(profile.spotify_url)
          setSpotifyConnected(true)
        }
        // Load notification settings
        if (typeof profile.notification_settings === "object") {
          setNotificationSettings(profile.notification_settings)
        }
      }
    }

    loadUserData()
  }, [])

  const toggleDropdown = (dropdown: keyof typeof dropdownStates) => {
    setDropdownStates((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }))
  }

  const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageUpload = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newPhotos = [...photos]
        newPhotos[index] = e.target?.result as string
        setPhotos(newPhotos)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDeletePhoto = (index: number) => {
    const newPhotos = [...photos]

    // If this is a backend photo (has an ID), add to delete list
    if (currentProfile?.photos && currentProfile.photos[index]) {
      // Assuming photos have IDs - you might need to adjust this based on your backend structure
      setPhotosToDelete((prev) => [...prev, index]) // You'll need to store photo IDs properly
    }
    newPhotos.splice(index, 1)
    setPhotos(newPhotos)
  }

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleDateSelect = (date: string) => {
    setBirthDate(date)
    // Calculate and update age from birth date
    const calculatedAge = calculateAgeFromDate(date)
    setAge(calculatedAge)
  }

  const handleAgeChange = (newAge: number) => {
    const validAge = Math.max(newAge, 18)
    setAge(validAge)
    // Clear birth date when age is manually changed
    setBirthDate("")
  }
  

  const toggleNotification = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }))
  }
  const handleWalletConnection = () => {
    setWalletConnected(true)
    setShowWalletModal(false)
  }

  const handlePremiumFeature = (action: () => void) => {
    if (isPremium) {
      action()
    } else {
      setShowPremiumPopup(true)
    }
  }

  const handleInstagramConnect = () => {
    if (!instagramConnected) {
      setInstagramConnected(true)
    }
  }

  const handleInstagramDisconnect = () => {
    setInstagramConnected(false)
    setInstagramUrl("")
  }

  const handleSpotifyConnect = () => {
    if (!spotifyConnected) {
      setSpotifyConnected(true)
    }
  }

  const handleSpotifyDisconnect = () => {
    setSpotifyConnected(false)
    setSpotifyUrl("")
  }

  const handleVisibilityToggle = () => {
    handlePremiumFeature(() => {
      setProfileVisible(!profileVisible)
    })
  }
  const handleSave = async () => {
    setIsSaving(true)
    const profileData: Partial<CompleteProfileData> = {
      name: firstName,
      age,
      gender: selectedGender || undefined,
      location,
      profile_photo: profileImage !== "/placeholder.svg?height=128&width=128" ? profileImage : undefined,
      photos: photos.filter((photo) => photo !== null) as string[],
      purpose: selectedPurpose || undefined,
      education: selectedEducation || undefined,
      weight,
      height,
      build: selectedBuild || undefined,
      language: selectedLanguage || undefined,
      orientation: selectedOrientation || undefined,
      alcohol: selectedAlcohol || undefined,
      smoking: selectedSmoking || undefined,
      kids: selectedKids || undefined,
      living_condition: selectedLivingCondition || undefined,
      income: selectedIncome || undefined,
      bio,
      instagram_url: instagramConnected ? instagramUrl : undefined,
      spotify_url: spotifyConnected ? spotifyUrl : undefined,
      interests: Object.keys(selectedInterests).filter(
        (key) => selectedInterests[key as keyof typeof selectedInterests],
      ),
      notification_settings: notificationSettings,
    }
    try {
      

      console.log("Saving profile data:", profileData)
      console.log("Photos to delete:", photosToDelete)

      const updatedProfile = await AuthService.updateProfile(profileData, photosToDelete)

      // Update local storage
      saveProfileData(updatedProfile)
      setCurrentProfile(updatedProfile)

      console.log("Profile updated successfully:", updatedProfile)
      onSave()
    } catch (error) {
      saveProfileData(profileData)
      setCurrentProfile(profileData)
      //console.error("Failed to save profile:", error)
      //alert("Не удалось сохранить профиль. Попробуйте еще раз.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleMainPhotoSelect = (photoIndex: number) => {
    setSelectedMainPhotoIndex(photoIndex)
    // Set the selected photo as the main profile photo
    if (photos[photoIndex]) {
      setProfileImage(photos[photoIndex] as string)
    }
    setShowPhotoSelector(false)
  }

  const renderDropdown = <T extends string>(
    label: string,
    value: T,
    options: Record<T, string>,
    onChange: (value: T) => void,
    dropdownKey: keyof typeof dropdownStates,
  ) => (
    <div className="relative">
      <label className="text-sm text-gray-500 mb-2 block">{label}</label>
      <button
        onClick={() => toggleDropdown(dropdownKey)}
        className="w-full p-3 bg-white border border-gray-200 rounded-xl flex justify-between items-center"
      >
        <span className={value && value !== "" ? "text-gray-900" : "text-gray-500"}>
          {value && value !== "" ? options[value] : "Не выбрано"}
        </span>
        <ChevronDown
          className={`h-5 w-5 text-gray-400 transition-transform ${dropdownStates[dropdownKey] ? "rotate-180" : ""}`}
        />
      </button>

      {dropdownStates[dropdownKey] && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border z-10 max-h-48 overflow-y-auto">
          <button
            onClick={() => {
              onChange("" as T)
              toggleDropdown(dropdownKey)
            }}
            className="w-full p-3 text-left hover:bg-gray-50 first:rounded-t-xl text-gray-500"
          >
            Не выбрано
          </button>
          {Object.entries(options).map(([key, label]) => (
            <button
              key={key}
              onClick={() => {
                onChange(key as T)
                toggleDropdown(dropdownKey)
              }}
              className={`w-full p-3 text-left hover:bg-gray-50 last:rounded-b-xl ${
                value === key ? "bg-blue-50 text-blue-600" : ""
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="flex justify-between items-center p-4 sticky top-0 bg-white z-10 border-b">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-2xl">
          <ChevronLeft className="h-6 w-6 text-blue-500" />
        </Button>
        <h1 className="text-xl font-semibold dark:text-white">Редактировать профиль</h1>
        <Button
          onClick={handleSave}
          className="text-blue-500 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/20"
          disabled={isSaving}
        >
          {isSaving ? "Сохранение..." : "Сохранить"}
        </Button>
      </div>

      <div className="px-6 pt-6 pb-32 space-y-8 max-h-screen overflow-y-auto">
        {/* Profile Photo */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-3xl overflow-hidden bg-gray-100">
              <Image
                src={profileImage || tgData?.photo_url}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => setShowPhotoSelector(true)}
              className="absolute -bottom-2 -right-2 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center"
            >
              <Camera className="h-6 w-6 text-white" />
            </button>
            <input
              ref={profileImageRef}
              type="file"
              accept="image/*"
              onChange={handleProfileImageUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Основная информация</h2>

          <div>
            <label className="text-sm text-gray-500 mb-2 block">Имя</label>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="h-12 text-lg border-gray-200 rounded-xl"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500 mb-2 block">Возраст</label>
            <Input
              type="number"
              min="18"
              value={age}
              onChange={(e) => handleAgeChange(Number(e.target.value))}
              className="h-12 text-lg border-gray-200 rounded-xl"
            />
          </div>

          {renderDropdown("Пол", selectedGender, genderOptions, setSelectedGender, "gender")}

          <div>
            <label className="text-sm text-gray-500 mb-2 block">Дата рождения</label>
            <button
              onClick={() => setShowDatePicker(true)}
              className="w-full p-3 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center gap-3 text-lg font-medium"
            >
              <Calendar className="h-5 w-5" />
              {birthDate}
            </button>
          </div>

          <div>
            <label className="text-sm text-gray-500 mb-2 block">Местоположение</label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-12 text-lg border-gray-200 rounded-xl"
            />
          </div>
        </div>

        
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Фотографии</h2>
          <div className="grid grid-cols-3 gap-3">
            {/* Кнопка добавления всегда первая */}
            <div className="aspect-square rounded-xl overflow-hidden relative">
              <button
                onClick={() => fileInputRefs.current[photos.length]?.click()}
                className="w-full h-full border-2 border-dashed border-blue-300 flex items-center justify-center rounded-xl"
              >
                <Plus className="h-6 w-6 text-blue-500" />
              </button>
              <input
                ref={(el) => (fileInputRefs.current[photos.length] = el)}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(photos.length, e)}
                className="hidden"
              />
            </div>

            {/* Добавленные фотографии */}
            {photos.map((photo, index) => (
              <div key={index} className="aspect-square rounded-xl overflow-hidden relative">
                <Image
                  src={photo || "/placeholder.svg"}
                  alt={`Photo ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <button
                  onClick={() => handleDeletePhoto(index)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Profile Details */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Детали профиля</h2>

          {renderDropdown("Цель знакомства", selectedPurpose, purposeOptions, setSelectedPurpose, "purpose")}
          {renderDropdown("Образование", selectedEducation, educationOptions, setSelectedEducation, "education")}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500 mb-2 block">Вес (кг)</label>
              <Input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="h-12 text-lg border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-2 block">Рост (см)</label>
              <Input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="h-12 text-lg border-gray-200 rounded-xl"
              />
            </div>
          </div>

          {renderDropdown("Телосложение", selectedBuild, buildOptions, setSelectedBuild, "build")}
          {renderDropdown("Язык", selectedLanguage, languageOptions, setSelectedLanguage, "language")}
          {renderDropdown("Ориентация", selectedOrientation, orientationOptions, setSelectedOrientation, "orientation")}
          {renderDropdown("Алкаголь", selectedAlcohol, alcoholOptions, setSelectedAlcohol, "alcohol")}
          {renderDropdown("Курение", selectedSmoking, smokingOptions, setSelectedSmoking, "smoking")}
          {renderDropdown("Дети", selectedKids, kidsOptions, setSelectedKids, "kids")}
          {renderDropdown(
            "Жилищные условия",
            selectedLivingCondition,
            livingConditionsOptions,
            setSelectedLivingCondition,
            "livingCondition",
          )}
          {renderDropdown("Доход", selectedIncome, incomeOptions, setSelectedIncome, "income")}
        </div>

        {/* Social Media */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Социальные сети</h2>

          {/* Instagram Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <button
                onClick={handleInstagramConnect}
                className={`flex-1 p-4 rounded-2xl border-2 flex items-center gap-3 transition-colors ${
                  instagramConnected
                    ? "border-pink-500 bg-pink-500 text-white"
                    : "border-gray-200 bg-white text-gray-700"
                }`}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">IG</span>
                </div>
                <span className="text-lg font-medium flex-1 text-left">Instagram</span>
                {instagramConnected && <Check className="h-6 w-6" />}
              </button>
              {instagramConnected && (
                <Button
                  onClick={handleInstagramDisconnect}
                  variant="outline"
                  size="icon"
                  className="text-red-500 border-red-500 hover:bg-red-50 rounded-2xl"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
            {instagramConnected && (
              <Input
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://instagram.com/username"
                className="text-lg border-2 border-gray-200 rounded-2xl"
              />
            )}
          </div>

          {/* Spotify Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <button
                onClick={handleSpotifyConnect}
                className={`flex-1 p-4 rounded-2xl border-2 flex items-center gap-3 transition-colors ${
                  spotifyConnected
                    ? "border-green-500 bg-green-500 text-white"
                    : "border-gray-200 bg-white text-gray-700"
                }`}
              >
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">S</span>
                </div>
                <span className="text-lg font-medium flex-1 text-left">Spotify</span>
                {spotifyConnected && <Check className="h-6 w-6" />}
              </button>
              {spotifyConnected && (
                <Button
                  onClick={handleSpotifyDisconnect}
                  variant="outline"
                  size="icon"
                  className="text-red-500 border-red-500 hover:bg-red-50 rounded-2xl"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
            {spotifyConnected && (
              <Input
                value={spotifyUrl}
                onChange={(e) => setSpotifyUrl(e.target.value)}
                placeholder="https://open.spotify.com/user/username"
                className="text-lg border-2 border-gray-200 rounded-2xl"
              />
            )}
          </div>
        </div>

        {/* About */}
        <div>
          <label className="text-sm text-gray-500 mb-2 block">О себе</label>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Расскажите о себе"
            className="min-h-[100px] text-gray-600 border-gray-200 rounded-xl resize-none"
          />
        </div>

        {/* Interests */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Интересы</h2>
          <div className="grid grid-cols-2 gap-3">
            {interests.map((interest) => (
              <button
                key={interest.id}
                onClick={() => toggleInterest(interest.id)}
                className={`p-3 rounded-xl border transition-colors ${
                  selectedInterests[interest.id]
                    ? "border-blue-500 bg-blue-500 text-white"
                    : "border-gray-200 bg-white text-gray-700"
                }`}
              >
                <span className="font-medium">{interest.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Wallet Connection */}
        <div className="space-y-4" data-wallet-section>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Кошелек</h2>
            <Button
              variant="ghost"
              className="text-blue-500 text-sm p-0 h-auto"
              onClick={() => navigateToScreen("wallet-settings")}
            >
              Подробнее
            </Button>
          </div>
          {isLoadingWallet ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <Button
              onClick={() => setShowWalletModal(true)}
              variant="outline"
              className={`w-full h-14 text-lg font-medium rounded-2xl flex items-center gap-3 ${
                walletConnected ? "border-green-500 text-green-600 bg-green-50" : "border-blue-500 text-blue-500"
              }`}
              data-wallet-button
            >
              <Wallet className="h-5 w-5" />
              {walletConnected ? "Кошелек подключен" : "Привязать кошелек"}
              {walletConnected && <span className="text-green-500">✓</span>}
            </Button>

            //<TonWalletConnector
            //  variant="compact"
            //  isConnected={!!connectedWallet}
            //  connectedWallet={connectedWallet}
            //  onSuccess={(wallet) => {
            //    setConnectedWallet(wallet)
            //  }}
            //  onError={(error) => {
            //    console.error("Wallet connection error:", error)
            //  }}
            //  onDisconnect={() => {
            //    setConnectedWallet(null)
            //  }}
            ///>
          )}
          <WalletConnectionModal
            isOpen={showWalletModal}
            onClose={() => setShowWalletModal(false)}
            onSuccess={handleWalletConnection}
          />
        </div>

        {/* Notification Settings */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Уведомления</h2>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <div>
                <div className="font-medium">Новые совпадения</div>
                <div className="text-sm text-gray-500">Уведомления о новых мэтчах</div>
              </div>
              <button
                onClick={() => toggleNotification("matches")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notificationSettings.matches ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notificationSettings.matches ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <div>
                <div className="font-medium">Сообщения</div>
                <div className="text-sm text-gray-500">Уведомления о новых сообщениях</div>
              </div>
              <button
                onClick={() => toggleNotification("messages")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notificationSettings.messages ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notificationSettings.messages ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <div>
                <div className="font-medium">Лайки</div>
                <div className="text-sm text-gray-500">Уведомления о новых лайках</div>
              </div>
              <button
                onClick={() => toggleNotification("likes")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notificationSettings.likes ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notificationSettings.likes ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <div>
                <div className="font-medium">Супер лайки</div>
                <div className="text-sm text-gray-500">Уведомления о супер лайках</div>
              </div>
              <button
                onClick={() => toggleNotification("superLikes")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notificationSettings.superLikes ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notificationSettings.superLikes ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <div>
                <div className="font-medium">Акции и предложения</div>
                <div className="text-sm text-gray-500">Уведомления о скидках и промо</div>
              </div>
              <button
                onClick={() => toggleNotification("promotions")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notificationSettings.promotions ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notificationSettings.promotions ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <div>
                <div className="font-medium">Обновления приложения</div>
                <div className="text-sm text-gray-500">Уведомления о новых функциях</div>
              </div>
              <button
                onClick={() => toggleNotification("updates")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notificationSettings.updates ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notificationSettings.updates ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              {currentProfile?.chat_id ? (
                <button
                  onClick={() => window.open("https://t.me/SomeDatingBot?start=unnotify", "_blank")}
                  className="w-full text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center hover:text-red-500 transition-colors p-3 bg-red-50 dark:bg-red-900/20 rounded-xl"
                >
                  Отключить уведомления
                </button>
              ) : (
              <button
                onClick={() => window.open("https://t.me/SomeDatingBot?start=notify", "_blank")}
                className="w-full text-lg font-semibold text-gray-900 mb-2 text-center hover:text-blue-500 transition-colors p-3 bg-blue-50 rounded-xl"
              >
                Открыть чат с ботом
              </button>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                {currentProfile?.chat_id
                  ? "Уведомления настроены. Нажмите, чтобы отключить."
                  : "Отправьте боту команду /notify, чтобы получать уведомления в Telegram"}
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Настройки приватности</h2>

          <div className="space-y-3">
            <div
              className={`flex justify-between items-center p-3 bg-gray-50 rounded-xl ${!isPremium ? "opacity-60" : ""}`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="font-medium">Видимость профиля</div>
                  {!isPremium && <Crown className="h-4 w-4 text-yellow-500" />}
                </div>
                <div className="text-sm text-gray-500">
                  {profileVisible
                    ? "Ваш профиль виден другим пользователям"
                    : "Ваш профиль скрыт от других пользователей"}
                </div>
              </div>
              <button
                onClick={() => (!isPremium ? setShowPremiumPopup(true) : setProfileVisible(!profileVisible))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  profileVisible && isPremium ? "bg-blue-500" : "bg-gray-300"
                } ${!isPremium ? "cursor-not-allowed" : ""}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    profileVisible && isPremium ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Date Picker Modal */}
      <ScrollingDatePickerModal
        isOpen={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onSelect={handleDateSelect}
        initialDate={birthDate}
      />
{/* Photo Selector Modal */}
  {showPhotoSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold dark:text-white">Выберите главное фото</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowPhotoSelector(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {photos.map(
                (photo, index) =>
                  photo && (
                    <button
                      key={index}
                      onClick={() => handleMainPhotoSelect(index)}
                      className={`aspect-square rounded-xl overflow-hidden relative border-2 ${
                        selectedMainPhotoIndex === index ? "border-blue-500" : "border-transparent"
                      }`}
                    >
                      <Image
                        src={photo || "/placeholder.svg"}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {selectedMainPhotoIndex === index && (
                        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                          <Check className="h-6 w-6 text-blue-500" />
                        </div>
                      )}
                    </button>
                  ),
              )}
            </div>
          </div>
        </div>
      )}
      {/* Premium Popup */}
      <PremiumPopup
        isOpen={showPremiumPopup}
        onClose={() => setShowPremiumPopup(false)}
        feature="Управление видимостью профиля"
        description="Скрывайте свой профиль от других пользователей и контролируйте, кто может вас найти"
        onUpgrade={() => {
          setShowPremiumPopup(false)
          navigateToScreen("premium")
        }}
      />

      {/* Bottom Navigation */}
      <BottomNavigation currentScreen="profile-edit" onNavigate={navigateToScreen} isOpen={showWalletModal} />
    </div>
  )
}

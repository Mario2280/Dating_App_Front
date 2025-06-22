"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, Crown } from "lucide-react"
import PremiumPopup from "./premium-popup"
import type { Screen } from "@/app/page"
interface FiltersScreenProps {
  onBack: () => void
  navigateToScreen: (screen: Screen) => void
}

// Database enum mappings
const genderOptions = {
  MALE: "Мужчины",
  FEMALE: "Женщины",
  ALL: "Все",
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

const buildOptions = {
  SLIM: "Худощавое",
  ATHLETIC: "Спортивное",
  AVERAGE: "Среднее",
  STOCKY: "Плотное",
  MUSCULAR: "Мускулистое",
  OVERWEIGHT: "Полное",
}

const orientationOptions = {
  HETEROSEXUAL: "Гетеросексуал",
  HOMOSEXUAL: "Гомосексуал",
  BISEXUAL: "Бисексуал",
  PANSEXUAL: "Пансексуал",
  ASEXUAL: "Асексуал",
  DEMISEXUAL: "Демисексуал",
}

const alcoholOptions = {
  NEVER: "Никогда",
  RARELY: "Редко",
  OFTEN: "Часто",
  QUIT: "Бросил(а)",
}

const smokingOptions = {
  NEVER: "Никогда",
  SOMETIMES: "Иногда",
  REGULARLY: "Регулярно",
  QUIT: "Бросил(а)",
}

const kidsOptions = {
  NONE: "Нет детей",
  HAVE: "Есть дети",
  HAVE_AND_WANT_MORE: "Есть и хочу еще",
  DONT_WANT: "Не хочу детей",
  WANT: "Хочу детей",
}

const languageOptions = {
  BELARUSIAN: "Белорусский",
  RUSSIAN: "Русский",
  ENGLISH: "Английский",
  POLISH: "Польский",
  UKRAINIAN: "Украинский",
  GERMAN: "Немецкий",
  FRENCH: "Французский",
  SPANISH: "Испанский",
}

const livingConditionsOptions = {
  WITH_PARENTS: "С родителями",
  ALONE: "Один/одна",
  WITH_ROOMMATES: "С соседями",
  WITH_PARTNER: "С партнером",
  OWN_APARTMENT: "Своя квартира",
  RENT_APARTMENT: "Съемная квартира",
}

const incomeOptions = {
  VERY_LOW: "Очень низкий",
  LOW: "Низкий",
  BELOW_AVERAGE: "Ниже среднего",
  AVERAGE: "Средний",
  ABOVE_AVERAGE: "Выше среднего",
  HIGH: "Высокий",
  VERY_HIGH: "Очень высокий",
}

const lastActiveOptions = {
  1: "За последний месяц",
  3: "За последние 3 месяца",
  6: "За последние 6 месяцев",
  12: "За последний год",
}

const regions = [
  "Минск, Беларусь",
  "Гомель, Беларусь",
  "Могилев, Беларусь",
  "Витебск, Беларусь",
  "Гродно, Беларусь",
  "Брест, Беларусь",
]

export default function FiltersScreen({ onBack, navigateToScreen }: FiltersScreenProps) {
  const [selectedGender, setSelectedGender] = useState("FEMALE")
  const [distance, setDistance] = useState(40)
  const [ageRange, setAgeRange] = useState([18, 24])
  const [heightRange, setHeightRange] = useState([150, 180])
  const [selectedRegion, setSelectedRegion] = useState("Минск, Беларусь")
  const [selectedPurpose, setSelectedPurpose] = useState("")
  const [selectedEducation, setSelectedEducation] = useState("")
  const [selectedBuild, setSelectedBuild] = useState("")
  const [selectedOrientation, setSelectedOrientation] = useState("")
  const [selectedAlcohol, setSelectedAlcohol] = useState("")
  const [selectedSmoking, setSelectedSmoking] = useState("")
  const [selectedKids, setSelectedKids] = useState("")
  const [showPremiumPopup, setShowPremiumPopup] = useState(false)
  const [hasWallet] = useState(false)
  const [isPremium, setIsPremium] = useState(false) // This should come from user's premium status

  const [weightRange, setWeightRange] = useState([50, 80])
  const [selectedLanguage, setSelectedLanguage] = useState("")
  const [selectedLivingCondition, setSelectedLivingCondition] = useState("")
  const [selectedIncome, setSelectedIncome] = useState("")
  const [selectedLastActive, setSelectedLastActive] = useState("")
  const [isVisible, setIsVisible] = useState(true)

  const [dropdownStates, setDropdownStates] = useState({
    region: false,
    purpose: false,
    education: false,
    build: false,
    orientation: false,
    alcohol: false,
    smoking: false,
    kids: false,
    language: false,
    livingCondition: false,
    income: false,
    lastActive: false,
  })

  const toggleDropdown = (dropdown: keyof typeof dropdownStates) => {
    setDropdownStates((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }))
  }

  const handleDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDistance(Number(e.target.value))
  }

  const handleAgeRangeChange = (index: number, value: number) => {
    const newRange = [...ageRange]
    newRange[index] = value
    if (index === 0 && value > ageRange[1]) {
      newRange[1] = value
    }
    if (index === 1 && value < ageRange[0]) {
      newRange[0] = value
    }
    setAgeRange(newRange)
  }

  const handleHeightRangeChange = (index: number, value: number) => {
    const newRange = [...heightRange]
    newRange[index] = value
    if (index === 0 && value > heightRange[1]) {
      newRange[1] = value
    }
    if (index === 1 && value < heightRange[0]) {
      newRange[0] = value
    }
    setHeightRange(newRange)
  }

  const handleWeightRangeChange = (index: number, value: number) => {
    const newRange = [...weightRange]
    newRange[index] = value
    if (index === 0 && value > weightRange[1]) {
      newRange[1] = value
    }
    if (index === 1 && value < weightRange[0]) {
      newRange[0] = value
    }
    setWeightRange(newRange)
  }

  const handleBuyPremium = () => {
    window.open("https://payment.example.com/premium", "_blank")
    setShowPremiumPopup(false)
  }

  const handleBuyIndividual = () => {
    window.open("https://payment.example.com/individual", "_blank")
    setShowPremiumPopup(false)
  }

  const handleConnectWallet = () => {
    setShowPremiumPopup(false)
  }

  const renderDropdown = <T extends string>(
    label: string,
    value: T,
    options: Record<T, string>,
    onChange: (value: T) => void,
    dropdownKey: keyof typeof dropdownStates,
    isPremiumFeature = false,
  ) => (
    <div className={`relative ${isPremiumFeature && !isPremium ? "opacity-60" : ""}`}>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm text-gray-500">{label}</label>
        {isPremiumFeature && !isPremium && <Crown className="h-4 w-4 text-yellow-500" />}
      </div>
      <button
        onClick={() => (isPremiumFeature && !isPremium ? setShowPremiumPopup(true) : toggleDropdown(dropdownKey))}
        className={`w-full p-3 bg-gray-100 rounded-2xl flex justify-between items-center ${
          isPremiumFeature && !isPremium ? "cursor-pointer" : ""
        }`}
      >
        <span className="text-lg">{value ? options[value] : "Не выбрано"}</span>
        <ChevronDown
          className={`h-5 w-5 text-gray-400 transition-transform ${
            dropdownStates[dropdownKey] && !(isPremiumFeature && !isPremium) ? "rotate-180" : ""
          }`}
        />
      </button>

      {dropdownStates[dropdownKey] && !(isPremiumFeature && !isPremium) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border z-10 max-h-48 overflow-y-auto">
          <button
            onClick={() => {
              onChange("" as T)
              toggleDropdown(dropdownKey)
            }}
            className="w-full p-4 text-left hover:bg-gray-50 first:rounded-t-2xl"
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
              className={`w-full p-4 text-left hover:bg-gray-50 last:rounded-b-2xl ${
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
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white rounded-t-3xl p-6 min-h-screen">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Фильтры</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowPremiumPopup(true)}
            className="rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600"
          >
            <Crown className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-8 pb-32">
          {/* Gender Selection */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Я ищу</h2>
            <div className="flex rounded-2xl bg-gray-100 p-1">
              {Object.entries(genderOptions).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedGender(key)}
                  className={`flex-1 py-3 px-6 rounded-xl font-medium transition-colors ${
                    selectedGender === key ? "bg-blue-500 text-white" : "text-gray-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Region */}
          <div className="relative">
            <label className="text-sm text-gray-500 mb-2 block">Регион</label>
            <button
              onClick={() => toggleDropdown("region")}
              className="w-full p-4 bg-gray-100 rounded-2xl flex justify-between items-center"
            >
              <span className="text-lg">{selectedRegion}</span>
              <ChevronDown
                className={`h-5 w-5 text-gray-400 transition-transform ${dropdownStates.region ? "rotate-180" : ""}`}
              />
            </button>

            {dropdownStates.region && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border z-10 max-h-48 overflow-y-auto">
                {regions.map((region) => (
                  <button
                    key={region}
                    onClick={() => {
                      setSelectedRegion(region)
                      toggleDropdown("region")
                    }}
                    className={`w-full p-4 text-left hover:bg-gray-50 first:rounded-t-2xl last:rounded-b-2xl ${
                      selectedRegion === region ? "bg-blue-50 text-blue-600" : ""
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Distance */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Дистанция</h2>
              <span className="text-gray-500">{distance}км</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="1"
                max="100"
                value={distance}
                onChange={handleDistanceChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${distance}%, #e5e7eb ${distance}%, #e5e7eb 100%)`,
                }}
              />
            </div>
          </div>

          {/* Age Range */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Возраст</h2>
              <span className="text-gray-500">
                {ageRange[0]}-{ageRange[1]}
              </span>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Минимальный возраст: {ageRange[0]}</label>
                <input
                  type="range"
                  min="18"
                  max="65"
                  value={ageRange[0]}
                  onChange={(e) => handleAgeRangeChange(0, Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Максимальный возраст: {ageRange[1]}</label>
                <input
                  type="range"
                  min="18"
                  max="65"
                  value={ageRange[1]}
                  onChange={(e) => handleAgeRangeChange(1, Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Basic Filters */}
          {renderDropdown("Цель знакомства", selectedPurpose, purposeOptions, setSelectedPurpose, "purpose")}

          {/* Premium Filters */}
          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Премиум фильтры</h2>
              <Crown className="h-5 w-5 text-yellow-500" />
            </div>

            {/* Height Range - Premium */}
            <div className={`mb-6 ${!isPremium ? "opacity-60" : ""}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Рост</h2>
                <div className="flex items-center gap-2">
                  {!isPremium && <Crown className="h-4 w-4 text-yellow-500" />}
                  <span className="text-gray-500">
                    {heightRange[0]}-{heightRange[1]} см
                  </span>
                </div>
              </div>
              <div
                className={`space-y-4 ${!isPremium ? "cursor-pointer" : ""}`}
                onClick={() => !isPremium && setShowPremiumPopup(true)}
              >
                <input
                  type="range"
                  min="140"
                  max="200"
                  value={heightRange[0]}
                  onChange={(e) => isPremium && handleHeightRangeChange(0, Number(e.target.value))}
                  readOnly={!isPremium}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="range"
                  min="140"
                  max="200"
                  value={heightRange[1]}
                  onChange={(e) => isPremium && handleHeightRangeChange(1, Number(e.target.value))}
                  readOnly={!isPremium}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Weight Range - Premium */}
            <div className={`mb-6 ${!isPremium ? "opacity-60" : ""}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Вес</h2>
                <div className="flex items-center gap-2">
                  {!isPremium && <Crown className="h-4 w-4 text-yellow-500" />}
                  <span className="text-gray-500">
                    {weightRange[0]}-{weightRange[1]} кг
                  </span>
                </div>
              </div>
              <div
                className={`space-y-4 ${!isPremium ? "cursor-pointer" : ""}`}
                onClick={() => !isPremium && setShowPremiumPopup(true)}
              >
                <input
                  type="range"
                  min="40"
                  max="200"
                  value={weightRange[0]}
                  onChange={(e) => isPremium && handleWeightRangeChange(0, Number(e.target.value))}
                  readOnly={!isPremium}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="range"
                  min="40"
                  max="200"
                  value={weightRange[1]}
                  onChange={(e) => isPremium && handleWeightRangeChange(1, Number(e.target.value))}
                  readOnly={!isPremium}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {renderDropdown(
              "Образование",
              selectedEducation,
              educationOptions,
              setSelectedEducation,
              "education",
            )}
            {renderDropdown("Телосложение", selectedBuild, buildOptions, setSelectedBuild, "build", true)}
            {renderDropdown(
              "Ориентация",
              selectedOrientation,
              orientationOptions,
              setSelectedOrientation,
              "orientation",
              true,
            )}
            {renderDropdown("Алкоголь", selectedAlcohol, alcoholOptions, setSelectedAlcohol, "alcohol", true)}
            {renderDropdown("Курение", selectedSmoking, smokingOptions, setSelectedSmoking, "smoking", true)}
            {renderDropdown("Дети", selectedKids, kidsOptions, setSelectedKids, "kids", true)}
            {renderDropdown("Язык", selectedLanguage, languageOptions, setSelectedLanguage, "language", true)}
            {renderDropdown(
              "Жилищные условия",
              selectedLivingCondition,
              livingConditionsOptions,
              setSelectedLivingCondition,
              "livingCondition",
              true,
            )}
            {renderDropdown("Доход", selectedIncome, incomeOptions, setSelectedIncome, "income", true)}
            {renderDropdown(
              "Последняя активность",
              selectedLastActive,
              lastActiveOptions,
              setSelectedLastActive,
              "lastActive",
              true,
            )}

            {/* Visibility Toggle - Premium */}
            <div className={!isPremium ? "opacity-60" : ""}>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-gray-500">Видимость профиля</label>
                {!isPremium && <Crown className="h-4 w-4 text-yellow-500" />}
              </div>
              <button
                onClick={() => (!isPremium ? setShowPremiumPopup(true) : setIsVisible(!isVisible))}
                className="w-full p-3 bg-gray-100 rounded-2xl flex justify-between items-center cursor-pointer"
              >
                <span className="text-lg">{isVisible ? "Виден всем" : "Скрыт"}</span>
                <div
                  className={`w-12 h-6 rounded-full ${isVisible && isPremium ? "bg-blue-500" : "bg-gray-300"} relative transition-colors`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${isVisible && isPremium ? "translate-x-6" : "translate-x-0.5"}`}
                  />
                </div>
              </button>
            </div>
          </div>

          <div className="fixed bottom-8 left-6 right-6">
            <Button
              onClick={onBack}
              className="w-full h-14 bg-blue-500 hover:bg-blue-600 text-white text-lg font-medium rounded-2xl"
            >
              Применить фильтры
            </Button>
          </div>
        </div>
      </div>

      {/* Premium Popup */}
      <PremiumPopup
        isOpen={showPremiumPopup}
        onClose={() => setShowPremiumPopup(false)}
        type="likes"
        hasWallet={hasWallet}
        onBuyPremium={handleBuyPremium}
        onBuyIndividual={handleBuyIndividual}
        onConnectWallet={handleConnectWallet}
        navigateToScreen={navigateToScreen}
      />

      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        input[type="range"]:disabled::-webkit-slider-thumb {
          background: #9ca3af;
          cursor: not-allowed;
        }

        input[type="range"]:disabled::-moz-range-thumb {
          background: #9ca3af;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  )
}

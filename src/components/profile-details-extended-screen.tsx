"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronDown } from "lucide-react"
import type { ProfileData } from "@/lib/types"

interface ProfileDetailsExtendedScreenProps {
  onNext: () => void
  onBack: () => void
  onUpdate: (updates: Partial<ProfileData>) => void
  currentUser: ProfileData | null
}

// Database enum mappings
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
  EMPTY: "",
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
  SOMETIME: "Иногда",
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

const livingConditionOptions = {
  WITH_PARENTS: "С родителями",
  RENT: "Снимаю жилье",
  OWN_HOUSE: "Собственный дом",
  OWN_APARTMENT: "Собственная квартира",
  COMMUNAL: "Коммунальная квартира",
  DORMITORY: "Общежитие",
}

const incomeOptions = {
  BELOW_AVERAGE: "Ниже среднего",
  AVERAGE: "Средний",
  ABOVE_AVERAGE: "Выше среднего",
  HIGH: "Высокий",
  VERY_HIGH: "Очень высокий",
}

export default function ProfileDetailsExtendedScreen({
  onNext,
  onBack,
  onUpdate,
  currentUser,
}: ProfileDetailsExtendedScreenProps) {
  const [selectedPurpose, setSelectedPurpose] = useState<keyof typeof purposeOptions | "">("")
  const [selectedEducation, setSelectedEducation] = useState<keyof typeof educationOptions | "">("")
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [selectedBuild, setSelectedBuild] = useState<keyof typeof buildOptions | "">("")
  const [selectedLanguage, setSelectedLanguage] = useState<keyof typeof languageOptions | "">("")
  const [selectedOrientation, setSelectedOrientation] = useState<keyof typeof orientationOptions | "">("")
  const [selectedAlcohol, setSelectedAlcohol] = useState<keyof typeof alcoholOptions | "">("")
  const [selectedSmoking, setSelectedSmoking] = useState<keyof typeof smokingOptions | "">("")
  const [selectedKids, setSelectedKids] = useState<keyof typeof kidsOptions | "">("")
  const [selectedLivingCondition, setSelectedLivingCondition] = useState<keyof typeof livingConditionOptions | "">("")
  const [selectedIncome, setSelectedIncome] = useState<keyof typeof incomeOptions | "">("")

  const [dropdownStates, setDropdownStates] = useState({
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

  // Load existing data from currentUser
  useEffect(() => {
    if (currentUser) {
      console.log("Loading extended profile data from currentUser:", currentUser) // Debug log

      if (currentUser.purpose) setSelectedPurpose(currentUser.purpose)
      if (currentUser.education) setSelectedEducation(currentUser.education)
      if (currentUser.weight) setWeight(currentUser.weight.toString())
      if (currentUser.height) setHeight(currentUser.height.toString())
      if (currentUser.build) setSelectedBuild(currentUser.build)
      if (currentUser.language) setSelectedLanguage(currentUser.language)
      if (currentUser.orientation) setSelectedOrientation(currentUser.orientation)
      if (currentUser.alcohol) setSelectedAlcohol(currentUser.alcohol)
      if (currentUser.smoking) setSelectedSmoking(currentUser.smoking)
      if (currentUser.kids) setSelectedKids(currentUser.kids)
      if (currentUser.living_condition) setSelectedLivingCondition(currentUser.living_condition)
      if (currentUser.income) setSelectedIncome(currentUser.income)
    }
  }, [currentUser])

  const toggleDropdown = (dropdown: keyof typeof dropdownStates) => {
    setDropdownStates((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }))
  }

  const handleNext = () => {
    const updates: Partial<ProfileData> = {}

    if (selectedPurpose && selectedPurpose !== "") updates.purpose = selectedPurpose
    if (selectedEducation && selectedEducation !== "") updates.education = selectedEducation
    if (weight && weight !== "") updates.weight = Number.parseInt(weight)
    if (height && height !== "") updates.height = Number.parseInt(height)
    if (selectedBuild && selectedBuild !== "") updates.build = selectedBuild
    if (selectedLanguage && selectedLanguage !== "") updates.language = selectedLanguage
    if (selectedOrientation && selectedOrientation !== "") updates.orientation = selectedOrientation
    if (selectedAlcohol && selectedAlcohol !== "") updates.alcohol = selectedAlcohol
    if (selectedSmoking && selectedSmoking !== "") updates.smoking = selectedSmoking
    if (selectedKids && selectedKids !== "") updates.kids = selectedKids
    if (selectedLivingCondition && selectedLivingCondition !== "") updates.living_condition = selectedLivingCondition
    if (selectedIncome && selectedIncome !== "") updates.income = selectedIncome

    console.log("Saving extended profile data:", updates)
    onUpdate(updates)
    onNext()
  }

  const handleBack = () => {
    const updates: Partial<ProfileData> = {}

    if (selectedPurpose && selectedPurpose !== "") updates.purpose = selectedPurpose
    if (selectedEducation && selectedEducation !== "") updates.education = selectedEducation
    if (weight && weight !== "") updates.weight = Number.parseInt(weight)
    if (height && height !== "") updates.height = Number.parseInt(height)
    if (selectedBuild && selectedBuild !== "") updates.build = selectedBuild
    if (selectedLanguage && selectedLanguage !== "") updates.language = selectedLanguage
    if (selectedOrientation && selectedOrientation !== "") updates.orientation = selectedOrientation
    if (selectedAlcohol && selectedAlcohol !== "") updates.alcohol = selectedAlcohol
    if (selectedSmoking && selectedSmoking !== "") updates.smoking = selectedSmoking
    if (selectedKids && selectedKids !== "") updates.kids = selectedKids
    if (selectedLivingCondition && selectedLivingCondition !== "") updates.living_condition = selectedLivingCondition
    if (selectedIncome && selectedIncome !== "") updates.income = selectedIncome

    console.log("Saving extended profile data:", updates)
    onUpdate(updates)
    onBack()
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
        <span className={value ? "text-gray-900" : "text-gray-500"}>{value ? options[value] : "Не выбрано"}</span>
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
    <div className="min-h-screen bg-white">
      <div className="flex justify-between items-center p-4">
        <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-2xl">
          <ChevronLeft className="h-6 w-6 text-blue-500" />
        </Button>
        <button onClick={onNext} className="text-blue-500 text-lg font-medium">
          Пропустить
        </button>
      </div>

      <div className="px-6 pt-8 pb-32">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Детали профиля</h1>
        <p className="text-gray-600 text-lg mb-8">Расскажите больше о себе</p>

        <div className="space-y-6">
          {renderDropdown("Цель знакомства", selectedPurpose, purposeOptions, setSelectedPurpose, "purpose")}

          {renderDropdown("Образование", selectedEducation, educationOptions, setSelectedEducation, "education")}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500 mb-2 block">Вес (кг)</label>
              <Input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="65"
                className="h-12 text-lg border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-2 block">Рост (см)</label>
              <Input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="170"
                className="h-12 text-lg border-gray-200 rounded-xl"
              />
            </div>
          </div>

          {renderDropdown("Телосложение", selectedBuild, buildOptions, setSelectedBuild, "build")}

          {renderDropdown("Язык", selectedLanguage, languageOptions, setSelectedLanguage, "language")}

          {renderDropdown("Ориентация", selectedOrientation, orientationOptions, setSelectedOrientation, "orientation")}

          {renderDropdown("Алкоголь", selectedAlcohol, alcoholOptions, setSelectedAlcohol, "alcohol")}

          {renderDropdown("Курение", selectedSmoking, smokingOptions, setSelectedSmoking, "smoking")}

          {renderDropdown("Дети", selectedKids, kidsOptions, setSelectedKids, "kids")}

          {renderDropdown(
            "Жилищные условия",
            selectedLivingCondition,
            livingConditionOptions,
            setSelectedLivingCondition,
            "livingCondition",
          )}

          {renderDropdown("Доход", selectedIncome, incomeOptions, setSelectedIncome, "income")}
        </div>

        <div className="fixed bottom-8 left-6 right-6 max-w-md mx-auto">
          <Button
            onClick={handleNext}
            className="w-full h-14 bg-blue-500 hover:bg-blue-600 text-white text-lg font-medium rounded-2xl"
          >
            Продолжить
          </Button>
        </div>
      </div>
    </div>
  )
}

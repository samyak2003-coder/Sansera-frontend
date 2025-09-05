"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

interface FormState {
  partsPerBlock: string
  part: string
  widthDia: string
  length: string
  thicknessWidth: string
  spec: string
  alloy: string
  form: string
  annual: string
}

interface PredictionContextType {
  form: FormState
  setForm: React.Dispatch<React.SetStateAction<FormState>>
  predictions: Record<string, any>
  setPredictions: React.Dispatch<React.SetStateAction<Record<string, any>>>
}

const PredictionContext = createContext<PredictionContextType | undefined>(undefined)

export const PredictionProvider = ({ children }: { children: ReactNode }) => {
  const [form, setForm] = useState<FormState>({
  partsPerBlock: "",
  part: "",
  widthDia: "",
  length: "",
  thicknessWidth: "",
  spec: "",
  alloy: "",
  form: "",
  annual: ""
})

  const [predictions, setPredictions] = useState<Record<string, any>>({})

  return (
    <PredictionContext.Provider value={{ form, setForm, predictions, setPredictions }}>
      {children}
    </PredictionContext.Provider>
  )
}

export const usePrediction = () => {
  const ctx = useContext(PredictionContext)
  if (!ctx) throw new Error("usePrediction must be used inside PredictionProvider")
  return ctx
}

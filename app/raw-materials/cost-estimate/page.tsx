"use client"
import { useState } from "react"
import type React from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {   
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from "@/components/ui/select"

// Replace these arrays with the actual contents from your txt if they differ.
const SPEC_OPTIONS = [
  "BAMS516-002",
  "AMS 5659",
  "AMS 4911",
  "AMS 4050",
  "AMS 4928",
  "AMS 4101",
  "AMS 5862",
  "AMS 5629",
  "AMS 4640",
  "AMS5629",
  "AMS 4078",
  "BMS7-323, TYP I",
  "AMS-QQ-A-200/11",
  "AMS5528",
  "AMS-QQ-A-225/8",
  "ABS5125A012",
  "ASNA3011-8876",
  "ABS5323A050",
  "AMS5678",
  "AMS‐QQ‐A‐250/30",
  "BMS 7-240 TY-1",
  "AMS-QQ-A-250/29",
  "ASNA3011-8860",
  "ASNA3131-4325",
  "CW101CR1150R25A",
  "ABS5064A030",
  "ABS5032A020",
  "ASNA3011-8870",
  "AMS 5599",
  "AMS 5659 TY-1",
  "AMS 5659, TY-1",
  "AMS-QQ-A-250/12",
  "ABS5064A025",
  "ABS5125A010",
  "AMS-QQ-A-250/4",
  "ABS5032A025",
  "ABS5032A040",
  "AMS-QQ-A-225/9",
  "AMS 5596",
  "PA6D16",
  "ASNA3011-8845",
  "ABS5064A080",
  "ABS5455A0300",
  "BMS 7-240",
  "AMS-QQ-A-250/11",
  "ASNA3417-5625",
  "ASNA3131-4675",
  "ASNA3130-4675",
  "PA6D10",
  "BMS 7-323, TY-1",
  "ABS5064A090",
  "ABS5323B025",
  "ABS5323B090",
  "BMS 7-122",
  "AMS 4124",
  "AMS 3617",
  "AMS 4027",
  "AMS-QQ-A-200/8",
  "AMS 5643",
  "ASTM B 196",
  "AMS 5519",
  "ABS5032A016",
  "ABS5849A0300",
  "ABS5064A050",
  "ABS5849A0200",
  "ABS5455A0200",
  "AMS 4590",
  "ABS5323A090",
  "EN485",
  "ASNA3011-8821",
  "ABS5032A030",
  "ABS5032A045",
  "ABS5032A014",
  "ABS5323B070",
  "ASNA3044-8628",
  "ASNA3058-4675",
  "ASNA3131-5975",
]

const ALLOY_OPTIONS = [
  "7475",
  "TI-6AL-4V",
  "15-5PH",
  "7050",
  "2024",
  "7075",
  "2124",
  "AL-NI-BZ",
  "PH13-8MO",
  "13-8MO",
  "17-7PH",
  "7175",
  "6061",
  "2219",
  "35NC6",
  "EN12163",
  "Polyamide",
  "IN 625",
  "St-35NC6",
  "7040",
  "Cu-Ni-Tin",
  "IN 718",
  "Cu-Be",
  "30NCD16",
  "NYLON 6/6",
  "Be-Cu",
  "301",
  "4330M",
  "17-4PH",
  "Al-5086",
]

const FORM_OPTIONS = ["PLATE", "RND", "FLAT", "BAR", "SHT", "BOP", "ROD", "EXT"]

export default function CostEstimatorPage() {
  const [form, setForm] = useState({
    spec: "",
    form: "",
    alloy: "",
    partsPerBlock: "",
    part: "",
    annual: "",
    widthDia: "",
    length: "",
    thicknessWidth: "",
  })
  type PredictionValue = {
  prediction?: string | number | (string | number)[]
  [key: string]: unknown
}
 
const [predictions, setPredictions] = useState<Record<string, PredictionValue>>({})
  const [isLoading, setLoading] = useState(false)


  function toFloat(value: string) {
    if (!value) return 0.0
    const n = Number(value)
    return Number.isFinite(n) ? n : 0.0
  }


  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)


    try {
      type PredictionResult = {
        [key: string]: unknown
      }
     const results: Record<string, PredictionValue> = {}

      if (form.thicknessWidth === "") {
        // 2D case
        const res1 = await fetch("http://localhost:5000/rm/cost/2d_cost_estimate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            "Specification": form.spec,
            "Form": form.form,
            "Alloy": form.alloy,
            "Parts/Block": toFloat(form.partsPerBlock),
            "W/D": toFloat(form.widthDia),
            "L/GF": toFloat(form.length),
            "Part": toFloat(form.part),
            "Annual": toFloat(form.annual),
          }),
        })
        const data1 = await res1.json()
        results["Cost in $ for 2D Part"] = data1
      } else {
        // 3D case
        const res2 = await fetch("http://localhost:5000/rm/cost/3d_cost_estimate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            "Specification": form.spec,
            "Form": form.form,
            "Alloy": form.alloy,
            "W/D": toFloat(form.widthDia),
            "L/GF": toFloat(form.length),
            "Part": toFloat(form.part),
            "T/WT": toFloat(form.thicknessWidth),
            "Annual": toFloat(form.annual),
          }),
        })
        const data2 = await res2.json()
        results["Cost in $ for 3D Part"] = data2
      }


      setPredictions(results)
    } catch (err) {
      console.error("Error submitting:", err)
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="min-h-screen w-screen p-4 md:p-6 flex items-center justify-center">
      <Card className="mx-auto">
        <CardHeader>
          <CardTitle className="text-pretty">Cost Estimator</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Parts per block */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="ppb">Parts/Block</Label>
              <Input
                id="ppb"
                type="number"
                inputMode="decimal"
                step="any"
                value={form.partsPerBlock}
                onChange={(e) => setForm(prev => ({ ...prev, partsPerBlock: e.target.value }))}
                placeholder="0"
              />
            </div>


            {/* Part */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="part">Part</Label>
              <Input
                id="part"
                type="number"
                inputMode="decimal"
                step="any"
                value={form.part}
                onChange={(e) => setForm(prev => ({ ...prev, part: e.target.value }))}
                placeholder="0"
              />
            </div>


            {/* Annual */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="annual">Annual</Label>
              <Input
                id="annual"
                type="number"
                inputMode="decimal"
                step="any"
                value={form.annual}
                onChange={(e) => setForm(prev => ({ ...prev, annual: e.target.value }))}
                placeholder="0"
              />
            </div>


            {/* Width/Dia */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="widthDia">RM Width/Dia (W/T)</Label>
              <Input
                id="widthDia"
                type="number"
                inputMode="decimal"
                step="any"
                value={form.widthDia}
                onChange={(e) => setForm(prev => ({ ...prev, widthDia: e.target.value }))}
                placeholder="0.0"
              />
            </div>


            {/* Length */}
            <div className="flex flex-col gap-2 sm:col-span-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="length">RM Length (L/GF)</Label>
              </div>
              <Input
                id="length"
                type="number"
                inputMode="decimal"
                step="any"
                value={form.length}
                onChange={(e) => setForm(prev => ({ ...prev, length: e.target.value }))}
                placeholder="0.0"
              />
            </div>


            {/* Thickness/Width */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="thicknessWidth">RM Thickness/Width (T/WT)</Label>
               <span className="text-xs text-muted-foreground">
                  Leave blank for parts with Diameter and Thickness
                </span>
              <Input
                id="thicknessWidth"
                type="number"
                inputMode="decimal"
                step="any"
                value={form.thicknessWidth}
                onChange={(e) => setForm(prev => ({ ...prev, thicknessWidth: e.target.value }))}
                placeholder="0.0"
              />
            </div>


            {/* Spec */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="spec">Spec</Label>
              <Select
                value={form.spec}
                onValueChange={(val) => setForm(prev => ({ ...prev, spec: val }))}
              >
                <SelectTrigger id="spec">
                  <SelectValue placeholder="Select Spec" />
                </SelectTrigger>
                <SelectContent className="max-h-64 overflow-y-auto overscroll-contain z-[60]">
                  {SPEC_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>


            {/* Alloy */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="alloy">Alloy</Label>
              <Select
                value={form.alloy}
                onValueChange={(val) => setForm(prev => ({ ...prev, alloy: val }))}
              >
                <SelectTrigger id="alloy">
                  <SelectValue placeholder="Select Alloy" />
                </SelectTrigger>
                <SelectContent className="max-h-64 overflow-y-auto overscroll-contain z-[60]">
                  {ALLOY_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>


            {/* Form */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="form">Form</Label>
              <Select
                value={form.form}
                onValueChange={(val) => setForm(prev => ({ ...prev, form: val }))}
              >
                <SelectTrigger id="form">
                  <SelectValue placeholder="Select Form" />
                </SelectTrigger>
                <SelectContent className="max-h-64 overflow-y-auto overscroll-contain z-[60]">
                  {FORM_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>


            {/* Submit */}
            <div className="sm:col-span-2">
              <div className="flex justify-center">
                <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
                  {isLoading ? "Loading..." : "Submit"}
                </Button>
              </div>
            </div>
          </form>


          {Object.keys(predictions).length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Predictions</h2>
              <ul className="space-y-1">
                {Object.entries(predictions).map(([key, val]) => {
                  const pred = Array.isArray(val.prediction)
                  ? val.prediction[0]
                  : val.prediction ?? JSON.stringify(val)
                  return (
                    <li key={key} className="text-sm">
                      <strong>{key}:</strong> {pred}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </CardContent>
        <CardFooter />
      </Card>
    </div>
  )
}
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
  SelectGroup,
  SelectItem,
  SelectLabel,
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
  // Preserve any existing state; adding controlled state for new selects if not present.
  const [spec, setSpec] = useState<string>("")
  const [alloy, setAlloy] = useState<string>("")
  const [form, setForm] = useState<string>("")

  // If your page already tracks these numeric fields, keep your state.
  // Ensure they are strings so empty -> "" can be coerced to 0/0.0 on submit.
  const [partsPerBlock, setPartsPerBlock] = useState<string>("")
  const [part, setPart] = useState<string>("")
  const [widthOrDia, setWidthOrDia] = useState<string>("")
  const [length, setLength] = useState<string>("")
  const [thicknessOrWidth, setThicknessOrWidth] = useState<string>("")

  function toFloat(value: string) {
    if (value === "" || value == null) return 0.0
    const n = Number(value)
    return Number.isFinite(n) ? n : 0.0
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Coerce empty numeric inputs to 0.0 by default. If you need integer 0 specifically for any field, use Math.trunc.
    const payload = {
      spec: spec || "", // default to empty string if not chosen
      alloy: alloy || "",
      form: form || "",
      partsPerBlock: toFloat(partsPerBlock), // 0.0 if empty/non-numeric
      part: toFloat(part),
      widthOrDia: toFloat(widthOrDia),
      length: toFloat(length), // allow 0.0 when left blank
      thicknessOrWidth: toFloat(thicknessOrWidth),
    }

    // TODO: Replace with your actual calculation or API call
    console.log("[v0] Cost Estimator submit:", payload)
    // alert(JSON.stringify(payload, null, 2))
  }

  return (
    <div className="min-h-screen w-screen p-4 md:p-6 flex items-center justify-center">
        <Card className="mx-auto">
          <CardHeader>
            <CardTitle className="text-pretty">Cost Estimator</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Numeric inputs */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="ppb">Parts/Block</Label>
                <Input
                  id="ppb"
                  type="number"
                  inputMode="decimal"
                  step="any"
                  value={partsPerBlock}
                  onChange={(e) => setPartsPerBlock(e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="part">Part</Label>
                <Input
                  id="part"
                  type="number"
                  inputMode="decimal"
                  step="any"
                  value={part}
                  onChange={(e) => setPart(e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="widthOrDia">Part Width/Dia (W/T_P)</Label>
                <Input
                  id="widthOrDia"
                  type="number"
                  inputMode="decimal"
                  step="any"
                  value={widthOrDia}
                  onChange={(e) => setWidthOrDia(e.target.value)}
                  placeholder="0.0"
                />
              </div>

              <div className="flex flex-col gap-2 sm:col-span-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="length">Part Length (L/GF_P)</Label>
                  <span className="text-xs text-muted-foreground">
                    Leave blank for parts with Diameter and Thickness
                  </span>
                </div>
                <Input
                  id="length"
                  type="number"
                  inputMode="decimal"
                  step="any"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  placeholder="0.0"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="thicknessOrWidth">Part Thickness/Width (T/WT_P)</Label>
                <Input
                  id="thicknessOrWidth"
                  type="number"
                  inputMode="decimal"
                  step="any"
                  value={thicknessOrWidth}
                  onChange={(e) => setThicknessOrWidth(e.target.value)}
                  placeholder="0.0"
                />
              </div>

                  {/* Selects: Spec, Alloy, Form */}
                  <div className="flex flex-col gap-2">
                <Label htmlFor="spec">Spec</Label>
                <Select value={spec} onValueChange={setSpec}>
                  <SelectTrigger id="spec">
                    <SelectValue placeholder="Select Spec" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="max-h-64 overflow-y-auto overscroll-contain z-[60]">
                    {SPEC_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="alloy">Alloy</Label>
                <Select value={alloy} onValueChange={setAlloy}>
                  <SelectTrigger id="alloy">
                    <SelectValue placeholder="Select Alloy" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="max-h-64 overflow-y-auto overscroll-contain z-[60]">
                    {ALLOY_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="form">Form</Label>
                <Select value={form} onValueChange={setForm}>
                  <SelectTrigger id="form">
                    <SelectValue placeholder="Select Form" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="max-h-64 overflow-y-auto overscroll-contain z-[60]">
                    {FORM_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>


              {/* Submit centered across the card */}
              <div className="sm:col-span-2">
                <div className="flex justify-center">
                  <Button type="submit" className="w-full sm:w-auto">
                    Submit
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="justify-between"></CardFooter>
        </Card>
      </div>
  )
}
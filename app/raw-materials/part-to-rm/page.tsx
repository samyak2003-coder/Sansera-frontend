"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function PartToRMPage() {
  const [form, setForm] = React.useState({
    partsPerBlock: "",
    part: "",
    widthDia: "",
    length: "", // L/GF_P (optional per instructions)
    thicknessWidth: "",
  })
  const [errors, setErrors] = React.useState<{ [k: string]: string }>({})

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const nextErrors: { [k: string]: string } = {}

    const parseFloatOrErr = (key: keyof typeof form, label: string, optional = false) => {
      const v = form[key].trim()
      if (optional && v === "") return null
      if (v === "") {
        nextErrors[key as string] = `${label} is required`
        return null
      }
      const num = Number(v)
      if (Number.isNaN(num)) {
        nextErrors[key as string] = `${label} must be a number`
        return null
      }
      return num
    }

    const partsPerBlock = parseFloatOrErr("partsPerBlock", "Parts/Block")
    const part = parseFloatOrErr("part", "Part")
    const widthDia = parseFloatOrErr("widthDia", "Part Width/Dia (W/T_P)")
    const length = parseFloatOrErr("length", "Part Length (L/GF_P)", true)
    const thicknessWidth = parseFloatOrErr("thicknessWidth", "Part Thickness/Width (T/WT_P)")

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    console.log("[v0] Submitted values:", { partsPerBlock, part, widthDia, length, thicknessWidth })
    alert("Submitted successfully")
  }

  return (
    <div className="min-h-screen w-screen p-4 md:p-6 flex items-center justify-center">
      <Card className="max-w-sm sm:max-w-md lg:max-w-xl">
      <CardHeader>
        <CardTitle className="text-pretty text-center">Part to Raw Material</CardTitle>
        <CardDescription className="text-pretty">
          Enter the following values as floating numbers. Leave L/GF_P blank for parts with Diameter and Thickness
          only.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {/* Parts/Block */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="partsPerBlock">Parts/Block</Label>
            <Input
              id="partsPerBlock"
              name="partsPerBlock"
              type="number"
              step="any"
              inputMode="decimal"
              placeholder="e.g., 2.5"
              value={form.partsPerBlock}
              onChange={handleChange}
              aria-invalid={!!errors.partsPerBlock}
              aria-describedby={errors.partsPerBlock ? "partsPerBlock-error" : undefined}
            />
            {errors.partsPerBlock && (
              <p id="partsPerBlock-error" className="text-sm text-red-600">
                {errors.partsPerBlock}
              </p>
            )}
          </div>

          {/* Part */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="part">Part</Label>
            <Input
              id="part"
              name="part"
              type="number"
              step="any"
              inputMode="decimal"
              placeholder="e.g., 1.0"
              value={form.part}
              onChange={handleChange}
              aria-invalid={!!errors.part}
              aria-describedby={errors.part ? "part-error" : undefined}
            />
            {errors.part && (
              <p id="part-error" className="text-sm text-red-600">
                {errors.part}
              </p>
            )}
          </div>

          {/* Part Width/Dia (W/T_P) */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="widthDia">Part Width/Dia (W/T_P)</Label>
            <Input
              id="widthDia"
              name="widthDia"
              type="number"
              step="any"
              inputMode="decimal"
              placeholder="e.g., 25.4"
              value={form.widthDia}
              onChange={handleChange}
              aria-invalid={!!errors.widthDia}
              aria-describedby={errors.widthDia ? "widthDia-error" : undefined}
            />
            {errors.widthDia && (
              <p id="widthDia-error" className="text-sm text-red-600">
                {errors.widthDia}
              </p>
            )}
          </div>

          {/* Part Length (L/GF_P) with helper text inline */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="length">Part Length (L/GF_P)</Label>
              <span className="text-xs text-muted-foreground">Leave blank for parts with Diameter and Thickness</span>
            </div>
            <Input
              id="length"
              name="length"
              type="number"
              step="any"
              inputMode="decimal"
              placeholder="e.g., 100.0 (or leave blank)"
              value={form.length}
              onChange={handleChange}
              aria-invalid={!!errors.length}
              aria-describedby={errors.length ? "length-error" : undefined}
            />
            {errors.length && (
              <p id="length-error" className="text-sm text-red-600">
                {errors.length}
              </p>
            )}
          </div>

          {/* Part Thickness/Width (T/WT_P) */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="thicknessWidth">Part Thickness/Width (T/WT_P)</Label>
            <Input
              id="thicknessWidth"
              name="thicknessWidth"
              type="number"
              step="any"
              inputMode="decimal"
              placeholder="e.g., 5.0"
              value={form.thicknessWidth}
              onChange={handleChange}
              aria-invalid={!!errors.thicknessWidth}
              aria-describedby={errors.thicknessWidth ? "thicknessWidth-error" : undefined}
            />
            {errors.thicknessWidth && (
              <p id="thicknessWidth-error" className="text-sm text-red-600">
                {errors.thicknessWidth}
              </p>
            )}
          </div>

          <div className="flex justify-center pt-2">
            <Button type="submit" className="w-full md:w-auto">
              Submit
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
    </div>
  )
}

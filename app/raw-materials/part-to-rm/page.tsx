"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function PartToRMPage() {
  const [form, setForm] = useState({
    partsPerBlock: "",
    part: "",
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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function customRound(x: number): number {
    const xRounded = Math.round(x * 100) / 100
    const lastDigit = Math.round((xRounded * 100) % 10)
    if (lastDigit < 3 || lastDigit >= 8) {
      return Math.round(xRounded * 10) / 10
    } else {
      return Math.round(Math.floor((xRounded * 100) / 10) * 10 + 5) / 100
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    try {
      const results: Record<string, PredictionValue> = {}

      if (form.thicknessWidth === "") {
        // 2D case
        const res1 = await fetch("http://localhost:5000/rm/part-rm/2d_xgb_lgf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            "Parts/Block": Number(form.partsPerBlock),
            Part: parseFloat(form.part),
            "W/D_P": parseFloat(form.widthDia),
          }),
        })
        const data1 = await res1.json()
        results["L/GF"] = data1

        const res2 = await fetch("http://localhost:5000/rm/part-rm/2d_lr_wd", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ "W/D_P": parseFloat(form.widthDia) }),
        })
        const data2 = await res2.json()
        results["W/D"] = data2
      } else {
        // 3D case
        const res1 = await fetch("http://localhost:5000/rm/part-rm/3d_lr_lgf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ "L/GF_P": parseFloat(form.length) }),
        })
        const data1 = await res1.json()
        results["L/GF"] = data1

        const res2 = await fetch("http://localhost:5000/rm/part-rm/3d_lr_wd", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ "W/D_P": parseFloat(form.widthDia) }),
        })
        const data2 = await res2.json()
        results["W/D"] = data2

        const res3 = await fetch("http://localhost:5000/rm/part-rm/3d_lr_twt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ "T/WT_P": parseFloat(form.thicknessWidth) }),
        })
        const data3 = await res3.json()
        results["T/WT"] = data3
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
      <Card className="max-w-sm sm:max-w-md lg:max-w-xl">
        <CardHeader>
          <CardTitle className="text-pretty text-center">Part to Raw Material</CardTitle>
          <CardDescription className="text-pretty">
            Enter the following values as floating numbers. Leave L/GF_P blank for parts with Diameter and Thickness only.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="partsPerBlock">Parts/Block</Label>
              <Input id="partsPerBlock" name="partsPerBlock" type="number" value={form.partsPerBlock} onChange={handleChange} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="part">Part</Label>
              <Input id="part" name="part" type="number" value={form.part} onChange={handleChange} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="widthDia">Part Width/Dia (W/T_P)</Label>
              <Input id="widthDia" name="widthDia" type="number" value={form.widthDia} onChange={handleChange} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="length">Part Length (L/GF_P)</Label>
              <Input id="length" name="length" type="number" value={form.length} onChange={handleChange} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="thicknessWidth">Part Thickness/Width (T/WT_P)</Label>
              <Input id="thicknessWidth" name="thicknessWidth" type="number" value={form.thicknessWidth} onChange={handleChange} />
            </div>
            <div className="flex justify-center pt-2">
              <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
                {isLoading ? "Loading..." : "Submit"}
              </Button>
            </div>
          </form>
          {Object.keys(predictions).length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Predictions</h2>
              <ul className="space-y-1">
                {Object.entries(predictions).map(([key, val]) => {
                  const pred = Array.isArray(val.prediction) ? val.prediction[0] : val.prediction ?? val
                  const roundedPred = customRound(Number(pred))
                  return (
                    <li key={key} className="text-sm">
                      <strong>{key}:</strong> {roundedPred}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
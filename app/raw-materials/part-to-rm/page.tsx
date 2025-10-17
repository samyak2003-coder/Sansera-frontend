"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PartToRMPage() {
  const [form, setForm] = useState({
    widthDia: "",
    length: "",
    thicknessWidth: "",
    shape: "",
  })

  const [predictions, setPredictions] = useState<null | Record<string, number>>(null)
  const [volume, setVolume] = useState<number>(0)
  const [tonnage, setTonnage] = useState<number>(0)
  const [isLoading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  setLoading(true)
  setPredictions(null)

  try {
    // Map shape to one-hot columns
    const shapeOptions = ["FLAT", "PLATE", "BAR", "RND"]
    const shapeOneHot: Record<string, number> = {}
    shapeOptions.forEach(opt => (shapeOneHot[opt] = form.shape === opt ? 1 : 0))

    const payload = {
      "L": form.length ? parseFloat(form.length) : 0,
      "W/D": form.widthDia ? parseFloat(form.widthDia) : 0,
      "T": form.thicknessWidth ? parseFloat(form.thicknessWidth) : 0,
      ...shapeOneHot,
    }

    const res = await fetch("http://127.0.0.1:5000/rm/part-rm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    setPredictions(data)

    // --- Calculate Volume ---
    let volume = 0
    const L = parseFloat(form.length || "0")
    const W = parseFloat(form.widthDia || "0")
    const T = parseFloat(form.thicknessWidth || "0")

    if (form.shape === "RND") {
      // Cylinder
      volume = (Math.PI * W * W * L) / 4
    } else {
      // Cuboid
      volume = L * W * T
    }

    // --- Save all values and predictions to localStorage ---
    const partRMData = {
      userInputs: form,
      predictions: data,
      volume,
    }
    localStorage.setItem("part_rm_data", JSON.stringify(partRMData))

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
            Enter the following values. Leave Thickness blank for parts with Diameter only.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="shape">Shape/Form</Label>
              <Select value={form.shape} onValueChange={value => setForm(prev => ({ ...prev, shape: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Shape/Form" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FLAT">FLAT</SelectItem>
                  <SelectItem value="PLATE">PLATE</SelectItem>
                  <SelectItem value="BAR">BAR</SelectItem>
                  <SelectItem value="RND">RND</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="widthDia">Part Width/Dia (W/D)</Label>
              <Input id="widthDia" name="widthDia" type="number" value={form.widthDia} onChange={handleChange} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="length">Part Length (L)</Label>
              <Input id="length" name="length" type="number" value={form.length} onChange={handleChange} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="thicknessWidth">Part Thickness (T)</Label>
              <span className="text-xs text-muted-foreground">Leave blank for parts with Diameter only</span>
              <Input id="thicknessWidth" name="thicknessWidth" type="number" value={form.thicknessWidth} onChange={handleChange} />
            </div>

            <div className="flex justify-center pt-2">
              <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
                {isLoading ? "Loading..." : "Submit"}
              </Button>
            </div>
          </form>

          {predictions && (
  <div className="mt-6">
    <h2 className="text-lg font-semibold mb-2">Predicted Raw Material</h2>
    <ul className="space-y-1">
      {Object.entries(predictions)
        .filter(([key]) => !(form.shape === "RND" && key === "rm_thickness"))
        .map(([key, val]) => (
          <li key={key} className="text-sm">
            <strong>{key.replace("rm_", "").replace("_", " ")}:</strong> {val}
          </li>
        ))}
    </ul>
  </div>
)}
        </CardContent>
      </Card>
    </div>
  )
}
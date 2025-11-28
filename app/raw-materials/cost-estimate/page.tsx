"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import densitiesData from "@/densities.json"

const SPEC_OPTIONS = [
  "AMS 4050", "ABS 5052", "AMS 5659", "AMS-QQ-A-250/12", "AMS-QQ-A-250/4",
  "AMS 5643", "AMS-QQ-A-200/8", "AMS 4027", "AMS 4078", "BMS 7-323 TY1",
  "ASTM B221", "BMS 7-371", "AMS-QQ-A-250/30", "AMS-QQ-A-250/11", "AMS-QQ-A-225/6",
  "AMS-QQ-A-225/9", "ASTM B209", "BMS 7-323", "ASTM B211", "BMS 7-240 TY1",
  "AMS 5629", "ABS 5324", "AMS-QQ-A-200/3", "AMS-QQ-A-200/11", "AMS 6345",
  "AMS 4928", "BMS 7-26", "AMS 4911", "AMS 4342", "AMS 4124", "AMS 4117",
  "AMS 6346", "BMS 7-323 TYIII", "AMS-QQ-A-225/8", "AMS 6348", "ABS 5455",
  "BMS 7-122", "BMS 7-364", "ASTM A564", "AMS 5622", "MIL-T-9047", "BMS 7-240",
  "AMS 4904", "AMS 6414", "AMS 2759/3", "AMS-QQ-A-200/9", "AMS 6931", "AMS-QQ-A-250/5"
]

const TEMPER_OPTIONS = [
  "T7451","T7351","SOLUTION TREATED","T651","H1025","T351","T6511","T851",
  "T6","ANNEALED","T76511","NORMALIZED","T3511","T73511","T74511","T3","F4","T4","T7651"
]

const MATL_CODES = ["AL", "SS", "TI"]
const SHAPE_OPTIONS = ["RND", "FLAT", "BAR", "PLATE"]
const ALLOY_OPTIONS = [
  "7050","6061","7475","15-5PH","7075","2024","17-4PH","7136","2219",
  "Ti-6AL-4V/BSTA11","4130","13-8MO","7040","4340","2011","4330","C465"
]

export default function CostEstimatorPage() {
  const [form, setForm] = useState({
    spec: "",
    temper: "",
    alloy: "",
    volume: "",
    weightPerPart: "",
    quantity: "",
    materialCode: "",
    shape: "",
  })

  const [predictions, setPredictions] = useState<any>(null)
  const [isLoading, setLoading] = useState(false)
  const [autoWeight, setAutoWeight] = useState(true)
  const [exchangeRate, setExchangeRate] = useState<number | null>(null)

  // fetch currency rate
  useEffect(() => {
    async function fetchRate() {
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/USD")
        const data = await res.json()
        setExchangeRate(data.rates.INR || 88.5)
      } catch {
        setExchangeRate(88.5)
      }
    }
    fetchRate()
  }, [])

  // Auto volume from predicted dimensions
  useEffect(() => {
    const partRMData = localStorage.getItem("part_rm_data")
    if (!partRMData) return

    const { predictions, userInputs } = JSON.parse(partRMData)
    if (!predictions) return

    let volume = 0
    const shape = userInputs.shape

    const L = predictions.rm_length || 0
    const W = predictions.rm_width || 0
    const T = predictions.rm_thickness || 0
    const dia = predictions.rm_dia || W

    if (shape === "RND") {
      volume = (Math.PI * dia * dia * L) / 4
    } else {
      volume = L * W * (T || 1)
    }

    setForm(prev => ({ ...prev, volume: volume.toFixed(2), shape }))
  }, [])

  // Auto weight calc
  useEffect(() => {
    if (!autoWeight) return

    const volumeNum = parseFloat(form.volume || "0")
    const { materialCode, alloy } = form

    if (volumeNum && materialCode && alloy) {
      const entry = densitiesData.find(
        d => d.Matl_Code === materialCode && d.Alloy === alloy
      )
      if (entry) {
        const density_kg_in3 = entry.Density_kg_m3 / 61023.7
        const weightPerPart = volumeNum * density_kg_in3
        setForm(prev => ({ ...prev, weightPerPart: weightPerPart.toFixed(4) }))
      }
    }
  }, [form.volume, form.materialCode, form.alloy, autoWeight])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setPredictions(null)

    try {
      const payload = {
        "Matl. Code": form.materialCode,
        "Form": form.shape,
        "Temp": form.temper,
        "Spec": form.spec,
        "Alloy": form.alloy,
        "Volume": parseFloat(form.volume || "0"),
        "Weight/Part": parseFloat(form.weightPerPart || "0"),
        "Quantity": parseFloat(form.quantity || "0"),
        "Tonnage": parseFloat(form.weightPerPart || "0") * parseFloat(form.quantity || "0"),
      }

      const res = await fetch("http://localhost:5000/rm/cost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      setPredictions(data)

      localStorage.setItem("cost_estimation_data", JSON.stringify({ form, predictions: data }))
    } catch (err) {
      console.error("Error submitting:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-screen p-4 md:p-6 flex items-center justify-center">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="text-pretty">Cost Estimator</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            
            {/* Spec */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="spec">Specification</Label>
              <Select value={form.spec} onValueChange={val => setForm(prev => ({ ...prev, spec: val }))}>
                <SelectTrigger id="spec">
                  <SelectValue placeholder="Select Spec" />
                </SelectTrigger>
                <SelectContent className="max-h-64 overflow-y-auto">
                  {SPEC_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Temper */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="temper">Temper</Label>
              <Select value={form.temper} onValueChange={val => setForm(prev => ({ ...prev, temper: val }))}>
                <SelectTrigger id="temper">
                  <SelectValue placeholder="Select Temper" />
                </SelectTrigger>
                <SelectContent className="max-h-64 overflow-y-auto">
                  {TEMPER_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Material Code */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="materialCode">Material Code</Label>
              <Select value={form.materialCode} onValueChange={val => setForm(prev => ({ ...prev, materialCode: val }))}>
                <SelectTrigger id="materialCode">
                  <SelectValue placeholder="Select Material Code" />
                </SelectTrigger>
                <SelectContent className="max-h-64 overflow-y-auto">
                  {MATL_CODES.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Shape */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="shape">Shape</Label>
              <Select value={form.shape} onValueChange={val => setForm(prev => ({ ...prev, shape: val }))}>
                <SelectTrigger id="shape">
                  <SelectValue placeholder="Select Shape" />
                </SelectTrigger>
                <SelectContent className="max-h-64 overflow-y-auto">
                  {SHAPE_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Alloy */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="alloy">Alloy</Label>
              <Select value={form.alloy} onValueChange={val => setForm(prev => ({ ...prev, alloy: val }))}>
                <SelectTrigger id="alloy">
                  <SelectValue placeholder="Select Alloy" />
                </SelectTrigger>
                <SelectContent className="max-h-64 overflow-y-auto">
                  {ALLOY_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Volume */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="volume">Volume</Label>
              <Input id="volume" name="volume" type="number" value={form.volume} onChange={handleChange} />
            </div>

            {/* Weight */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="weightPerPart">Weight/Part</Label>
              <Input
                id="weightPerPart"
                name="weightPerPart"
                type="number"
                value={form.weightPerPart}
                onChange={e => {
                  handleChange(e)
                  setAutoWeight(false)
                }}
              />
            </div>

            {/* Quantity */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" name="quantity" type="number" value={form.quantity} onChange={handleChange} />
            </div>

            {/* Submit Button */}
            <div className="sm:col-span-2 flex justify-center">
              <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
                {isLoading ? "Loading..." : "Submit"}
              </Button>
            </div>

          </form>

          {/* ============================ */}
          {/*        RESULTS SECTION        */}
          {/* ============================ */}

          {predictions && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Predictions</h2>

              {/* Always show predicted price */}
              {"Predicted_Price/kg" in predictions && (
                <p className="text-sm mb-4">
                  <strong>Predicted Price/kg:</strong> ₹
                  {predictions["Predicted_Price/kg"].toLocaleString("en-IN")}
                </p>
              )}

              {/* Show table ONLY if KNN returns rows */}
              {Array.isArray(predictions?.Nearest_Matching_Rows) &&
                predictions.Nearest_Matching_Rows.length > 0 && (
                  <div className="mt-8">
                    <h2 className="text-lg font-semibold mb-2">Nearest Matching Rows</h2>

                    <div className="overflow-x-auto">
                      <table className="min-w-full border border-gray-300 text-sm">
                        <thead className="bg-gray-200">
                          <tr>
                            {Object.keys(predictions.Nearest_Matching_Rows[0]).map(col => (
                              <th key={col} className="border px-3 py-2 text-left font-medium">
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>

                        <tbody>
                          {predictions.Nearest_Matching_Rows.map((row, idx) => (
                            <tr key={idx} className="hover:bg-gray-100">
                              {Object.values(row).map((val, i) => (
                                <td key={i} className="border px-3 py-2">
                                  {val !== null && val !== undefined ? val.toString() : "-"}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
            </div>
          )}

        </CardContent>

        <CardFooter />
      </Card>
    </div>
  )
}

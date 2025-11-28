"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Dropdown options
const MACHINE_AXIS_OPTIONS = [
  { label: "3-Axis", value: 3 },
  { label: "4-Axis", value: 4 },
  { label: "5-Axis", value: 5 }
]

const OPERATION_OPTIONS = [
  { label: "M - Milling", value: 5 },
  { label: "T - Turning", value: 3 },
  { label: "D - Drilling", value: 2 }
]

const COMPLEXITY_OPTIONS = [
  { label: "A", value: 15 },
  { label: "B", value: 8 },
  { label: "C", value: 3 }
]

const MATL_CODE_OPTIONS = [
  { label: "AL (Aluminum)", value: 1 },
  { label: "SS (Stainless Steel)", value: 2 },
  { label: "TI (Titanium)", value: 3 }
]

export default function MachiningEstimatorPage() {
  const [form, setForm] = useState({
    MACHINE_AXIS: "",
    Operation_Factor: "",
    Complexity_Factor: "",
    MATL_CODE: ""
  })

  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)

    try {
      const payload = {
        "MACHINE AXIS": parseFloat(form.MACHINE_AXIS),
        "Operation_Factor": parseFloat(form.Operation_Factor),
        "Complexity_Factor": parseFloat(form.Complexity_Factor),
        "MATL CODE": parseFloat(form.MATL_CODE)
      }

      const res = await fetch("http://localhost:5000/machining", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      setResult(data)
    } catch (err) {
      console.error("Error fetching machining data:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-screen p-4 md:p-6 flex items-center justify-center">
      <Card className="mx-auto max-w-xl w-full">
        <CardHeader>
          <CardTitle className="text-pretty">Machining Cost Estimator</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            
            {/* Machine Axis */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="MACHINE_AXIS">Machine Axis</Label>
              <Select
                value={form.MACHINE_AXIS}
                onValueChange={val => setForm(prev => ({ ...prev, MACHINE_AXIS: val }))}
              >
                <SelectTrigger id="MACHINE_AXIS">
                  <SelectValue placeholder="Select Machine Axis" />
                </SelectTrigger>
                <SelectContent>
                  {MACHINE_AXIS_OPTIONS.map(opt => (
                    <SelectItem key={opt.label} value={opt.value.toString()}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Operation Factor */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="Operation_Factor">Operation</Label>
              <Select
                value={form.Operation_Factor}
                onValueChange={val => setForm(prev => ({ ...prev, Operation_Factor: val }))}
              >
                <SelectTrigger id="Operation_Factor">
                  <SelectValue placeholder="Select Operation" />
                </SelectTrigger>
                <SelectContent>
                  {OPERATION_OPTIONS.map(opt => (
                    <SelectItem key={opt.label} value={opt.value.toString()}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Complexity Factor */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="Complexity_Factor">Complexity</Label>
              <Select
                value={form.Complexity_Factor}
                onValueChange={val => setForm(prev => ({ ...prev, Complexity_Factor: val }))}
              >
                <SelectTrigger id="Complexity_Factor">
                  <SelectValue placeholder="Select Complexity" />
                </SelectTrigger>
                <SelectContent>
                  {COMPLEXITY_OPTIONS.map(opt => (
                    <SelectItem key={opt.label} value={opt.value.toString()}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Material Code */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="MATL_CODE">Material Code</Label>
              <Select
                value={form.MATL_CODE}
                onValueChange={val => setForm(prev => ({ ...prev, MATL_CODE: val }))}
              >
                <SelectTrigger id="MATL_CODE">
                  <SelectValue placeholder="Select Material" />
                </SelectTrigger>
                <SelectContent>
                  {MATL_CODE_OPTIONS.map(opt => (
                    <SelectItem key={opt.label} value={opt.value.toString()}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <div className="sm:col-span-2 flex justify-center">
              <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
                {isLoading ? "Predicting..." : "Predict Cycle Time"}
              </Button>
            </div>
          </form>

          {/* Prediction Output */}
          {result && (
  <div className="mt-6">
    <h2 className="text-lg font-semibold mb-2">Prediction Result</h2>
    {"predictions" in result ? (
      <div className="text-sm">
        {result.predictions.map((pred: any, index: number) => {
          const machineAxis = pred["MACHINE AXIS"];

          // MHR mapping
          const MHR_RATES: Record<number, number> = {
            3: 890,
            4: 1260,
            5: 1670
          };

          const rate = MHR_RATES[machineAxis] || 0;

          // Convert Cycle Time (mins) → Hours
          const cycleTimeHrs = pred.Predicted_Cycle_Time / 60;

          // Calculate machining cost
          const machiningCost = cycleTimeHrs * rate;

          return (
            <div key={index} className="border p-2 mb-2 rounded-lg bg-gray-50">
              <p><strong>Predicted Cycle Time:</strong> {pred.Predicted_Cycle_Time.toFixed(3)} mins</p>
              <p><strong>Machine Axis:</strong> {machineAxis}</p>
              <p><strong>Complexity Factor:</strong> {pred.Complexity_Factor}</p>
              <p><strong>Operation Factor:</strong> {pred.Operation_Factor}</p>
              <p><strong>Material Code:</strong> {pred["MATL CODE"]}</p>

              {/* 💰 Machining Cost */}
              <p className="mt-2 text-green-700 font-semibold">
                Machining Cost: ₹{machiningCost.toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>
    ) : (
      <p className="text-red-500">No prediction available</p>
    )}
  </div>
)}

        </CardContent>

        <CardFooter />
      </Card>
    </div>
  )
}
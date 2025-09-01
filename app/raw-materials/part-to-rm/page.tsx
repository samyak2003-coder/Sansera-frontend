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
    length: "",
    thicknessWidth: "",
  })
  const [errors, setErrors] = React.useState<{ [k: string]: string }>({})
  const [predictions, setPredictions] = React.useState<Record<string, any>>({})
  const [isLoading, setLoading] = React.useState<boolean>(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function customRound(x: number): number {
    const xRounded = Math.round(x * 100) / 100; // round to 2 decimals
    const lastDigit = Math.round((xRounded * 100) % 10); // extract 2nd decimal digit

    if (lastDigit < 3 || lastDigit >= 8) {
      return Math.round(xRounded * 10) / 10; // round to 1 decimal
    } else {
      return Math.round(Math.floor(xRounded * 100 / 10) * 10 + 5) / 100; // nearest .05
    }
}

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const nextErrors: { [k: string]: string } = {}

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setLoading(false)
      return
    }

    try {
      const results: Record<string, any> = {}

      if (form.thicknessWidth === "") {
        const res1 = await fetch("http://localhost:5000/rm/part-rm/2d_xgb_lgf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ "Parts/Block": Number(form.partsPerBlock), "Part":parseFloat(form.part), "W/D_P":parseFloat(form.widthDia)}),
        });
        const data1 = await res1.json();
        results["L/GF"] = data1;

        const res2 = await fetch("http://localhost:5000/rm/part-rm/2d_lr_wd", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({"W/D_P": parseFloat(form.widthDia)}),
        });
        const data2 = await res2.json();
        results["W/D"] = data2;

      } else {
        // 3D case
        const res1 = await fetch("http://localhost:5000/rm/part-rm/3d_lr_lgf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ "L/GF_P": parseFloat(form.length) }),
        });
        const data1 = await res1.json();
        results["L/GF"] = data1;

        const res2 = await fetch("http://localhost:5000/rm/part-rm/3d_lr_wd", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ "W/D_P": parseFloat(form.widthDia) }),
        });
        const data2 = await res2.json();
        results["W/D"] = data2;

        const res3 = await fetch("http://localhost:5000/rm/part-rm/3d_lr_twt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ "T/WT_P" : parseFloat(form.thicknessWidth)}),
        });
        const data3 = await res3.json();
        results["T/WT"] = data3;
      }

      setPredictions(results)
    } catch (err) {
      console.error("Error submitting:", err)
    } finally {
      setLoading(false);
    }
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
              inputMode="numeric"
              placeholder="e.g., 2"
              value={form.partsPerBlock}
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
              aria-invalid={!!errors.length}
              aria-describedby={errors.length ? "length-error" : undefined}
            />
            {errors.length && (
              <p id="length-error" className="text-sm text-red-600">
                {errors.length}
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
              aria-invalid={!!errors.length}
              aria-describedby={errors.length ? "length-error" : undefined}
            />
            {errors.length && (
              <p id="length-error" className="text-sm text-red-600">
                {errors.length}
              </p>
            )}
          </div>

          {/* Part Length (L/GF_P) with helper text inline */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="length">Part Length (L/GF_P)</Label>
            </div>
            <Input
              id="length"
              name="length"
              type="number"
              step="any"
              inputMode="decimal"
              placeholder="e.g., 100.0"
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
            <span className="text-xs text-muted-foreground">Leave blank for parts with Diameter and Thickness</span>
            <Input
              id="thicknessWidth"
              name="thicknessWidth"
              type="number"
              step="any"
              inputMode="decimal"
              placeholder="e.g., 5.0"
              value={form.thicknessWidth}
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

          <div className="flex justify-center pt-2">
            <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Submit'}
            </Button>
          </div>
        </form>

      {Object.keys(predictions).length > 0 && (
        <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Predictions</h2>
        <ul className="space-y-1">
        {Object.entries(predictions).map(([key, val]) => {
          const pred = Array.isArray(val.prediction)
            ? val.prediction[0]
            : val.prediction ?? val;

          const roundedPred = customRound(pred); // apply rounding

          return (
            <li key={key} className="text-sm">
              <strong>{key}:</strong> {roundedPred}
            </li>
          );
        })}
        </ul>
        </div>
        )}
      </CardContent>
    </Card>
    </div>
  )
}

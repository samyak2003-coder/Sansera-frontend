'use client';
import { Typewriter } from "@/components/ui/type-writer";

export default function Page() {
  return (
<div className="min-h-screen w-full flex items-center justify-center">
  <Typewriter text={TEXT} />
</div>
  )
}

const TEXT = "Welcome to the Cost Estimation Tool for Sansera Industries. Project carried out by Samyak, Rayaan, Adityaa, Shreevardhan from PES University."
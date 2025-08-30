"use client"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeSwitcher } from "@/components/ThemeSwitcher/ThemeSwitcher"

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b bg-background/80 backdrop-blur">
      <div className="absolute left-4 top-0 flex h-16 items-center">
        <SidebarTrigger />
      </div>

      <div className="mx-auto flex h-full max-w-screen-xl items-center justify-between px-4 pl-12">
        <div className="flex items-center gap-3">
          <img src="/Logo.png" alt="Sansera logo" />
          <span className="font-medium">Cost Estimator</span>
        </div>

        {/* Add any nav actions/links here */}
        <nav aria-label="Global" className="flex items-center gap-4">
          <ThemeSwitcher />
        </nav>
      </div>
    </header>
  )
}
"use client"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeSwitcher } from "@/components/ThemeSwitcher/ThemeSwitcher"
import Link from "next/link"

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b bg-background/80 backdrop-blur">
      <div className="absolute left-4 top-0 flex h-16 items-center">
        <SidebarTrigger />
      </div>

      <div className="mx-auto flex h-full max-w-screen-xl items-center justify-between px-4 pl-12" suppressHydrationWarning>
        <div className="flex items-center gap-3">
          <img src="/Logo.png" alt="Sansera logo"/>
          <span className="sm:text-sm md:text-md lg:text-lg xl:text-xl font-bold">Cost Estimator</span>
        </div>

        {/* Add any nav actions/links here */}
        <nav aria-label="Global" className="flex items-center gap-4">
          <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">
            Home
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4">
            Contact
          </Link>
          {/* keep ThemeSwitcher on the right */}
          <ThemeSwitcher />
        </nav>
      </div>
    </header>
  )
}
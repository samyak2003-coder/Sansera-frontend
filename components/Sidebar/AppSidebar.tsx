import { BadgeDollarSign, ChevronDown } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Machining",
    url: "/machining",
    icon: BadgeDollarSign,
  },
]

export function AppSidebar() {
  return (
    <Sidebar className="top-16">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Manufacturing Phases</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Raw Materials (collapsible) */}
              <Collapsible>
                <SidebarMenuItem>
                  {/* Left: navigates to /raw-materials */}
                  <SidebarMenuButton asChild>
                    <a href="/raw-materials">
                      <BadgeDollarSign />
                      <span>Raw Materials</span>
                    </a>
                  </SidebarMenuButton>

                  {/* Right: chevron triggers expand/collapse */}
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction
                      aria-label="Toggle Raw Materials submenu"
                      className="transition-transform data-[state=open]:rotate-180"
                    >
                      <ChevronDown className="size-4" />
                    </SidebarMenuAction>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <a href="/raw-materials/part-to-rm">
                            <span>Part To RM Dimensions</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <a href="/raw-materials/cost-estimate">
                            <span>RM Cost Estimation</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Other items stay as simple links */}
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

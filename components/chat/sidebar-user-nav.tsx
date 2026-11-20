"use client";

import { ChevronsUpDown, LogOut, Moon, Sun } from "lucide-react";
import type { User } from "next-auth";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { useCallback } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

function handleSignOut() {
  return signOut({ redirectTo: "/login" });
}

export function SidebarUserNav({ user }: { user: User }) {
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  const toggleTheme = useCallback(
    () => setTheme(dark ? "light" : "dark"),
    [dark, setTheme]
  );
  const name = user.name?.trim() || user.email?.split("@")[0] || "Account";
  const initials = name
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              aria-label={`Account menu for ${name}`}
              className="data-[state=open]:bg-sidebar-accent"
              data-testid="user-nav-button"
              size="lg"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground">
                {initials}
              </span>
              <span className="truncate font-medium">{name}</span>
              <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 max-w-[90vw]"
            data-testid="user-nav-menu"
            side="top"
            sideOffset={6}
          >
            <DropdownMenuLabel className="grid gap-1 p-2">
              <span className="truncate font-semibold text-foreground">
                {name}
              </span>
              <span
                className="truncate text-xs font-normal text-muted-foreground"
                data-testid="user-email"
              >
                {user.email}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              data-testid="user-nav-item-theme"
              onSelect={toggleTheme}
            >
              {dark ? <Sun /> : <Moon />} {dark ? "Light mode" : "Dark mode"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              data-testid="user-nav-item-auth"
              onSelect={handleSignOut}
            >
              <LogOut /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

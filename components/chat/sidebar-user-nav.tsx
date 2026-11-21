"use client";

import { Ellipsis, LogOut, Moon, Sun } from "lucide-react";
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
  const accountLabel = user.email || name;
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
              aria-label={`Account menu for ${accountLabel}`}
              className="min-h-10 h-auto gap-2.5 py-1 rounded-md px-2 text-sidebar-foreground hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-sidebar-ring data-[state=open]:bg-sidebar-accent group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0!"
              data-testid="user-nav-button"
              title={accountLabel}
            >
              <span
                aria-hidden="true"
                className="grid size-6 shrink-0 place-items-center rounded-full bg-indigo-100 text-[10px] font-semibold text-indigo-800 ring-1 ring-inset ring-indigo-900/10 dark:bg-indigo-950 dark:text-indigo-200 dark:ring-indigo-300/20"
              >
                {initials || "A"}
              </span>
              <span className="min-w-0 flex-1 break-all text-xs leading-tight font-medium text-foreground group-data-[collapsible=icon]:hidden">
                {accountLabel}
              </span>
              <Ellipsis
                aria-hidden="true"
                className="text-muted-foreground group-data-[collapsible=icon]:hidden"
              />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-[clamp(13rem,var(--radix-dropdown-menu-trigger-width),17rem)] max-w-(--radix-dropdown-menu-content-available-width) rounded-lg border border-border bg-popover p-1 shadow-md ring-0"
            collisionPadding={12}
            data-testid="user-nav-menu"
            side="top"
            sideOffset={8}
          >
            <DropdownMenuLabel className="grid gap-0.5 px-2 py-2">
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
              className="min-h-8 gap-2 rounded-md"
              data-testid="user-nav-item-theme"
              onSelect={toggleTheme}
            >
              {dark ? <Sun /> : <Moon />} {dark ? "Light mode" : "Dark mode"}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="min-h-8 gap-2 rounded-md"
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

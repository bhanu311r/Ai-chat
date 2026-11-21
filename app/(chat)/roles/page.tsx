import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const metadata: Metadata = { title: "Roles | Ai-chat" };

const sampleRoles = [
  {
    description: "Manages workspace settings and members.",
    name: "Administrator",
  },
  { description: "Creates and updates workspace content.", name: "Editor" },
  { description: "Views workspace content.", name: "Viewer" },
];

export default function RolesPage() {
  return (
    <div className="min-h-dvh bg-background">
      <header className="flex h-14 items-center gap-2 border-b px-4 md:px-6">
        <SidebarTrigger className="md:hidden" />
        <span className="text-sm font-medium">Workspace</span>
        <span aria-hidden="true" className="text-muted-foreground">
          /
        </span>
        <span className="text-sm text-muted-foreground">Roles</span>
      </header>
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8 sm:py-12">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Roles
            </h1>
            <Badge variant="secondary">Sample data</Badge>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Preview how workspace roles and their responsibilities will appear.
          </p>
        </div>
        <div className="overflow-hidden rounded-xl border bg-card text-card-foreground">
          <table
            aria-label="Sample workspace roles"
            className="w-full text-left text-sm"
          >
            <thead className="border-b bg-muted/40 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium sm:px-5" scope="col">
                  Role
                </th>
                <th className="px-4 py-3 font-medium sm:px-5" scope="col">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sampleRoles.map((role) => (
                <tr key={role.name}>
                  <th className="px-4 py-4 font-medium sm:px-5" scope="row">
                    {role.name}
                  </th>
                  <td className="px-4 py-4 text-muted-foreground sm:px-5">
                    {role.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

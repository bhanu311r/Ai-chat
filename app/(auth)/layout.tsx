import { Toaster } from "sonner";
import { ConversationScene } from "@/components/auth/conversation-scene";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="grid min-h-svh bg-background text-foreground md:grid-cols-[1.15fr_1fr]">
        <ConversationScene />
        <section className="grid place-items-center px-6 py-12">
          <div className="flex w-full max-w-sm flex-col gap-2 [&_form]:mt-6">
            {children}
          </div>
        </section>
      </main>
      <Toaster position="top-center" />
    </>
  );
}

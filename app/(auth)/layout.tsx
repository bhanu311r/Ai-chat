import { Toaster } from "sonner";
import { ConversationScene } from "@/components/auth/conversation-scene";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="grid min-h-svh bg-background md:grid-cols-[1.1fr_1fr]">
      <ConversationScene />
      <section className="flex items-center justify-center px-6 py-12 sm:px-12">
        <Toaster position="top-center" />
        <div className="flex w-full max-w-sm flex-col gap-2 [&_form]:mt-6">
          {children}
        </div>
      </section>
    </main>
  );
}

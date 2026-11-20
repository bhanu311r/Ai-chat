import { Ellipsis, MessageCircle, Sparkles } from "lucide-react";

import { Toaster } from "sonner";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="grid min-h-svh bg-background md:grid-cols-[1.1fr_1fr]">
      <aside
        aria-hidden="true"
        className="relative isolate hidden overflow-hidden bg-[radial-gradient(ellipse_at_42%_40%,#39504f,#17292c_55%,#101c22)] md:grid md:place-items-center"
      >
        <div className="absolute inset-0 bg-[radial-gradient(#c5ffed24_1px,transparent_1px)] bg-size-[24px_24px]" />
        <div className="absolute top-8 left-8 flex items-center gap-2 font-semibold text-white tracking-tight">
          <MessageCircle size={20} /> Ai-chat
        </div>
        <div className="relative w-3/4 max-w-md aspect-square perspective-[850px]">
          <div className="absolute top-[14%] left-[8%] grid h-[50%] w-[69%] -rotate-z-12 rotate-y-[-20deg] place-items-center rounded-[25%_25%_25%_5%] border border-white/60 bg-linear-to-br from-[#f0fff7] via-[#a8ebd1] to-[#5ea9a5] shadow-[inset_-8px_-10px_16px_#417f8060,2px_8px_0_#477f7a,7px_28px_38px_#06171d80]">
            <Sparkles className="size-1/3 text-[#245550]" strokeWidth={1.7} />
          </div>
          <div className="absolute right-[5%] bottom-[17%] grid h-[37%] w-[55%] rotate-y-[-16deg] rotate-z-8 place-items-center rounded-[25%_25%_5%_25%] border border-white/45 bg-linear-to-br from-[#cbd6ff] via-[#a4aee9] to-[#7882ba] shadow-[inset_-6px_-8px_14px_#5b659b80,2px_6px_0_#57608a,6px_23px_36px_#06171d80]">
            <Ellipsis className="size-1/2 text-[#363e68]" strokeWidth={3} />
          </div>
        </div>
      </aside>
      <section className="flex items-center justify-center px-6 py-12 sm:px-12">
        <Toaster position="top-center" />
        <div className="flex w-full max-w-sm flex-col gap-2 [&_form]:mt-6">
          {children}
        </div>
      </section>
    </main>
  );
}

import Script from "next/script";
import { Suspense } from "react";
import { ChatShell } from "@/components/chat/shell";

export default function ConversationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="lazyOnload"
      />
      <Suspense fallback={<div className="flex h-dvh" />}>
        <ChatShell />
      </Suspense>
      {children}
    </>
  );
}

"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUp, MessageCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { maxContextMessages, maxPromptLength, type Message } from "@/lib/chat";

const suggestions = [
  "Explain how an API works with an example",
  "Help me outline a personal website",
  "Give me three ideas for a weekend project",
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const composer = useRef<HTMLTextAreaElement>(null);
  const end = useRef<HTMLDivElement>(null);
  const sending = useRef(false);

  useEffect(() => {
    end.current?.scrollIntoView({ block: "nearest" });
  }, [messages, pending]);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = prompt.trim();
    if (!content || sending.current) return;

    const conversation: Message[] = [...messages, { role: "user", content }];
    sending.current = true;
    setMessages(conversation);
    setPrompt("");
    setPending(true);
    setError("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversation.slice(-maxContextMessages) }),
      });
      const result = await response.json();
      if (!response.ok || typeof result.reply !== "string") {
        throw new Error(result.error || "Could not send your message. Try again.");
      }
      setMessages([...conversation, { role: "assistant", content: result.reply }]);
    } catch (error) {
      setMessages(messages);
      setPrompt(content);
      setError(error instanceof Error ? error.message : "Could not send your message.");
    } finally {
      sending.current = false;
      setPending(false);
      composer.current?.focus();
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-4xl flex-col px-5 sm:px-8">
      <header className="flex items-center justify-between border-b py-5">
        <h1 className="flex items-center gap-3 text-lg font-semibold">
          <span className="rounded-xl bg-emerald-800 p-2 text-white"><MessageCircle size={19} aria-hidden /></span>
          AI Chat
        </h1>
        <Button variant="outline" disabled={pending} onClick={() => {
          setMessages([]);
          setPrompt("");
          setError("");
          composer.current?.focus();
        }}>
          <Plus aria-hidden /> New chat
        </Button>
      </header>

      <section aria-label="Conversation" className="flex flex-1 flex-col py-8">
        {messages.length === 0 ? (
          <div className="my-auto py-10">
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">What can I help with?</h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <Button key={suggestion} variant="outline" className="h-auto whitespace-normal py-2 text-left" onClick={() => {
                  setPrompt(suggestion);
                  composer.current?.focus();
                }}>
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div role="log" aria-label="Messages" className="space-y-4">
            {messages.map((message, index) => (
              <Card key={index} className={`w-fit max-w-[90%] gap-1 px-4 py-3 ${message.role === "user" ? "ml-auto bg-muted" : ""}`}>
                <p className="text-xs font-medium text-muted-foreground">{message.role === "user" ? "You" : "Assistant"}</p>
                <p className="whitespace-pre-wrap wrap-anywhere">{message.content}</p>
              </Card>
            ))}
          </div>
        )}
        {pending && <p role="status" className="mt-4 text-sm text-muted-foreground">Generating a reply…</p>}
        <div ref={end} />
      </section>

      <form onSubmit={send} className="sticky bottom-0 bg-background pb-6 pt-2">
        {error && <p role="alert" className="mb-2 text-sm text-destructive">{error}</p>}
        <Card className="flex-row items-end gap-2 p-2 focus-within:ring-2 focus-within:ring-ring">
          <textarea
            ref={composer}
            aria-label="Message"
            rows={2}
            maxLength={maxPromptLength}
            placeholder="Write a message…"
            value={prompt}
            readOnly={pending}
            onChange={(event) => setPrompt(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            className="min-w-0 flex-1 resize-none rounded-lg bg-transparent px-3 py-2 outline-none"
          />
          <Button type="submit" size="icon" aria-label="Send message" disabled={pending || !prompt.trim()}>
            <ArrowUp aria-hidden />
          </Button>
        </Card>
      </form>
    </main>
  );
}

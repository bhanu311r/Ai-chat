import { Layers3 } from "lucide-react";
import { Toaster } from "sonner";
import { ConversationScene } from "@/components/auth/conversation-scene";
import styles from "@/components/auth/conversation-scene.module.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className={styles.page}>
      <div className={styles.brand}>
        <Layers3 size={21} />
        Ai-chat
      </div>
      <ConversationScene />
      <section className={styles.formPanel}>
        <Toaster position="top-center" />
        {children}
      </section>
    </main>
  );
}

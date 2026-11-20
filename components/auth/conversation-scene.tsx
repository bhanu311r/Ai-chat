import { AudioLines, Sparkles } from "lucide-react";
import styles from "./conversation-scene.module.css";

export function ConversationScene() {
  return (
    <aside aria-hidden="true" className={styles.scene}>
      <div className={styles.chat}>
        <div className={styles.prompt}>
          <AudioLines size={17} /> What does light sound like?
        </div>
        <div className={styles.sculpture} />
        <div className={styles.reply}>
          <Sparkles size={18} />
          <span>Imagine a chord made of color.</span>
        </div>
      </div>
    </aside>
  );
}

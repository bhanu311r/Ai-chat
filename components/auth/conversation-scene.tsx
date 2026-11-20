import { AudioLines, Cpu, MessageSquareText } from "lucide-react";
import styles from "./conversation-scene.module.css";

export function ConversationScene() {
  return (
    <aside aria-hidden="true" className={styles.scene}>
      <div className={styles.brand}>
        <MessageSquareText size={19} />
        Ai-chat
      </div>
      <div className={styles.machine}>
        <div className={styles.deck}>
          <div className={styles.channel} />
          <div className={styles.module}>
            <AudioLines />
          </div>
          <div className={styles.module}>
            <Cpu />
          </div>
          <div className={styles.module}>
            <MessageSquareText />
          </div>
          <div className={styles.vents} />
        </div>
      </div>
    </aside>
  );
}

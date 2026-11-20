import type { CSSProperties } from "react";
import styles from "./conversation-scene.module.css";

const longitudes = Array.from({ length: 32 }, (_, index) => (index * 180) / 32);

export function ConversationScene() {
  return (
    <aside aria-hidden="true" className={styles.panel}>
      <div className={styles.brand}>Ai-chat</div>
      <div className={styles.stage}>
        <div className={styles.orbit}>
          <div className={styles.globe}>
            {longitudes.map((angle) => (
              <i
                key={angle}
                style={{ "--angle": `${angle}deg` } as CSSProperties}
              />
            ))}
          </div>
        </div>
        <div className={styles.thread}>
          <div className={styles.question}>Why does the Moon change shape?</div>
          <div className={styles.answer}>
            <span className={styles.typing}>● ● ●</span>
            <span className={styles.words}>
              As the Moon orbits Earth, we see different portions of its sunlit
              half.
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

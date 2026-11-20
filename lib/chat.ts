export type Message = {
  role: "user" | "assistant";
  content: string;
};

export const maxPromptLength = 4000;
export const maxContextMessages = 19;
export const maxReplyLength = 12000;

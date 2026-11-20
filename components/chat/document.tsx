import { memo, useCallback } from "react";
import { toast } from "sonner";
import { useArtifact } from "@/hooks/use-artifact";
import type { ArtifactKind } from "./artifact";
import { FileIcon, MessageIcon, PencilEditIcon } from "./icons";

const getActionText = (type: "create" | "update" | "request-suggestions") => {
  switch (type) {
    case "create":
      return "Created";
    case "update":
      return "Updated";
    case "request-suggestions":
      return "Added suggestions to";
    default:
      return null;
  }
};

type DocumentToolResultProps = {
  type: "create" | "update" | "request-suggestions";
  result: { id: string; title: string; kind: ArtifactKind };
  isReadonly: boolean;
};

function PureDocumentToolResult({
  type,
  result,
  isReadonly,
}: DocumentToolResultProps) {
  const { setArtifact } = useArtifact();
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (isReadonly) {
        toast.error(
          "Viewing files in shared chats is currently not supported."
        );
        return;
      }

      const rect = event.currentTarget.getBoundingClientRect();

      const boundingBox = {
        height: rect.height,
        left: rect.left,
        top: rect.top,
        width: rect.width,
      };

      setArtifact((currentArtifact) => ({
        boundingBox,
        content: currentArtifact.content,
        documentId: result.id,
        isVisible: true,
        kind: result.kind,
        status: "idle",
        title: result.title,
      }));
    },
    [isReadonly, result, setArtifact]
  );

  return (
    <button
      className="flex w-fit cursor-pointer flex-row items-center gap-2 rounded-xl border bg-background px-3 py-2"
      onClick={handleClick}
      type="button"
    >
      <div className="text-muted-foreground">
        {type === "create" ? (
          <FileIcon />
        ) : type === "update" ? (
          <PencilEditIcon />
        ) : type === "request-suggestions" ? (
          <MessageIcon />
        ) : null}
      </div>
      <div className="text-left">
        {`${getActionText(type)} "${result.title}"`}
      </div>
    </button>
  );
}

export const DocumentToolResult = memo(PureDocumentToolResult, () => true);

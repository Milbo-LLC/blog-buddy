import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalEditor } from "lexical";

function useFloatingAIToolbar(
  editor: LexicalEditor,
  anchorElem: HTMLElement
): JSX.Element | null {
  console.log("useFloatingAIToolbar - editor: ", editor);
  return null;
}

export default function FloatingAIToolbarPlugin({
  anchorElem,
}: {
  anchorElem?: HTMLElement;
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  // return useFloatingAIToolbar(editor, anchorElem);
  return null;
}

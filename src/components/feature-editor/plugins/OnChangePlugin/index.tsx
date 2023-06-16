import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { EditorState } from "lexical";
import { useEffect } from "react";

// Props for OnChangePlugin
interface OnChangePluginProps {
  onChange: (editorState: EditorState) => void;
}

export default function OnChangePlugin(props: OnChangePluginProps): null {
  // Destructure props
  const { onChange } = props;

  // Grab Lexical editor state
  const [editor] = useLexicalComposerContext();

  // Register update listener
  useEffect(() => {
    editor.registerUpdateListener(({ editorState }) => {
      onChange(editorState);
    });
  }, [editor, onChange]);

  return null;
}

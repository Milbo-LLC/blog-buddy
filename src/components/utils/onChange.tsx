import { EditorState } from "lexical";

export default function onChange(editorState: EditorState) {
  // if (activeNote) {
  //   setActiveNote({
  //     ...activeNote,
  //     editorState: JSON.stringify(editorState),
  //   });
  // }
  console.log("onChange - editorState: ", editorState);
}

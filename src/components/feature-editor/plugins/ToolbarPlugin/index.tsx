import { IconType } from "react-icons";
import { MdPhoto, MdAddPhotoAlternate } from "react-icons/md";
import useModal from "@/components/utils/hooks/useModal";
import { InsertImageDialog } from "../ImagesPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState } from "react";
import { COMMAND_PRIORITY_CRITICAL, SELECTION_CHANGE_COMMAND } from "lexical";
import { Tooltip } from "@mui/material";

function ToolbarButton({
  Icon,
  label,
  altText,
  onClick,
  disabled,
}: {
  Icon: IconType;
  label: string;
  altText?: string;
  onClick?: () => void;
  disabled?: string;
}): JSX.Element {
  return (
    <Tooltip title={altText || disabled} arrow>
      <button
        className={`flex w-fit items-center gap-1 p-2 hover:bg-white/20 rounded-lg ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
        onClick={onClick}
        disabled={Boolean(disabled)}
      >
        <Icon className="text-2xl" />
        <div>{label}</div>
      </button>
    </Tooltip>
  );
}

export default function ToolbarPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [modal, showModal] = useModal();

  useEffect(() => {
    console.log("EDITOR USEEFFECT");
    setActiveEditor(editor);
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor]);

  return (
    <div className="flex gap-2 -mx-2">
      <ToolbarButton label="Add cover" Icon={MdPhoto} disabled="Coming soon!" />
      <ToolbarButton
        label="Insert image"
        Icon={MdAddPhotoAlternate}
        onClick={() => {
          showModal("Insert Image", (onClose) => (
            <InsertImageDialog activeEditor={activeEditor} onClose={onClose} />
          ));
        }}
      />
      {modal}
    </div>
  );
}

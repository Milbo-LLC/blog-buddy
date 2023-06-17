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
}: {
  Icon: IconType;
  label: string;
  altText?: string;
  onClick?: () => void;
}): JSX.Element {
  return (
    <Tooltip title={altText} arrow>
      <div
        className="flex w-fit items-center gap-1 p-2 hover:bg-white/20 rounded-lg cursor-pointer"
        onClick={onClick}
      >
        <Icon className="text-2xl" />
        <div>{label}</div>
      </div>
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
      <ToolbarButton label="Add cover" Icon={MdPhoto} />
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

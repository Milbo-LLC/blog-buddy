import { IconType } from "react-icons";
import { MdPhoto, MdAddPhotoAlternate } from "react-icons/md";
import useModal from "@/components/utils/hooks/useModal";
import { InsertImageDialog } from "../ImagesPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

function ToolbarButton({
  Icon,
  label,
  onClick,
}: {
  Icon: IconType;
  label: string;
  onClick?: () => void;
}): JSX.Element {
  return (
    <div
      className="flex w-fit items-center gap-1 p-2 hover:bg-white/20 rounded-lg cursor-pointer"
      onClick={onClick}
    >
      <Icon className="text-2xl" />
      <div>{label}</div>
    </div>
  );
}

export default function ToolbarPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [modal, showModal] = useModal();

  return (
    <div className="flex gap-2 -mx-2">
      <ToolbarButton label="Add cover" Icon={MdPhoto} />
      <ToolbarButton
        label="Insert image"
        Icon={MdAddPhotoAlternate}
        onClick={() => {
          showModal("Insert Image", (onClose) => (
            <InsertImageDialog activeEditor={editor} onClose={onClose} />
          ));
        }}
      />
      {modal}
    </div>
  );
}

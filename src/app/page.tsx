import Editor from "@/components/feature-editor/editor";
import Page from "@/components/ui/pages/Page";
import { MdPhoto } from "react-icons/md";

export default function Home() {
  return (
    <Page>
      <div className="flex w-full h-full justify-center">
        <div className="flex flex-col gap-2 w-full h-full max-w-4xl">
          <div className="flex w-fit items-center gap-1 p-2 hover:bg-white/20 rounded-lg cursor-pointer">
            <MdPhoto className="text-2xl" />
            <div>Add cover</div>
          </div>
          <input
            className="text-4xl font-bold pl-2 outline-none bg-transparent"
            placeholder="Untitled"
          />
          <Editor />
        </div>
      </div>
    </Page>
  );
}

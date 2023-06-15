import Editor from "@/components/feature-editor/editor";
import Page from "@/components/ui/pages/Page";
import { MdPhoto } from "react-icons/md";

export default function Home() {
  return (
    <Page>
      <div className="flex w-full h-full justify-center">
        <div className="flex flex-col gap-2 w-full h-full max-w-4xl">
          <Editor />
        </div>
      </div>
    </Page>
  );
}

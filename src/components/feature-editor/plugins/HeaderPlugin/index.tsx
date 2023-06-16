import { DateTime } from "luxon";
import { useState } from "react";

export default function HeaderPlugin(): JSX.Element {
  // State variables
  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [publicationDate, setPublicationDate] = useState<string>(
    DateTime.now().toFormat("MMMM dd, yyyy")
  );

  return (
    <div className="flex flex-col gap-4">
      <input
        className="text-4xl font-bold outline-none bg-transparent"
        placeholder="Untitled"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="flex flex-col text-2xl justify-center gap-1">
        <div className="flex items-center gap-4">
          <input
            className="font-bold outline-none bg-transparent"
            style={{
              minWidth: "82px",
              width: (author.length < 8 ? 10 : 0) + author.length * 13 + "px",
            }}
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <span>•</span>
          <input
            className="flex flex-1 outline-none bg-transparent"
            placeholder={DateTime.now().toFormat("MMMM dd, yyyy")}
            value={publicationDate}
            onChange={(e) => setPublicationDate(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

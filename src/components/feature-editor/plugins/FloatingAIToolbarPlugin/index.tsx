import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  COMMAND_PRIORITY_LOW,
  LexicalEditor,
  SELECTION_CHANGE_COMMAND,
  $getRoot,
  $getSelection,
  $createTextNode,
  $createParagraphNode,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import * as React from "react";
import { createPortal } from "react-dom";
import { getDOMRangeRect } from "../../utils/getDOMRangeRect";
import { setFloatingElemPosition } from "../../utils/setFloatingElemPosition";
import { HiSparkles } from "react-icons/hi";
import { MdSend } from "react-icons/md";
import Image from "next/image";
import SendIcon from "@/assets/icons/send.svg";
import { ClipLoader } from "react-spinners";
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from "@lexical/markdown";

function FloatingAIToolbar({
  editor,
  anchorElem,
}: {
  editor: LexicalEditor;
  anchorElem: HTMLElement;
}): JSX.Element {
  const popupCharStylesEditorRef = useRef<HTMLDivElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [streamedData, setStreamedData] = useState("");

  useEffect(() => {
    console.log("streamed Data: ", streamedData);
  }, [streamedData]);

  function mouseMoveListener(e: MouseEvent) {
    if (
      popupCharStylesEditorRef?.current &&
      (e.buttons === 1 || e.buttons === 3)
    ) {
      if (popupCharStylesEditorRef.current.style.pointerEvents !== "none") {
        const x = e.clientX;
        const y = e.clientY;
        const elementUnderMouse = document.elementFromPoint(x, y);

        if (!popupCharStylesEditorRef.current.contains(elementUnderMouse)) {
          // Mouse is not over the target element => not a normal click, but probably a drag
          popupCharStylesEditorRef.current.style.pointerEvents = "none";
        }
      }
    }
  }
  function mouseUpListener(e: MouseEvent) {
    if (popupCharStylesEditorRef?.current) {
      if (popupCharStylesEditorRef.current.style.pointerEvents !== "auto") {
        popupCharStylesEditorRef.current.style.pointerEvents = "auto";
      }
    }
  }

  useEffect(() => {
    if (popupCharStylesEditorRef?.current) {
      document.addEventListener("mousemove", mouseMoveListener);
      document.addEventListener("mouseup", mouseUpListener);

      return () => {
        document.removeEventListener("mousemove", mouseMoveListener);
        document.removeEventListener("mouseup", mouseUpListener);
      };
    }
  }, [popupCharStylesEditorRef]);

  const clickEscFunction = useCallback(
    (event: any) => {
      const { id } = event.target;
      if (!id || !id.includes("floating-ai-toolbar")) {
        editor.focus();
        editor.update(() => {
          const lastChild = $getRoot().getLastChild();
          if (lastChild) {
            lastChild.clear();
          }
        });
      }
    },
    [editor]
  );

  useEffect(() => {
    document.addEventListener("click", clickEscFunction, false);

    return () => {
      document.removeEventListener("click", clickEscFunction, false);
    };
  }, [clickEscFunction]);

  const keyboardEscFunction = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        editor.focus();
        editor.update(() => {
          const lastChild = $getRoot().getLastChild();
          if (lastChild) {
            lastChild.clear();
          }
        });
      }
    },
    [editor]
  );

  useEffect(() => {
    document.addEventListener("keydown", keyboardEscFunction, false);

    return () => {
      document.removeEventListener("keydown", keyboardEscFunction, false);
    };
  }, [keyboardEscFunction]);

  const updateAIFloatingToolbar = useCallback(() => {
    const popupCharStylesEditorElem = popupCharStylesEditorRef.current;
    const nativeSelection = window.getSelection();

    if (popupCharStylesEditorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();
    if (rootElement !== null) {
      const rangeRect = getDOMRangeRect(nativeSelection!, rootElement);

      setFloatingElemPosition(rangeRect, popupCharStylesEditorElem, anchorElem);
    }
  }, [editor, anchorElem]);

  useEffect(() => {
    const scrollerElem = anchorElem.parentElement;

    const update = () => {
      editor.getEditorState().read(() => {
        updateAIFloatingToolbar();
      });
    };

    window.addEventListener("resize", update);
    if (scrollerElem) {
      scrollerElem.addEventListener("scroll", update);
    }

    return () => {
      window.removeEventListener("resize", update);
      if (scrollerElem) {
        scrollerElem.removeEventListener("scroll", update);
      }
    };
  }, [editor, updateAIFloatingToolbar, anchorElem]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateAIFloatingToolbar();
    });
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateAIFloatingToolbar();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateAIFloatingToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, updateAIFloatingToolbar]);

  const handleOpenAICall = async () => {
    setLoading(true);
    setPrompt("");
    try {
      const res = await fetch(`/api/ask-openai`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const reader = res.body!.getReader();

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        const text = new TextDecoder().decode(value);
        setStreamedData((prev: string) => prev + text);
        editor.focus();
        editor.update(() => {
          console.log("text: ", text);
          if (text.endsWith("\n\n")) {
            console.log("new line");
          }
          console.log("streamedData: ", streamedData);
          const selection = $getSelection();
          if (selection) {
            selection.insertText(text);
          }
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("error: ", error);
    }
  };

  return (
    <div
      ref={popupCharStylesEditorRef}
      className="flex bg-white p-2 absolute top-12 left-0 z-10 rounded-lg"
      id="floating-ai-toolbar"
    >
      {editor.isEditable() && (
        <div className="flex items-center gap-2">
          <HiSparkles className="text-lg" id="floating-ai-toolbar-icon" />
          <input
            className="outline-none bg-transparent"
            id="floating-ai-toolbar-input"
            placeholder="Ask AI to write anything."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div
            className={`flex p-2 ${
              !loading && "hover:bg-[#173F5F]"
            } hover:text-white rounded cursor-pointer`}
            id="floating-ai-toolbar-button"
          >
            <div
              className="flex relative items-center justify-center w-4 h-4"
              onClick={() => handleOpenAICall()}
            >
              {loading ? (
                <ClipLoader color="#173F5F" size={15} />
              ) : (
                <Image
                  className="text-white"
                  id="floating-ai-toolbar-button-icon"
                  fill
                  src={SendIcon}
                  alt={"send button"}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function useFloatingAIToolbarPlugin(
  editor: LexicalEditor,
  anchorElem: HTMLElement
): JSX.Element | null {
  // State variables
  const AI_COMMAND = " ";
  const [isOpen, setIsOpen] = useState(false);
  const [isText, setIsText] = useState(false);

  // Update popup when editor updated
  const updatePopup = useCallback(() => {
    editor.getEditorState().read(() => {
      const lastChild = $getRoot().getLastChild();
      const textContent = lastChild ? lastChild.getTextContent() : "";
      setIsText(Boolean(textContent));
      if (textContent === AI_COMMAND) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
      if (editor.isComposing()) {
        return;
      }
    });
  }, [editor]);

  // Listen for updates to selected content in editor
  useEffect(() => {
    document.addEventListener("selectionchange", updatePopup);
    return () => {
      document.removeEventListener("selectionchange", updatePopup);
    };
  }, [updatePopup]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(() => {
        updatePopup();
      }),
      editor.registerRootListener(() => {
        if (editor.getRootElement() === null) {
          setIsText(false);
        }
      })
    );
  }, [editor, updatePopup]);

  if (!isText || !isOpen) {
    return null;
  }

  document.getElementById("floating-ai-toolbar-input")?.focus();
  return createPortal(
    <FloatingAIToolbar editor={editor} anchorElem={anchorElem} />,
    anchorElem
  );
}

export default function FloatingAIoolbarPlugin({
  anchorElem,
}: {
  anchorElem?: HTMLElement;
}): JSX.Element | null {
  const [elem, setElem] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const body = document && document.body;
    setElem(anchorElem || body);
  }, [anchorElem]);

  const [editor] = useLexicalComposerContext();
  return useFloatingAIToolbarPlugin(editor, elem!);
}

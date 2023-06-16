import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  COMMAND_PRIORITY_LOW,
  LexicalEditor,
  SELECTION_CHANGE_COMMAND,
  $getRoot,
  $getSelection,
  $createTextNode,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import * as React from "react";
import { createPortal } from "react-dom";
import { getDOMRangeRect } from "../../utils/getDOMRangeRect";
import { setFloatingElemPosition } from "../../utils/setFloatingElemPosition";
import { HiSparkles } from "react-icons/hi";

function FloatingAIToolbar({
  editor,
  anchorElem,
}: {
  editor: LexicalEditor;
  anchorElem: HTMLElement;
}): JSX.Element {
  const popupCharStylesEditorRef = useRef<HTMLDivElement | null>(null);

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

  function backToEditor() {
    editor.focus();
    editor.update(() => {
      const lastChild = $getRoot().getLastChild();
      if (lastChild) {
        lastChild.clear();
      }
    });
  }

  const escFunction = useCallback(
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
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]);

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

  return (
    <div
      ref={popupCharStylesEditorRef}
      className="flex bg-white p-2 absolute top-12 left-0 z-10 rounded-lg"
      onBlur={() => backToEditor()}
    >
      {editor.isEditable() && (
        <div className="flex items-center gap-2">
          <HiSparkles className="text-lg" />
          <input
            className="outline-none bg-transparent"
            id="floating-ai-toolbar-input"
            placeholder="Ask AI to write anything."
          />
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

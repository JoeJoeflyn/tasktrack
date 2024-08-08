"use client";

import FileHandler from "@tiptap-pro/extension-file-handler";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import {
  BubbleMenu,
  EditorContent,
  JSONContent,
  ReactNodeViewRenderer,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { all, createLowlight } from "lowlight";
import codeBlock from "./codeBlock";
import { ColorHighlighter } from "./colorHighlighter";
import FloatingMenu from "./floatingMenu";
import { IconReplacer } from "./iconReplacer";
import "./styles.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCardId, updateCard } from "@/app/api";
import React from "react";

const lowlight = createLowlight(all);

const Tiptap = ({ cardId }: { cardId: string }) => {
  const queryClient = useQueryClient();
  const [isEditorFocused, setIsEditorFocused] = React.useState(false);

  const { data } = useQuery({
    queryKey: ["card", cardId],
    queryFn: () => getCardId(cardId),
  });

  const { mutate } = useMutation({
    mutationFn: updateCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      ColorHighlighter,
      IconReplacer,
      Typography,
      Image,
      HorizontalRule,
      Link.configure({
        openOnClick: true,
        autolink: true,
        defaultProtocol: "https",
      }),
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(codeBlock);
        },
      }).configure({ lowlight }),
      FileHandler.configure({
        allowedMimeTypes: [
          "image/png",
          "image/jpeg",
          "image/gif",
          "image/webp",
        ],
        onDrop: (currentEditor, files, pos) => {
          files.forEach((file) => {
            const fileReader = new FileReader();

            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
              currentEditor
                .chain()
                .insertContentAt(pos, {
                  type: "image",
                  attrs: {
                    src: fileReader.result,
                  },
                })
                .focus()
                .run();
            };
          });
        },
        onPaste: (currentEditor, files, htmlContent) => {
          files.forEach((file) => {
            if (htmlContent) {
              return false;
            }

            const fileReader = new FileReader();

            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
              currentEditor
                .chain()
                .insertContentAt(currentEditor.state.selection.anchor, {
                  type: "image",
                  attrs: {
                    src: fileReader.result,
                  },
                })
                .focus()
                .run();
            };
          });
        },
      }),
    ],
    immediatelyRender: false,
    onFocus: () => {
      setIsEditorFocused(true);
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none",
      },
    },
  });

  React.useEffect(() => {
    if (!editor) return;

    // Check if data.description is available and valid
    if (data?.description) {
      try {
        const parsedContent = JSON.parse(data.description);
        editor.commands.setContent(parsedContent);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }
  }, [data]);

  const handleSave = () => {
    const json = editor?.getJSON();
    mutate({ id: cardId, description: JSON.stringify(json) });
    setIsEditorFocused((prev) => !prev);
  };

  const handleCancel = () => {
    setIsEditorFocused((prev) => !prev);
  };

  return (
    <>
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <FloatingMenu editor={editor} />
        </BubbleMenu>
      )}
      <EditorContent
        className={`bg-[#22272b] p-5 ${
          isEditorFocused &&
          "ring-1 ring-[#738496] focus-within:ring-1 focus-within:ring-[#85b8ff]"
        }`}
        editor={editor}
      />
      {isEditorFocused && (
        <div className="mt-3 flex gap-1 justify-end">
          <button
            onClick={handleCancel}
            className="bg-[#a1bdd914] hover:bg-[#a6c5e229] py-1.5 px-3 font-medium text-sm rounded"
          >
            Cancel
          </button>
          <button
            className="bg-blue-400 hover:bg-[#85b8ff] text-[#1d2125] font-medium py-1.5 px-3 rounded"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      )}
    </>
  );
};

export default Tiptap;

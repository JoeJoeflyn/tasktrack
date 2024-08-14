"use client";

import { addImage, getCardId, updateCard } from "@/app/api";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import FileHandler from "@tiptap-pro/extension-file-handler";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
// import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Typography from "@tiptap/extension-typography";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import {
  BubbleMenu,
  Editor,
  EditorContent,
  ReactNodeViewRenderer,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { all, createLowlight } from "lowlight";
import React from "react";
import codeBlock from "./codeBlock";
import { ColorHighlighter } from "./colorHighlighter";
import FloatingMenu from "./floatingMenu";
import { IconReplacer } from "./iconReplacer";

import "./styles.css";

const lowlight = createLowlight(all);

const Tiptap = ({ cardId }: { cardId: string }) => {
  const queryClient = useQueryClient();
  const [isEditorFocused, setIsEditorFocused] = React.useState(false);

  const { data } = useSuspenseQuery({
    queryKey: ["card", cardId],
    queryFn: () => getCardId(cardId),
  });

  const { mutate: editCard } = useMutation({
    mutationFn: updateCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards", cardId] });
    },
  });

  const {
    mutate: uploadImage,
    mutateAsync,
    data: imageData,
  } = useMutation({
    mutationFn: addImage,
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      ColorHighlighter,
      IconReplacer,
      Typography,
      Image,
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
        onDrop: async (currentEditor, files, pos) => {
          for (const file of files) {
            const fileReader = new FileReader();

            // Convert the file to a Data URL for preview
            const dataUrlPromise = new Promise((resolve) => {
              fileReader.onload = () => resolve(fileReader.result);
              fileReader.readAsDataURL(file);
            });

            // Wait for the Data URL to be ready
            const dataUrl = await dataUrlPromise;

            // Insert the local preview of the image
            currentEditor
              .chain()
              .insertContentAt(pos, {
                type: "image",
                attrs: {
                  src: dataUrl,
                },
              })
              .focus()
              .run();

            try {
              // Upload the image and wait for the URL
              const data = await mutateAsync({ cardId, file });

              // If the upload was successful and the URL is available
              if (data[0]?.url) {
                // Replace the local preview with the uploaded image URL
                currentEditor
                  .chain()
                  .updateAttributes("image", {
                    src: data[0].url,
                  })
                  .focus()
                  .run();
              }
            } catch (error) {
              console.error("Upload failed", error);
              // Handle upload error (e.g., show notification)
            }
          }
        },
        onPaste: async (currentEditor, files, htmlContent) => {
          for (const file of files) {
            const fileReader = new FileReader();

            // Convert the file to a Data URL for preview
            const dataUrlPromise = new Promise((resolve) => {
              fileReader.onload = () => resolve(fileReader.result);
              fileReader.readAsDataURL(file);
            });

            // Wait for the Data URL to be ready
            const dataUrl = await dataUrlPromise;

            // Insert the local preview of the image
            currentEditor
              .chain()
              .insertContentAt(currentEditor.state.selection.anchor, {
                type: "image",
                attrs: {
                  src: dataUrl,
                },
              })
              .focus()
              .run();

            try {
              // Upload the image and wait for the URL
              const data = await mutateAsync({ cardId, file });

              // If the upload was successful and the URL is available
              if (data[0]?.url) {
                // Replace the local preview with the uploaded image URL
                currentEditor
                  .chain()
                  .updateAttributes("image", {
                    src: data[0].url,
                  })
                  .focus()
                  .run();
              }
            } catch (error) {
              console.error("Upload failed", error);
              // Handle upload error (e.g., show notification)
            }

            //   uploadImage({ cardId, file });
            //     currentEditor
            //       .chain()
            //       .insertContentAt(currentEditor.state.selection.anchor, {
            //         type: "image",
            //         attrs: {
            //           src: imageData.url,
            //         },
            //       })
            //       .focus()
            //       .run();
            // };
          }
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
    editCard({ id: cardId, description: JSON.stringify(json) });
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
      <React.Suspense fallback={""}>
        <EditorContent
          className={`bg-[#22272b] p-5 ${
            isEditorFocused &&
            "ring-1 ring-[#738496] focus-within:ring-1 focus-within:ring-[#85b8ff]"
          }`}
          editor={editor}
        />
      </React.Suspense>
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

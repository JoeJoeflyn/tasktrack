"use client";

import { addImage, deleteImage, getCardId, updateCard } from "@/app/api";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import FileHandler from "@tiptap-pro/extension-file-handler";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
// import Image from "@tiptap/extension-image";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import {
  BubbleMenu,
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

  const { mutateAsync } = useMutation({
    mutationFn: addImage,
  });

  const { mutate: deleteMutation } = useMutation({
    mutationFn: deleteImage,
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

            const dataUrlPromise = new Promise((resolve) => {
              fileReader.onload = () => resolve(fileReader.result);
              fileReader.readAsDataURL(file);
            });

            const dataUrl = await dataUrlPromise;

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
              const data = await mutateAsync({ cardId, file });
              console.log(data[0].id);
              if (data[0]?.url) {
                currentEditor
                  .chain()
                  .updateAttributes("image", {
                    src: data[0].url,
                    alt: data[0].id,
                    title: data[0].publicId,
                  })
                  .focus()
                  .run();
              }
            } catch (error) {
              console.error("Upload failed", error);
            }
          }
        },
        onPaste: async (currentEditor, files, htmlContent) => {
          for (const file of files) {
            const fileReader = new FileReader();

            const dataUrlPromise = new Promise((resolve) => {
              fileReader.onload = () => resolve(fileReader.result);
              fileReader.readAsDataURL(file);
            });

            const dataUrl = await dataUrlPromise;

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
              const data = await mutateAsync({ cardId, file });

              if (data[0]?.url) {
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
    onUpdate: ({ transaction }) => {
      const currentImageSrcs = new Set<string>();

      // Collect current image sources
      transaction.doc.forEach((node: any) => {
        if (node.type.name === "image" && node.attrs.src) {
          currentImageSrcs.add(node.attrs.src);
        }
      });

      // Identify images that were removed
      transaction.before.forEach((node: any) => {
        if (
          node.type.name === "image" &&
          node.attrs.src &&
          !currentImageSrcs.has(node.attrs.src)
        ) {
          deleteMutation(node.attrs.alt);
        }
      });
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
            "ring-1 ring-[#738496] focus-within:ring-1 focus-within:ring-[#85b8ff] max-h-[400px] overflow-auto box-border"
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
            onClick={() => {
              handleSave();
              handleCancel();
            }}
          >
            Save
          </button>
        </div>
      )}
    </>
  );
};

export default Tiptap;

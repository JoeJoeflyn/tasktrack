"use client";

import "./styles.css";
import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Typography from "@tiptap/extension-typography";
import {
  Bold,
  Code,
  Code2,
  Italic,
  Link as LinkIcon,
  Strikethrough,
  UnderlineIcon,
} from "lucide-react";
import { ColorHighlighter } from "./colorHighlighter";
import { IconReplacer } from "./iconReplacer";

const Tiptap = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      ColorHighlighter,
      IconReplacer,
      Typography,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
    ],
    immediatelyRender: false,
    autofocus: true,
    content: "<p>Hello World! 🌎️</p>",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none",
      },
    },
  });

  return (
    <>
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="inline-flex h-full leading-none gap-0.5 flex-row p-1 items-center rounded-lg bg-black shadow-sm border border-neutral-800">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`${
                editor.isActive("bold")
                  ? "bg-white/20"
                  : "bg-transparent hover:bg-zinc-900"
              } transition-colors h-8 px-2 rounded`}
            >
              <Bold size={20} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`${
                editor.isActive("italic")
                  ? "bg-white/20"
                  : "bg-transparent hover:bg-zinc-900"
              } transition-colors h-8 px-2 rounded`}
            >
              <Italic size={20} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`${
                editor.isActive("underline")
                  ? "bg-white/20"
                  : "bg-transparent hover:bg-zinc-900"
              } transition-colors h-8 px-2 rounded`}
            >
              <UnderlineIcon size={20} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`${
                editor.isActive("strike")
                  ? "bg-white/20"
                  : "bg-transparent hover:bg-zinc-900"
              } transition-colors h-8 px-2 rounded`}
            >
              <Strikethrough size={20} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={`${
                editor.isActive("code")
                  ? "bg-white/20"
                  : "bg-transparent hover:bg-zinc-900"
              } transition-colors h-8 px-2 rounded`}
            >
              <Code size={20} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`${
                editor.isActive("codeBlock")
                  ? "bg-white/20"
                  : "bg-transparent hover:bg-zinc-900"
              } transition-colors h-8 px-2 rounded`}
            >
              <Code2 size={20} />
            </button>
            {/* <button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`${
                editor.isActive("link")
                  ? "bg-white/20"
                  : "bg-transparent hover:bg-zinc-900"
              } transition-colors h-8 px-2 rounded`}
            >
              <LinkIcon size={20} />
            </button> */}
          </div>
        </BubbleMenu>
      )}
      <EditorContent
        className="bg-[#22272b] p-5 ring-1 ring-[#738496] focus-within:ring-1 focus-within:ring-[#85b8ff]"
        editor={editor}
      />
    </>
  );
};

export default Tiptap;

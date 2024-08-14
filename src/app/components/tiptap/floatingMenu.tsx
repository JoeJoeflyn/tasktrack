import { Editor } from "@tiptap/react";
import {
  Bold,
  Code,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link,
  Strikethrough,
  Pilcrow,
  UnderlineIcon,
  List,
  ListOrdered,
} from "lucide-react";
import React from "react";

const Popover: React.FC<{
  visible: boolean;
  onClose: () => void;
  onSubmit: (url: string) => void;
}> = React.memo(({ visible, onClose, onSubmit }) => {
  const [url, setUrl] = React.useState<string>("");
  const [isLinkEnabled, setIsLinkEnabled] = React.useState<boolean>(false);

  // Function to handle URL change
  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = event.target.value;
    setUrl(newUrl);
  };

  // Validate URL and update button state
  React.useEffect(() => {
    const validateUrl = (url: string) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    setIsLinkEnabled(validateUrl(url));
  }, [url]);

  const handleSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (isLinkEnabled) {
        onSubmit(url);
        setUrl("");
        onClose();
      }
    },
    [isLinkEnabled, url]
  );

  // Do not render if the popover is not visible
  if (!visible) return null;

  return (
    <div
      data-radix-popper-content-wrapper=""
      style={
        {
          position: "fixed",
          left: "0px",
          top: "0px",
          transform: "translate(380px, 37px)",
          minWidth: "max-content",
          "--radix-popper-transform-origin": "50% 0px",
          zIndex: "auto",
          "--radix-popper-available-width": "1282px",
          "--radix-popper-available-height": "834px",
          "--radix-popper-anchor-width": "34px",
          "--radix-popper-anchor-height": "32px",
        } as React.CSSProperties
      }
    >
      <div
        data-side="bottom"
        data-align="center"
        data-state="open"
        role="dialog"
        id="radix-:r9:"
        tabIndex={-1}
        style={
          {
            "--radix-popover-content-transform-origin": "50% 0px",
            "--radix-popover-content-available-width": "1282px",
            "--radix-popover-content-available-height": "834px",
            "--radix-popover-trigger-width": "34px",
            "--radix-popover-trigger-height": "32px",
          } as React.CSSProperties
        }
      >
        <div className="p-2 bg-black rounded-lg dark:bg-black shadow-sm">
          <form className="flex items-center gap-2" onSubmit={handleSubmit}>
            <label className="flex items-center gap-2 p-2 rounded-lg bg-neutral-900 cursor-text">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 flex-none text-white"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
              <input
                className="flex-1 bg-transparent outline-none min-w-[12rem] text-sm text-white"
                placeholder="Enter URL"
                type="url"
                value={url}
                onChange={handleUrlChange}
              />
            </label>
            <button
              className={`flex group items-center justify-center gap-2 text-sm font-semibold rounded-md whitespace-nowrap py-2 px-2 ${
                isLinkEnabled
                  ? "bg-white text-black"
                  : "bg-gray-500 text-black disabled:opacity-50"
              }`}
              type="submit"
              disabled={!isLinkEnabled}
            >
              Set Link
            </button>
          </form>
        </div>
      </div>
    </div>
  );
});

export default function FloatingMenu({ editor }: { editor: Editor }) {
  const [popoverVisible, setPopoverVisible] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const applyStyle = (style: string) => {
    switch (style) {
      case "paragraph":
        editor.chain().focus().setParagraph().run();
        break;
      case "heading1":
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case "heading2":
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case "heading3":
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      case "bulletList":
        editor.chain().focus().toggleBulletList().run();
        break;
      case "orderedList":
        editor.chain().focus().toggleOrderedList().run();
        break;
      default:
        break;
    }
    setIsDropdownOpen(false); // Close dropdown after applying style
  };

  const getCurrentIcon = () => {
    if (editor.isActive("heading", { level: 1 })) {
      return <Heading1 size={20} />;
    } else if (editor.isActive("heading", { level: 2 })) {
      return <Heading2 size={20} />;
    } else if (editor.isActive("heading", { level: 3 })) {
      return <Heading3 size={20} />;
    } else if (editor.isActive("bulletList")) {
      return <List size={20} />;
    } else if (editor.isActive("orderedList")) {
      return <ListOrdered size={20} />;
    } else {
      return <Pilcrow size={20} />; // Default to paragraph icon if no format is active
    }
  };

  const handleLinkSubmit = React.useCallback(
    (url: string) => {
      if (url === "") {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
      } else {
        editor
          .chain()
          .focus()
          .extendMarkRange("link")
          .setLink({ href: url })
          .run();
      }
      setPopoverVisible(false);
    },
    [editor]
  );

  const handlePopoverClose = React.useCallback(() => {
    setPopoverVisible(false);
  }, []);

  return (
    <div className="inline-flex h-full leading-none gap-0.5 flex-row p-1 items-center rounded-lg bg-black shadow-sm border border-neutral-800">
      <div className="relative inline-block text-left">
        <button
          onClick={toggleDropdown}
          className="transition-colors h-8 px-2 rounded bg-transparent hover:bg-zinc-900"
        >
          {getCurrentIcon()}
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              <button
                className="w-full flex justify-between text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => applyStyle("paragraph")}
              >
                Paragraph <Pilcrow size={20} />
              </button>
              <button
                className="w-full flex justify-between text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => applyStyle("heading1")}
              >
                Heading 1 <Heading1 size={20} />
              </button>
              <button
                className="w-full flex justify-between text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => applyStyle("heading2")}
              >
                Heading 2 <Heading2 size={20} />
              </button>
              <button
                className="w-full flex justify-between text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => applyStyle("heading3")}
              >
                Heading 3 <Heading3 size={20} />
              </button>
              <button
                className="w-full flex justify-between text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => applyStyle("bulletList")}
              >
                Bullet list <List size={20} />
              </button>
              <button
                className="w-full flex justify-between text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => applyStyle("orderedList")}
              >
                Order list <ListOrdered size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
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
      <button
        onClick={() => setPopoverVisible(!popoverVisible)}
        className={`${
          editor?.isActive("link")
            ? "bg-white/20"
            : "bg-transparent hover:bg-zinc-900"
        } transition-colors h-8 px-2 rounded`}
      >
        <Link size={20} />
      </button>
      {popoverVisible && (
        <Popover
          visible={popoverVisible}
          onClose={handlePopoverClose}
          onSubmit={handleLinkSubmit}
        />
      )}
    </div>
  );
}

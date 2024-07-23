import { withProps } from "@udecode/cn";
import {
  createPlugins,
  Plate,
  PlateElement,
  isBlockAboveEmpty,
  isSelectionAtBlockStart,
  RenderAfterEditable,
  PlateLeaf,
  PlateEditor,
} from "@udecode/plate-common";
import {
  createParagraphPlugin,
  ELEMENT_PARAGRAPH,
} from "@udecode/plate-paragraph";
import {
  createHeadingPlugin,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
} from "@udecode/plate-heading";
import {
  createHorizontalRulePlugin,
  ELEMENT_HR,
} from "@udecode/plate-horizontal-rule";
import {
  createListPlugin,
  ELEMENT_LI,
  ELEMENT_OL,
  ELEMENT_UL,
} from "@udecode/plate-list";
import {
  createBlockquotePlugin,
  ELEMENT_BLOCKQUOTE,
} from "@udecode/plate-block-quote";
import {
  createCodeBlockPlugin,
  ELEMENT_CODE_BLOCK,
  ELEMENT_CODE_LINE,
  ELEMENT_CODE_SYNTAX,
  isCodeBlockEmpty,
  isSelectionAtCodeBlockStart,
  unwrapCodeBlock,
} from "@udecode/plate-code-block";
import { createLinkPlugin, ELEMENT_LINK } from "@udecode/plate-link";
import {
  createImagePlugin,
  ELEMENT_IMAGE,
  createMediaEmbedPlugin,
  ELEMENT_MEDIA_EMBED,
  insertMedia,
} from "@udecode/plate-media";
import { createSelectOnBackspacePlugin } from "@udecode/plate-select";
import { createTogglePlugin, ELEMENT_TOGGLE } from "@udecode/plate-toggle";
import { createCaptionPlugin } from "@udecode/plate-caption";
import {
  createMentionPlugin,
  ELEMENT_MENTION,
  ELEMENT_MENTION_INPUT,
} from "@udecode/plate-mention";
import {
  createBoldPlugin,
  MARK_BOLD,
  createItalicPlugin,
  MARK_ITALIC,
  createUnderlinePlugin,
  MARK_UNDERLINE,
  createStrikethroughPlugin,
  MARK_STRIKETHROUGH,
  createCodePlugin,
  MARK_CODE,
  createSubscriptPlugin,
  MARK_SUBSCRIPT,
  createSuperscriptPlugin,
  MARK_SUPERSCRIPT,
} from "@udecode/plate-basic-marks";
import { createKbdPlugin, MARK_KBD } from "@udecode/plate-kbd";
import { createAutoformatPlugin } from "@udecode/plate-autoformat";
import { createBlockSelectionPlugin } from "@udecode/plate-selection";
import { createDndPlugin } from "@udecode/plate-dnd";
import { createEmojiPlugin } from "@udecode/plate-emoji";
import {
  createExitBreakPlugin,
  createSoftBreakPlugin,
} from "@udecode/plate-break";
import { createNodeIdPlugin } from "@udecode/plate-node-id";
import { createResetNodePlugin } from "@udecode/plate-reset-node";
import { createDeletePlugin } from "@udecode/plate-select";
import { createTabbablePlugin } from "@udecode/plate-tabbable";
import {
  createCommentsPlugin,
  CommentsProvider,
  MARK_COMMENT,
} from "@udecode/plate-comments";
import { createTrailingBlockPlugin } from "@udecode/plate-trailing-block";
import { createDeserializeDocxPlugin } from "@udecode/plate-serializer-docx";
import { createDeserializeCsvPlugin } from "@udecode/plate-serializer-csv";
import { createDeserializeMdPlugin } from "@udecode/plate-serializer-md";
import { createJuicePlugin } from "@udecode/plate-juice";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { BlockquoteElement } from "@/app/components/plate-ui/blockquote-element";
import { CodeBlockElement } from "@/app/components/plate-ui/code-block-element";
import { CodeLineElement } from "@/app/components/plate-ui/code-line-element";
import { CodeSyntaxLeaf } from "@/app/components/plate-ui/code-syntax-leaf";
import { ImageElement } from "@/app/components/plate-ui/image-element";
import { LinkElement } from "@/app/components/plate-ui/link-element";
import { LinkFloatingToolbar } from "@/app/components/plate-ui/link-floating-toolbar";
import { ToggleElement } from "@/app/components/plate-ui/toggle-element";
import { HeadingElement } from "@/app/components/plate-ui/heading-element";
import { MediaEmbedElement } from "@/app/components/plate-ui/media-embed-element";
import { MentionElement } from "@/app/components/plate-ui/mention-element";
import { MentionInputElement } from "@/app/components/plate-ui/mention-input-element";
import { ParagraphElement } from "@/app/components/plate-ui/paragraph-element";
import { CodeLeaf } from "@/app/components/plate-ui/code-leaf";
import { CommentLeaf } from "@/app/components/plate-ui/comment-leaf";
import { Prism } from "@/app/components/plate-ui/code-block-combobox";
import { CommentsPopover } from "@/app/components/plate-ui/comments-popover";
import { KbdLeaf } from "@/app/components/plate-ui/kbd-leaf";
import { Editor } from "@/app/components/plate-ui/editor";
import { FixedToolbar } from "@/app/components/plate-ui/fixed-toolbar";
import { FixedToolbarButtons } from "@/app/components/plate-ui/fixed-toolbar-buttons";
import { FloatingToolbar } from "@/app/components/plate-ui/floating-toolbar";
import { FloatingToolbarButtons } from "@/app/components/plate-ui/floating-toolbar-buttons";
import { withPlaceholders } from "@/app/components/plate-ui/placeholder";
import { withDraggables } from "@/app/components/plate-ui/with-draggables";
import { HrElement } from "@/app/components/plate-ui/hr-element";
import { ListElement } from "@/app/components/plate-ui/list-element";
import React from "react";
import { createLinkPreviewPlugin } from "./custom/linkConfigure";

const resetBlockTypesCommonRule = {
  types: [ELEMENT_BLOCKQUOTE],
  defaultType: ELEMENT_PARAGRAPH,
};

const resetBlockTypesCodeBlockRule = {
  types: [ELEMENT_CODE_BLOCK],
  defaultType: ELEMENT_PARAGRAPH,
  onReset: unwrapCodeBlock,
};

const plugins = createPlugins(
  [
    createParagraphPlugin(),
    createHeadingPlugin(),
    createBlockquotePlugin(),
    createCodeBlockPlugin({
      enabled: true,
      options: {
        prism: Prism,
      },
    }),
    createLinkPlugin({
      renderAfterEditable: LinkFloatingToolbar as RenderAfterEditable,
    }),
    createImagePlugin({
      enabled: true,
    }),
    createTogglePlugin(),
    createMediaEmbedPlugin({ enabled: true }),
    createSelectOnBackspacePlugin({
      options: {
        query: {
          allow: [ELEMENT_IMAGE, ELEMENT_MEDIA_EMBED],
        },
      },
    }),
    createCaptionPlugin({
      options: {
        pluginKeys: [ELEMENT_IMAGE, ELEMENT_MEDIA_EMBED],
      },
    }),
    createHorizontalRulePlugin({ enabled: true }),
    createListPlugin({ enabled: true }),
    createMentionPlugin(),
    createBoldPlugin(),
    createItalicPlugin(),
    createUnderlinePlugin(),
    createStrikethroughPlugin(),
    createCodePlugin(),
    createSubscriptPlugin(),
    createSuperscriptPlugin(),
    createKbdPlugin(),
    createAutoformatPlugin({
      options: {
        rules: [
          // Usage: https://platejs.org/docs/autoformat
        ],
        enableUndoOnDelete: true,
      },
    }),
    createBlockSelectionPlugin({
      options: {
        sizes: {
          top: 0,
          bottom: 0,
        },
      },
    }),
    createDndPlugin({
      options: { enableScroller: true },
    }),
    createEmojiPlugin({ enabled: true }),
    createExitBreakPlugin({
      options: {
        rules: [
          {
            hotkey: "mod+enter",
          },
          {
            hotkey: "mod+shift+enter",
            before: true,
          },
          {
            hotkey: "enter",
            query: {
              start: true,
              end: true,
              // allow: KEYS_HEADING,
            },
            relative: true,
            level: 1,
          },
        ],
      },
    }),
    createNodeIdPlugin(),
    createResetNodePlugin({
      options: {
        rules: [
          {
            ...resetBlockTypesCommonRule,
            hotkey: "Enter",
            predicate: isBlockAboveEmpty,
          },
          {
            ...resetBlockTypesCommonRule,
            hotkey: "Backspace",
            predicate: isSelectionAtBlockStart,
          },
          {
            ...resetBlockTypesCodeBlockRule,
            hotkey: "Enter",
            predicate: isCodeBlockEmpty,
          },
          {
            ...resetBlockTypesCodeBlockRule,
            hotkey: "Backspace",
            predicate: isSelectionAtCodeBlockStart,
          },
        ],
      },
    }),
    createDeletePlugin(),
    createSoftBreakPlugin({
      options: {
        rules: [
          { hotkey: "shift+enter" },
          {
            hotkey: "enter",
            query: {
              allow: [ELEMENT_CODE_BLOCK, ELEMENT_BLOCKQUOTE],
            },
          },
        ],
      },
    }),
    createTabbablePlugin(),
    createCommentsPlugin(),
    createTrailingBlockPlugin({
      options: { type: ELEMENT_PARAGRAPH },
    }),
    createDeserializeDocxPlugin(),
    createDeserializeCsvPlugin(),
    createDeserializeMdPlugin({ enabled: true }),
    createJuicePlugin(),
    createLinkPreviewPlugin(),
  ],
  {
    components: withDraggables(
      withPlaceholders({
        [ELEMENT_BLOCKQUOTE]: BlockquoteElement,
        [ELEMENT_CODE_BLOCK]: CodeBlockElement,
        [ELEMENT_CODE_LINE]: CodeLineElement,
        [ELEMENT_CODE_SYNTAX]: CodeSyntaxLeaf,
        [ELEMENT_IMAGE]: ImageElement,
        [ELEMENT_LINK]: LinkElement,
        [ELEMENT_TOGGLE]: ToggleElement,
        [ELEMENT_H1]: withProps(HeadingElement, { variant: "h1" }),
        [ELEMENT_H2]: withProps(HeadingElement, { variant: "h2" }),
        [ELEMENT_H3]: withProps(HeadingElement, { variant: "h3" }),
        [ELEMENT_H4]: withProps(HeadingElement, { variant: "h4" }),
        [ELEMENT_H5]: withProps(HeadingElement, { variant: "h5" }),
        [ELEMENT_H6]: withProps(HeadingElement, { variant: "h6" }),
        [ELEMENT_HR]: HrElement,
        [ELEMENT_LI]: withProps(PlateElement, { as: "li" }),
        [ELEMENT_UL]: withProps(ListElement, { variant: "ul" }),
        [ELEMENT_OL]: withProps(ListElement, { variant: "ol" }),
        [ELEMENT_MEDIA_EMBED]: MediaEmbedElement,
        [ELEMENT_MENTION]: MentionElement,
        [ELEMENT_MENTION_INPUT]: MentionInputElement,
        [ELEMENT_PARAGRAPH]: ParagraphElement,
        [MARK_BOLD]: withProps(PlateLeaf, { as: "strong" }),
        [MARK_CODE]: CodeLeaf,
        [MARK_COMMENT]: CommentLeaf,
        [MARK_ITALIC]: withProps(PlateLeaf, { as: "em" }),
        [MARK_KBD]: KbdLeaf,
        [MARK_STRIKETHROUGH]: withProps(PlateLeaf, { as: "s" }),
        [MARK_SUBSCRIPT]: withProps(PlateLeaf, { as: "sub" }),
        [MARK_SUPERSCRIPT]: withProps(PlateLeaf, { as: "sup" }),
        [MARK_UNDERLINE]: withProps(PlateLeaf, { as: "u" }),
      })
    ),
  }
);

const initialValue = [
  {
    id: "1",
    type: "p",
    children: [{ text: "Hello, World!" }],
  },
];

function createOnDropHandler(editor: PlateEditor) {
  return (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    console.log("event", event);
    console.log("editor", editor);

    if (event.dataTransfer.items) {
      for (let i = 0; i < event.dataTransfer.items.length; i++) {
        if (event.dataTransfer.items[i].kind === "file") {
          var file = event.dataTransfer.items[i].getAsFile();
          console.log("File Type: ", file?.type, "File Name: ", file?.name);
        }
      }
    } else {
      for (let i = 0; i < event.dataTransfer.files.length; i++) {
        console.log(
          "File Type: ",
          event.dataTransfer.files[i].type,
          "File Name: ",
          event.dataTransfer.files[i].name
        );
      }
    }

    return true;
  };
}

export const PlateComponent = () => {
  const editor = React.useRef<PlateEditor | null>(null);
  const onDrop = createOnDropHandler(editor?.current!);
  return (
    <DndProvider backend={HTML5Backend}>
      <CommentsProvider>
        <Plate plugins={plugins} initialValue={initialValue}>
          <div className="!ring-1 !ring-[#738496] focus-within:!ring-2 focus-within:!ring-[#85b8ff]">
            <FixedToolbar>
              <FixedToolbarButtons />
            </FixedToolbar>

            <Editor
              // onDrop={onDrop}
              className="bg-[#22272b] text-gray-400 rounded-sm !ring-0 !ring-offset-0 !border-none"
              placeholder="Type..."
            />

            <FloatingToolbar>
              <FloatingToolbarButtons />
            </FloatingToolbar>
            <CommentsPopover />
          </div>
        </Plate>
      </CommentsProvider>
    </DndProvider>
  );
};

export default PlateComponent;

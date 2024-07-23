import React from "react";

import { withRef } from "@udecode/cn";
import { focusEditor, useEditorRef } from "@udecode/plate-common";

import { replaceNodeChildren } from "@udecode/slate-utils";

import {
  deserializeMd,
  serializeMd,
  SerializeMdNodeOptions,
  SerializeMdOptions,
} from "@udecode/plate-serializer-md";
import { ToolbarButton } from "./toolbar";

export const ViewMarkdown = withRef<typeof ToolbarButton>((rest, ref) => {
  const editor = useEditorRef();
  const [showMarkdown, setShowMarkdown] = React.useState(false);
  const [markdownContent, setMarkdownContent] = React.useState("");

  const plugins = editor.plugins.filter((p) => p.isElement || p.isLeaf);

  const nodes = plugins.reduce((acc, plugin) => {
    (acc as any)[plugin.key] = {
      isLeaf: plugin.isLeaf,
      isVoid: plugin.isVoid,
      type: plugin.type,
    } as SerializeMdNodeOptions;

    return acc;
  }, {} as SerializeMdOptions["nodes"]);

  const item: any = {
    markdown: (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="icon icon-tabler icons-tabler-outline icon-tabler-markdown size-5"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M3 5m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
          <path d="M7 15v-6l2 2l2 -2v6" />
          <path d="M14 13l2 2l2 -2m-2 2v-6" />
        </svg>
      </>
    ),
  };

  const handleModeChange = () => {
    if (!showMarkdown) {
      const currentState = serializeMd(editor, { nodes });
      setMarkdownContent(currentState);

      const serializeMarkDown = serializeMd(editor, { nodes });

      replaceNodeChildren(editor, {
        at: [],
        nodes: [
          {
            type: "p",
            children: [
              {
                text: serializeMarkDown,
              },
            ],
          },
        ],
      });
    } else {
      const deserializeMarkDown = deserializeMd(editor, markdownContent);
      replaceNodeChildren(editor, {
        at: [],
        nodes: deserializeMarkDown,
      });

      focusEditor(editor);
    }

    setShowMarkdown(!showMarkdown);
  };

  return (
    <div
      className="flex items-center"
      role="group"
      dir="ltr"
      data-orientation="horizontal"
    >
      <ToolbarButton
        ref={ref}
        tooltip="View markdown"
        {...rest}
        onClick={handleModeChange}
      >
        {item.markdown}
      </ToolbarButton>
    </div>
  );
});

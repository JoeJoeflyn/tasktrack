import "./styles.css";

import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import React from "react";

interface NodeAttributes {
  language: string;
}

interface NodeProps {
  node: {
    attrs: NodeAttributes;
  };
  updateAttributes: (attributes: Partial<NodeAttributes>) => void;
  extension: {
    options: {
      lowlight: {
        listLanguages: () => string[];
      };
    };
  };
}
const CodeBlockComponent: React.FC<NodeProps> = ({
  node: {
    attrs: { language: defaultLanguage },
  },
  updateAttributes,
  extension,
}) => (
  <NodeViewWrapper className="code-block">
    <select
      contentEditable={false}
      defaultValue={defaultLanguage}
      onChange={(event) => updateAttributes({ language: event.target.value })}
    >
      <option value="null">auto</option>
      <option disabled>—</option>
      {extension.options.lowlight
        .listLanguages()
        .map((lang: string, index: number) => (
          <option key={index} value={lang}>
            {lang}
          </option>
        ))}
    </select>
    <pre>
      <NodeViewContent as="code" />
    </pre>
  </NodeViewWrapper>
);

export default CodeBlockComponent;

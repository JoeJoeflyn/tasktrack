import { Plate, PlateEditor } from "@udecode/plate-common";
import { createPluginFactory } from "@udecode/plate-core";

const ELEMENT_LINK_PREVIEW = "link_preview";

const getLinkPreviewComponent = () => {
  // Define your component to render the link preview
  // This could involve fetching preview data from a URL and displaying it
  return ({ attributes, children, element }: any) => (
    <div {...attributes}>
      {/* Render your link preview here, using element.url or similar */}
      <div>Link Preview for: {element.url}</div>
      {children}
    </div>
  );
};

export const createLinkPreviewPlugin = createPluginFactory({
  key: ELEMENT_LINK_PREVIEW,
  isElement: true,
  component: getLinkPreviewComponent(),
});

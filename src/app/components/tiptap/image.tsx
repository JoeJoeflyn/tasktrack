import { mergeAttributes, Node } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { useEffect, useState } from "react";

export interface ImageOptions {
  HTMLAttributes: Record<string, any>;
}

const blobToBase64 = async (blob: Blob): Promise<string> => {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    image: {
      /**
       * Add an image
       */
      setImage: (options: {
        src: string;
        alt?: string;
        title?: string;
      }) => ReturnType;
    };
  }
}

type ImageComponentProps = {
  node: {
    attrs: {
      src: string;
    };
  };
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

function ImageComponent(props: ImageComponentProps) {
  const { node } = props;

  // swap this for your API file upload code

  const [src, setSrc] = useState<string | undefined>(node?.attrs?.src);

  useEffect(() => {
    if (node.attrs.src.startsWith("data:")) {
      const uploadImage = async () => {
        // Using an arrow function here
        const formData = new FormData();
        const base64 = node.attrs.src.split(",")[1];
        const file = window.atob(base64);

        formData.set(
          "file",
          new Blob([file], { type: "image/png" }),
          "image.png"
        );

        const uploadedFile = await await fetch(`${BASE_URL}/api/v1/images`, {
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        //  upload({
        //     body: formData,
        //     headers: {
        //         'Content-Type': 'multipart/form-data',
        //     },
        // });

        if (!uploadedFile) return;
        setSrc(uploadedFile.url);
      };

      uploadImage();
    }
  }, [node.attrs.src]);

  return (
    <NodeViewWrapper className="w-full">
      <img src={src} className="w-full" />
    </NodeViewWrapper>
  );
}

export const Image = Node.create<ImageOptions>({
  name: "image",

  addOptions() {
    return {
      inline: false,
      allowBase64: false,
      HTMLAttributes: {},
    };
  },

  inline: false,
  group: "block",

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]:not([src^="data:"])',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "img",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageComponent);
  },

  addCommands() {
    return {
      setImage:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("imageDrop"),
        props: {
          handleDOMEvents: {
            drop: (view, event) => {
              if (event?.dataTransfer?.files) {
                const files = event.dataTransfer.files;
                const file = files.item(0);

                if (file && file.type.includes("image")) {
                  // Convert the file to base64 and then set the image
                  blobToBase64(file).then((dataUrl) => {
                    this.editor.chain().setImage({ src: dataUrl }).run();
                  });

                  return true;
                }
              }

              return false;
            },
          },
        },
      }),
    ];
  },
});

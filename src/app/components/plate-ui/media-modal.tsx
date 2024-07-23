"use client";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { useEditorRef } from "@udecode/plate-common";
import { insertMedia, ELEMENT_IMAGE } from "@udecode/plate-media";
import React from "react";

export const MediaModal: React.FC<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ open, setOpen }) => {
  const [imageSrcs, setImageSrcs] = React.useState<
    { src: string; name: string }[]
  >([]);
  const [hoveredImage, setHoveredImage] = React.useState<number | null>(null);
  const editor = useEditorRef();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleInsertMedia = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = inputRef.current?.value;
    if (!url) return;

    try {
      setImageSrcs((prevImageSrcs) => [
        ...prevImageSrcs,
        { src: url!, name: url as string },
      ]);

      if (inputRef.current) inputRef.current.value = "";
    } catch (error) {
      console.error("Failed to insert media:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (typeof e.target?.result === "string") {
          setImageSrcs((prevImageSrcs) => [
            ...prevImageSrcs,
            { src: e.target?.result as string, name: file.name },
          ]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onMouseEnter = React.useCallback(
    (index: number) => {
      setHoveredImage(index);
    },
    [hoveredImage]
  );

  const onMouseLeave = React.useCallback(() => {
    setHoveredImage(null);
  }, [hoveredImage]);

  return (
    <Transition show={open}>
      <Dialog className="relative z-10" onClose={setOpen}>
        <TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 backdrop-blur-0"
            style={{ backgroundColor: "hsla(0, 0%, 0%, 0.6)" }}
          />
        </TransitionChild>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-[#282e33] text-gray-400">
                  {/* Card header */}
                  <div className="relative">
                    <div className="mx-6 py-3 border-b border-b-[#a6c5e229]">
                      <button
                        onClick={() => setOpen((prev) => !prev)}
                        className="absolute top-2 right-4 hover:bg-[#a6c5e229] cursor-pointer p-1.5 rounded-full"
                      >
                        <svg
                          width="24"
                          height="24"
                          role="presentation"
                          focusable="false"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </button>
                      <div className="flex justify-center">
                        <span className="font-medium text-lg">
                          Select image
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Body */}

                  {imageSrcs.length > 0 && (
                    <div className="flex flex-col gap-3 px-6 pb-4 mt-3">
                      <label className="font-semibold text-sm" htmlFor="Image">
                        Recently uploaded
                      </label>
                      <div className="flex flex-wrap gap-4 items-center">
                        {imageSrcs.map((imageSrc, index) => (
                          <div
                            className="relative w-36 h-20 bg-zinc-500 rounded overflow-hidden cursor-pointer"
                            onMouseEnter={() => onMouseEnter(index)}
                            onMouseLeave={onMouseLeave}
                            onClick={async () => {
                              await insertMedia(editor, {
                                getUrl: () => Promise.resolve(imageSrc.src),
                                type: ELEMENT_IMAGE,
                              });
                            }}
                            key={`image-${imageSrc.src}-${imageSrc.name}-${index}`}
                          >
                            <img
                              src={imageSrc.src}
                              alt="Selected"
                              className="w-full h-full object-cover rounded"
                            />
                            {hoveredImage === index && (
                              <div className="absolute bottom-0 left-0 right-0 h-5 bg-[#ffffff3d] bg-opacity-0 text-[#1d2125] overflow-hidden text-xs font-medium truncate whitespace-nowrap underline px-1 py-0.5">
                                {imageSrc.name}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 px-6 pb-4 mt-3">
                    {/* Main */}
                    <div className="flex-grow">
                      <div className="gap-5">
                        <form onSubmit={handleInsertMedia}>
                          <div className="flex flex-col gap-3">
                            <label
                              className="font-semibold text-sm"
                              htmlFor="Image"
                            >
                              Attach an image link
                            </label>
                            <div className="flex gap-2 items-center">
                              <input
                                ref={inputRef}
                                className="flex-grow bg-zinc-800 rounded-sm outline-none ring-1 ring-[#738496] py-1.5 px-3 text-sm"
                                type="text"
                                id="Image"
                                placeholder="https://example.com"
                                pattern="https://.*"
                              />
                              <button
                                type="submit"
                                className="bg-[#a1bdd914] hover:bg-[#a6c5e229] py-1.5 px-3 font-semibold text-sm rounded-sm"
                              >
                                Submit
                              </button>
                            </div>
                          </div>
                          <div className="mt-8 mb-3">
                            <label
                              tabIndex={0}
                              className="block text-center bg-[#a1bdd914] hover:bg-[#a6c5e229] w-full py-1.5 px-3 font-semibold outline-none rounded-sm cursor-pointer"
                              htmlFor="filepicker"
                              aria-label="Upload from your computer"
                            >
                              Upload from your computer
                            </label>
                            <input
                              type="file"
                              id="filepicker"
                              name="filepicker"
                              accept="image/bmp, image/gif, image/jpg, image/jpeg, image/png, image/webp"
                              className="hidden"
                              onChange={handleFileChange}
                            />
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

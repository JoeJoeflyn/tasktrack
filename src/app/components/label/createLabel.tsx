import React from "react";
import { colorPairs } from "../../shared/colors";
import { Color } from "../../shared/interface";
import { CloseButton } from "./closeButton";
import Confirm from "./confirm";
import { useQueryColor } from "./queryColor";

const DEFAULT_COLOR = "#216e4e";

const ColorPicker = ({
  setEditingColor,
  selectedColor,
  setSelectedColor,
}: {
  setEditingColor: React.Dispatch<React.SetStateAction<string>>;
  selectedColor: string;
  setSelectedColor: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const divRefs = React.useRef<React.RefObject<HTMLDivElement>[]>([]);

  const handleClick = (index: number, bgColor: string) => {
    setSelectedColor(bgColor);
    setEditingColor("");
    const currentDiv = divRefs?.current[index]?.current;
    if (currentDiv) {
      currentDiv.focus();
    }
  };

  return (
    <div className="grid grid-cols-5 gap-2">
      {colorPairs.map(({ bgColor, color: itemColor }, index) => (
        <div className="has-tooltip" key={index}>
          <div
            ref={divRefs.current[index]}
            style={{ backgroundColor: bgColor }}
            className={`relative h-8 inset-0 cursor-pointer ${
              selectedColor === bgColor &&
              "after:content-[''] after:inset-0 after:absolute after:border-2 after:border-[#161a1d] border-2 border-[#579dff]"
            } rounded-sm`}
            tabIndex={0}
            onClick={() => handleClick(index, bgColor)}
          ></div>
          <span className="tooltip max-w-52 bg-[#9fadbc] text-[#1d2125] text-xs px-2 py-0.5 mt-1 rounded-sm">
            {itemColor}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function CreateLabel({
  mode,
  setMode,
  editing,
  setEditing,
  setIsCreating,
}: {
  mode: boolean;
  setMode: React.Dispatch<React.SetStateAction<boolean>>;
  editing: {
    id: string;
    bgColor: string;
  };
  setEditing: React.Dispatch<
    React.SetStateAction<{
      id: string;
      bgColor: string;
    }>
  >;
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {
    addMutate,
    isAddPending,
    isAddSuccess,
    updateMutate,
    isUpdatePending,
    isUpdateSuccess,
    color: colorItem,
  } = useQueryColor(editing?.id);
  const bgRemoveColor = "#282e33";
  const [selectedColor, setSelectedColor] = React.useState(DEFAULT_COLOR);
  const [editingColor, setEditingColor] = React.useState(editing.bgColor);
  const [confirm, setConfirm] = React.useState(false);
  const [title, setTitle] = React.useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      setIsCreating((prev) => !prev);
      return;
    }

    const newColor: Partial<Color> = {
      title,
      color: selectedColor,
      boardId: "b1251957-c1a8-4eb3-8ae9-a721025098d8",
    };

    if (!editing?.id) {
      addMutate(newColor as Color);
    } else {
      const updatedColor = { ...newColor, id: editing?.id } as Color;
      updateMutate(updatedColor);
    }

    setEditing({ id: "", bgColor: "" });
  };

  React.useEffect(() => {
    if (isAddSuccess || isUpdateSuccess) {
      setIsCreating((prev) => !prev);
    }
  }, [isAddSuccess, isUpdateSuccess]);

  React.useEffect(() => {
    if (editing.bgColor) {
      setEditingColor(editing.bgColor);
      setSelectedColor(editing.bgColor);
    }
  }, [editing.bgColor]);

  return confirm ? (
    <Confirm setConfirm={setConfirm} />
  ) : (
    <form
      onSubmit={(e) => handleSubmit(e)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleSubmit(e);
        }
      }}
    >
      <div className="p-3">
        <div className="grid grid-cols-[32px,1fr,32px] items-center mb-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsCreating((prev) => !prev);
              setEditing({ id: "", bgColor: "" });
              setMode(false);
            }}
            className="flex items-center justify-center hover:bg-[#a6c5e229] p-1.5 rounded-lg focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <div className="col-span-1 flex justify-center">
            <span className="font-bold">Create label</span>
          </div>
          <CloseButton />
        </div>
        <div className="bg-zinc-900 p-8 -mx-3">
          <div
            style={{ backgroundColor: editingColor || selectedColor }}
            className="h-8 rounded"
          >
            <div className="has-tooltip flex-grow">
              <span className="flex items-center font-semibold h-8 text-[#1d2125] px-3 rounded">
                {colorItem?.title}
              </span>
              <span className="tooltip max-w-52 bg-[#9fadbc] text-[#1d2125] text-xs px-2 py-0.5 mt-1 rounded-sm">
                color:{" "}
                {
                  colorPairs.find((pair) => pair.bgColor === editing.bgColor)
                    ?.color
                }
                , title: {colorItem?.title || "none"}
              </span>
            </div>
          </div>
        </div>
        <div>
          <p className="mt-3 mb-2">Title</p>
          <input
            type="text"
            className="w-full outline-none px-3 py-2 bg-zinc-800 text-gray-400 rounded-sm ring-1 ring-[#738496] focus-within:ring-2 focus-within:ring-[#85b8ff]"
            value={title || colorItem?.title || ""}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <p className="mt-3 mb-2">Select a color</p>
          <ColorPicker
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            setEditingColor={setEditingColor}
          />
        </div>
        <div className="my-3 font-bold">
          <button
            onClick={(e) => {
              e.preventDefault();
              setSelectedColor(bgRemoveColor);
              setEditingColor("");
            }}
            className="bg-[#a1bdd914] hover:bg-[#a6c5e229] flex justify-center items-center gap-2 w-full py-1.5 px-3 font-semibold text-sm rounded-sm"
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </span>
            Remove color
          </button>
        </div>
        <hr className="bg-[#a6c5e229] h-px border-none" />
        <div className="flex justify-between mt-3 font-semibold">
          <button
            className="bg-blue-400 hover:bg-[#85b8ff] text-[#1d2125] py-1.5 px-3 rounded"
            type="submit"
            disabled={isAddPending || isUpdatePending}
          >
            {isAddPending || isUpdatePending ? (
              <div
                className="inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                role="status"
              >
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Loading...
                </span>
              </div>
            ) : mode ? (
              "Save"
            ) : (
              "Create"
            )}
          </button>
          {mode && (
            <button
              className="bg-[#f87168] hover:bg-[#fd9891] text-[#1d2125] py-1.5 px-3 rounded"
              onClick={() => setConfirm((prev) => !prev)}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

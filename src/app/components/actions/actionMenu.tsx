import React from "react";

export default function ActionMenu({
  listId,
  setMode,
  setIsAdding,
  setIsFormVisible,
}: {
  listId: string;
  setMode: React.Dispatch<React.SetStateAction<"copy" | "move" | "actions">>;
  setIsAdding: React.Dispatch<React.SetStateAction<string>>;
  setIsFormVisible: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className="py-3">
      <div className="grid grid-cols-[32px,1fr,32px] items-center px-3">
        <p></p>
        <p className="col-span-1 text-center font-semibold">List actions</p>
        <button
          onClick={close}
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
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div>
        <ul>
          <li>
            <button
              onClick={() => {
                setIsAdding(listId);
                setIsFormVisible(listId);
              }}
              className="px-3 py-1.5 w-full text-left font-normal hover:bg-[#a1bdd914]"
            >
              Add card
            </button>
          </li>
          <li>
            <button
              onClick={() => setMode("copy")}
              className="px-3 py-1.5 w-full text-left font-normal hover:bg-[#a1bdd914]"
            >
              Copy list
            </button>
          </li>
          <li>
            <button
              onClick={() => setMode("move")}
              className="px-3 py-1.5 w-full text-left font-normal hover:bg-[#a1bdd914]"
            >
              Move list
            </button>
          </li>
        </ul>
      </div>
      <div>
        <ul>
          <li className="block h-px bg-[#a6c5e229] my-2 mx-2.5 after:content-['']"></li>
          <li>
            <button
              onClick={() => {
                setIsAdding(listId);
                setIsFormVisible(listId);
              }}
              className="px-3 py-1.5 w-full text-left font-normal hover:bg-[#a1bdd914]"
            >
              Delete this list
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

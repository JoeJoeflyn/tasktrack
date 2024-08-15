import { addList } from "@/app/api";
import { List } from "@/app/shared/interface";
import { useClickOutside } from "@/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";

export const AddListForm: React.FC = () => {
  const params = useParams();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = React.useState(false);
  const [listTitle, setListTitle] = React.useState("");
  const formRef = React.useRef<HTMLFormElement>(null);

  const { mutate } = useMutation({
    mutationFn: addList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
  });

  useClickOutside(formRef, () => {
    setIsAdding(false);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (listTitle.trim() === "") return;

    // Fetch the current lists
    const currentLists = queryClient.getQueryData<List[]>(["lists"]);

    // Find the list with the highest position
    const highestPosition =
      currentLists?.reduce((max, list) => Math.max(max, list.position), 0) || 0;

    const list: Partial<List> = {
      boardId: params?.id as string,
      name: listTitle,
      position: highestPosition + 1024,
    };

    mutate(list as List);
    setListTitle("");
    setIsAdding(false);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="m-2 h-full min-w-72">
      {isAdding ? (
        <>
          <div className="bg-neutral-900 p-2 rounded-lg">
            <textarea
              value={listTitle}
              onChange={(e) => setListTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              rows={1}
              autoFocus
              placeholder="Enter a title for this list..."
              className="flex-grow outline-none px-2 py-1 rounded-lg resize-none w-full bg-[#22272b] text-[#b6c2cf]"
              style={{
                boxShadow: "inset 0 0 0 1px #738496",
              }}
            ></textarea>
            <div className="flex items-center gap-1 mt-2">
              <button
                className="bg-blue-400 hover:bg-[#85b8ff] text-[#1d2125] font-medium py-1.5 px-3 rounded"
                type="submit"
              >
                Add list
              </button>
              <button
                className="hover:bg-[#a6c5e229] text-gray-400 p-1.5 rounded"
                onClick={() => setIsAdding(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </>
      ) : (
        <div
          onClick={() => {
            setIsAdding(true);
          }}
          className="text-[#172b4d] flex gap-1 bg-[#ffffff3d] hover:bg-[#091e4224] py-1.5 px-2 cursor-pointer rounded-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          <span>Add another list</span>
        </div>
      )}
    </form>
  );
};

import React from "react";
import { CloseButton } from "./closeButton";

export default function Confirm({
  setConfirm,
}: {
  setConfirm: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <>
      <div className="p-3">
        <div className="grid grid-cols-[32px,1fr,32px] items-center mb-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              setConfirm((prev) => !prev);
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
            <span className="font-bold">Delete label</span>
          </div>
          <CloseButton />
        </div>
        <div>
          <p className="mb-2">
            This will remove this label from all cards. There is no undo.
          </p>
          <button
            className="w-full bg-[#f87168] hover:bg-[#fd9891] font-bold text-[#1d2125] py-1.5 px-3 rounded"
            onClick={() => setConfirm((prev) => !prev)}
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
}

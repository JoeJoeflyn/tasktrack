import {
  PopoverButton,
  Popover as PopoverComponent,
  PopoverGroup,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import React from "react";
import Actions from "../actions";

export const ListPopover: React.FC<{
  listId: string;
  setIsAdding: React.Dispatch<React.SetStateAction<string>>;
  setIsFormVisible: React.Dispatch<React.SetStateAction<string>>;
  children?: React.ReactNode;
}> = ({ listId, setIsAdding, setIsFormVisible, children }) => {
  return (
    <PopoverGroup className="flex gap-x-12">
      <PopoverComponent className="relative">
        {({ open, close }) => {
          return (
            <>
              <PopoverButton className="flex items-center justify-center focus:outline-none">
                <p className="hover:bg-[#a6c5e229] p-2 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                    />
                  </svg>
                </p>
              </PopoverButton>

              <Transition
                show={open}
                as={React.Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <PopoverPanel className="absolute left-0 top-full z-10 text-sm mt-3 w-80 max-w-80 cursor-default rounded-lg bg-[#282e33] ring-1 ring-gray-700">
                  <Actions
                    setIsAdding={setIsAdding}
                    setIsFormVisible={setIsFormVisible}
                    listId={listId}
                  />
                </PopoverPanel>
              </Transition>
            </>
          );
        }}
      </PopoverComponent>
    </PopoverGroup>
  );
};

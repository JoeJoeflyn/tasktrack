import {
  PopoverButton,
  Popover as PopoverComponent,
  PopoverGroup,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import React from "react";
import { useQueryColor } from "../label/queryColor";
import { colorPairs } from "../../shared/colors";

export const CardPopover: React.FC<{
  children: React.ReactNode;
  action?: string;
  icon?: string;
}> = ({ children, action, icon }) => {
  const { colors } = useQueryColor();

  return (
    <PopoverGroup className="flex gap-x-12">
      <PopoverComponent className="relative">
        {({ open, close }) => {
          return (
            <>
              <PopoverButton className="focus:outline-none cursor-default">
                {icon ? (
                  <div className="flex items-center gap-2 bg-[#2c333a] hover:bg-[#454f59] cursor-pointer py-1.5 pr-3 pl-2.5 rounded">
                    <div dangerouslySetInnerHTML={{ __html: icon }} />
                    {action}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {colors?.cardColors
                      ?.sort(
                        (a, b) =>
                          new Date(a.color.createdAt!).getTime() -
                          new Date(b.color.createdAt!).getTime()
                      )
                      .map(({ color, isChecked }, index) => {
                        const matchingPair = colorPairs.find(
                          (pair) => pair.bgColor === color.color
                        );
                        return (
                          isChecked && (
                            <div
                              key={index}
                              className="has-tooltip cursor-pointer"
                            >
                              <span
                                className="flex items-center font-semibold h-8 text-[#1d2125] px-3 rounded"
                                style={{ backgroundColor: color.color }}
                                onMouseEnter={(e) => {
                                  if (matchingPair) {
                                    e.currentTarget.style.backgroundColor =
                                      matchingPair.hoverBgColor;
                                  }
                                }}
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.backgroundColor =
                                    color.color)
                                }
                              >
                                {color.title}
                              </span>
                              <span className="tooltip min-w-52 bg-[#9fadbc] text-[#1d2125] text-left text-xs px-2 py-0.5 mt-1 rounded-sm">
                                color: {matchingPair?.color.toLowerCase()},
                                title: {color.title || "none"}
                              </span>
                            </div>
                          )
                        );
                      })}
                    <div className="text-sm px-2 py-1.5 bg-[#a1bdd914] hover:bg-[#a6c5e229] rounded cursor-pointer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        width="20"
                        height="20"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>
                    </div>
                  </div>
                )}
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
                <PopoverPanel className="absolute left-0 top-full z-10 mt-3 w-80 max-w-80 cursor-default rounded-lg bg-[#282e33] shadow-[0px_8px_12px_#091e4226,0px_0px_1px_#091e424f] ring-1 ring-gray-700">
                  {children}
                </PopoverPanel>
              </Transition>
            </>
          );
        }}
      </PopoverComponent>
    </PopoverGroup>
  );
};

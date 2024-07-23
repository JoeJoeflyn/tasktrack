"use client";
import { CardActions, CardActionsObject } from "@/app/shared/actions";
import { useMyContext } from "@/hooks/useMyContext";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { useSession } from "next-auth/react";
import React from "react";
import { CardPopover } from "../cardPopover";
import Tiptap from "../tiptap";

const Modal = () => {
  const { data: session } = useSession();
  const { cardDetail, open, setOpen } = useMyContext();

  const [isWatching, setIsWatching] = React.useState(false);

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

        <div className="fixed inset-0 z-10 w-screen overflow-x-hidden overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative transform rounded-lg text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-screen-md">
                <div className="bg-[#282e33] text-gray-400">
                  {/* Card header */}
                  <div className="relative px-14 py-5">
                    <span className="absolute top-5 left-4">
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
                          d="M5 5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5ZM19 7H5V13H19V7ZM17 16C17 16.5523 17.4477 17 18 17C18.5523 17 19 16.5523 19 16C19 15.4477 18.5523 15 18 15C17.4477 15 17 15.4477 17 16ZM6 17C5.44772 17 5 16.5523 5 16C5 15.4477 5.44772 15 6 15H10C10.5523 15 11 15.4477 11 16C11 16.5523 10.5523 17 10 17H6Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </span>
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
                    <div className="flex flex-col flex-grow">
                      <span className="font-semibold text-xl">
                        {cardDetail.name}
                      </span>
                      <p className="flex items-center gap-3">
                        <span className="underline">Testing</span>
                        {isWatching && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                          </svg>
                        )}
                      </p>
                    </div>
                  </div>
                  {/* Body */}
                  <div className="flex gap-4 px-4">
                    {/* Main */}
                    <div className="flex-grow w-[552px]">
                      {/* header */}
                      <div className="flex flex-wrap ml-10 gap-5 mb-6 font-semibold">
                        <div>
                          <p className="text-xs">Members</p>
                          <div className="flex gap-1 mt-1">
                            {session && (
                              <img
                                className="w-8 h-8 rounded-2xl"
                                src={session.user?.image!}
                                alt={session.user?.name!}
                                srcSet={session.user?.image!}
                              />
                            )}
                            <div className="w-8 h-8 bg-white rounded-2xl"></div>
                            <div className="w-8 h-8 bg-[#a1bdd914] hover:bg-[#a6c5e229] rounded-2xl flex items-center justify-center cursor-pointer">
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
                                  d="M12 4.5v15m7.5-7.5h-15"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          <div className="font-semibold">
                            <p className="text-xs">Labels</p>
                            <div className="flex mt-1">
                              <CardPopover>
                                {CardActionsObject["editLabels"].component}
                              </CardPopover>
                            </div>
                          </div>
                          <div className="has-tooltip font-semibold">
                            <p className="text-xs">Notifications</p>
                            <div
                              onClick={() => setIsWatching((prev) => !prev)}
                              className="flex items-center justify-between gap-1.5 text-sm py-1.5 px-3 mt-1 bg-[#a1bdd914] hover:bg-[#a6c5e229] rounded cursor-pointer"
                            >
                              <span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="size-4"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                  />
                                </svg>
                              </span>
                              {isWatching ? "Watching" : "Watch"}
                              {isWatching && (
                                <span className="bg-[#8c9bab] text-[#1d2125] rounded-sm py-0.5 px-1">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-4"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="m4.5 12.75 6 6 9-13.5"
                                    />
                                  </svg>
                                </span>
                              )}
                            </div>
                            <span className="tooltip max-w-52 bg-[#9fadbc] text-[#1d2125] text-xs px-2 py-0.5 mt-1">
                              {isWatching
                                ? "You are receiving notifications for updates on this card (click to stop watching)"
                                : "Watch to get notifications for updates on this card"}
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* Body */}
                      <div className="relative">
                        <span className="absolute">
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
                              d="M4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H4ZM4 9C3.44772 9 3 9.44772 3 10C3 10.5523 3.44772 11 4 11H20C20.5523 11 21 10.5523 21 10C21 9.44772 20.5523 9 20 9H4ZM3 14C3 13.4477 3.44772 13 4 13H20C20.5523 13 21 13.4477 21 14C21 14.5523 20.5523 15 20 15H4C3.44772 15 3 14.5523 3 14ZM4 17C3.44772 17 3 17.4477 3 18C3 18.5523 3.44772 19 4 19H14C14.5523 19 15 18.5523 15 18C15 17.4477 14.5523 17 14 17H4Z"
                              fill="currentColor"
                            ></path>
                          </svg>
                        </span>
                        <div className="flex gap-5 ml-10 mb-5">
                          <p className="flex-grow font-semibold text-base">
                            Description
                          </p>
                          <button className="bg-[#a1bdd914] hover:bg-[#a6c5e229] py-1.5 px-3 font-medium text-sm rounded">
                            Edit
                          </button>
                        </div>
                        <div className="ml-10">
                          {/* <PlateComponent /> */}
                          <Tiptap />
                        </div>
                      </div>
                    </div>
                    {/* Sidebar */}
                    <div className="font-medium text-sm">
                      <div className="mb-6">
                        <p>Add to card</p>
                        <div className="flex flex-col gap-2 mt-2">
                          {CardActions.map(
                            ({ action, icon, component }, index) => (
                              <CardPopover
                                action={action}
                                icon={icon}
                                key={index}
                              >
                                {component}
                              </CardPopover>
                            )
                          )}
                        </div>
                      </div>
                      <div className="mb-6">
                        <p>Actions</p>
                        <div className="flex flex-col gap-2 mt-2">
                          {CardActions.map(
                            ({ action, icon, component }, index) => (
                              <CardPopover
                                action={action}
                                icon={icon}
                                key={index}
                              >
                                {component}
                              </CardPopover>
                            )
                          )}
                        </div>
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

export default Modal;

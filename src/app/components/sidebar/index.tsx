"use client";

import { addBoard, getBoards, updateBoard } from "@/app/api";
import { Board } from "@/app/shared/interface";
import {
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Ellipsis, Plus, Star } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import StarComponent from "./star";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar() {
  const params = useParams();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [isSidebarOpen, setSidebarOpen] = React.useState(true);
  const [isOpen, setIsOpen] = React.useState(false);
  const [sortOption, setSortOption] = React.useState({
    sortBy: "name",
    sortOrder: "asc",
  });

  const [selectedOption, setSelectedOption] = React.useState(
    "Sort alphabetically"
  );

  const inputRef = React.useRef<HTMLInputElement>(null);
  const dropdownRef = React.useRef(null);

  const [title, setTitle] = React.useState("");
  const [error, setError] = React.useState("");

  const { mutate } = useMutation({
    mutationFn: addBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards", sortOption] });
    },
  });

  const handleValidation = (value: string) => {
    if (value.trim() === "") {
      setError("Board title is required.");
    } else {
      setError("");
    }
  };

  // Handle input change and validate
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    handleValidation(value);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === "") {
      setError("Board title is required.");
    } else {
      mutate({ email: session?.user?.email!, name: title });
    }
    setError("");
  };

  const { data } = useQuery({
    queryKey: ["boards", sortOption],
    queryFn: () => getBoards(sortOption),
    enabled: !!sortOption,
    refetchOnWindowFocus: false,
  });

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div
      className={`flex flex-col z-10 gap-y-5 bg-neutral-800 bg-opacity-95 ${
        isSidebarOpen ? "min-w-64" : "min-w-10"
      } transition-all duration-200`}
    >
      <div
        className={`flex h-16 items-center text-slate-400 px-3 ${
          isSidebarOpen ? "justify-end" : "justify-center"
        }`}
      >
        <button
          className="hover:bg-[#a6c5e229] rounded-sm"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? (
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
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          ) : (
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
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          )}
        </button>
      </div>
      <div
        className={`flex justify-between items-center gap-1 text-[#9fadbc] px-3 space-y-1 ${
          isSidebarOpen ? "" : "hidden"
        }`}
      >
        <span className="flex-grow font-bold text-lg">Your board</span>
        <PopoverGroup className="flex gap-x-12">
          <Popover className="relative">
            {({ open, close }) => {
              return (
                <>
                  <PopoverButton className="flex items-center justify-center focus:outline-none">
                    <p className="hover:bg-[#a6c5e229] p-1 rounded-md">
                      <Ellipsis className="cursor-pointer" />
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
                    <PopoverPanel className="absolute left-0 top-full text-sm mt-3 w-80 max-w-80 cursor-default rounded-lg bg-[#282e33] ring-1 ring-gray-700">
                      <div className="p-3">
                        <div className="grid grid-cols-[32px,1fr,32px] items-center">
                          <p></p>
                          <p className="col-span-1 text-center font-semibold">
                            Your boards
                          </p>
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
                        <form className="mt-2">
                          <p className="mb-2 font-bold">Sort</p>
                          <div className="flex flex-col gap-2">
                            <div className="relative" ref={dropdownRef}>
                              <div className="flex bg-zinc-800 rounded-sm ring-1 ring-[#738496] focus-within:ring-2 focus-within:ring-[#85b8ff]">
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setIsOpen(!isOpen);
                                    inputRef?.current?.focus();
                                  }}
                                  className="outline-none px-2 py-1 text-sm border-none w-full flex justify-between items-center"
                                >
                                  <span>{selectedOption}</span>
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
                                      d="m19.5 8.25-7.5 7.5-7.5-7.5"
                                    />
                                  </svg>
                                </button>
                              </div>
                              {isOpen && (
                                <div className="absolute w-full mt-2.5 py-2 rounded bg-zinc-800 ring-1 ring-gray-700 focus-within:ring-[#85b8ff] shadow-lg z-10">
                                  <div
                                    onClick={() => {
                                      setSelectedOption("Sort by most recent");
                                      setSortOption({
                                        sortBy: "createdAt",
                                        sortOrder: "asc",
                                      });
                                      setIsOpen(false);
                                    }}
                                    className={`flex flex-col px-2 py-1 text-sm border-l-2 border-transparent ${
                                      selectedOption === "Sort by most recent"
                                        ? "text-[#579dff] bg-[#1c2b41] active:bg-[#0055cc] hover:bg-[#09326c] border-l-[#579dff] cursor-pointer"
                                        : "hover:border-l-[#579dff] hover:bg-[#a6c5e229]"
                                    }`}
                                  >
                                    <span>Sort by most recent</span>
                                  </div>
                                  <div
                                    onClick={() => {
                                      setSelectedOption("Sort alphabetically");
                                      setSortOption({
                                        sortBy: "name",
                                        sortOrder: "asc",
                                      });
                                      setIsOpen(false);
                                    }}
                                    className={`flex flex-col px-2 py-1 text-sm border-l-2 border-transparent ${
                                      selectedOption === "Sort alphabetically"
                                        ? "text-[#579dff] bg-[#1c2b41] active:bg-[#0055cc] hover:bg-[#09326c] border-l-[#579dff] cursor-pointer"
                                        : "hover:border-l-[#579dff] hover:bg-[#a6c5e229]"
                                    }`}
                                  >
                                    <span>Sort alphabetically</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </form>
                      </div>
                    </PopoverPanel>
                  </Transition>
                </>
              );
            }}
          </Popover>
        </PopoverGroup>
        <PopoverGroup className="flex gap-x-12">
          <Popover className="relative">
            {({ open, close }) => {
              return (
                <>
                  <PopoverButton className="flex items-center justify-center focus:outline-none">
                    <p className="hover:bg-[#a6c5e229] p-1 rounded-md">
                      <Plus className="cursor-pointer" />
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
                    <PopoverPanel className="absolute left-0 top-full text-sm mt-3 w-80 max-w-80 cursor-default rounded-lg bg-[#282e33] ring-1 ring-gray-700">
                      <div className="p-3">
                        <div className="grid grid-cols-[32px,1fr,32px] items-center">
                          <p></p>
                          <p className="col-span-1 text-center font-semibold">
                            Create board
                          </p>
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
                        <form
                          onSubmit={(e) => {
                            close();
                            handleSubmit(e);
                          }}
                          className="mt-2 flex flex-col gap-2"
                        >
                          <label className="font-bold">Title</label>
                          <input
                            type="text"
                            value={title}
                            onChange={handleChange}
                            autoFocus
                            className={`w-full outline-none px-3 py-2 bg-zinc-800 text-gray-400 rounded-sm ring-1 ${
                              error ? "ring-red-500" : "ring-[#738496]"
                            } focus-within:ring-2 focus-within:ring-[#85b8ff]`}
                          />
                          {error && (
                            <p className="text-red-500 text-sm">{error}</p>
                          )}
                          <button
                            type="submit"
                            className={`flex items-center justify-center ${
                              title
                                ? "bg-blue-400 hover:bg-[#85b8ff] text-[#1d2125] cursor-pointer"
                                : "bg-[#bcd6f00a] cursor-not-allowed"
                            } font-medium p-1.5 rounded-md focus:outline-none`}
                            disabled={title ? false : true}
                          >
                            Submit
                          </button>
                        </form>
                      </div>
                    </PopoverPanel>
                  </Transition>
                </>
              );
            }}
          </Popover>
        </PopoverGroup>
      </div>
      <div className="flex flex-1 flex-col gap-y-7">
        <ul className={`space-y-1 ${isSidebarOpen ? "" : "hidden"}`}>
          {data?.map((item: Board) => (
            <li key={item.name}>
              <Link
                href={`/board/${item.id}`}
                className={classNames(
                  item.id === params.id
                    ? "bg-zinc-600 hover:bg-zinc-700 hover:text-[#9fadbc] text-[#9fadbc]"
                    : "text-[#9fadbc] hover:text-white hover:bg-zinc-600",
                  "group flex gap-x-3 py-2 px-3 text-sm leading-6 font-semibold"
                )}
              >
                {item.name}
                <StarComponent
                  boardId={item.id as string}
                  star={item.star as boolean}
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

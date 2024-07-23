"use client";

import { useSession } from "next-auth/react";
import React from "react";

const navigation = [
  { name: "Dashboard", href: "#", count: "5", current: true },
  { name: "Team", href: "#", current: false },
  {
    name: "Projects",
    href: "#",
    count: "12",
    current: false,
  },
  {
    name: "Calendar",
    href: "#",
    count: "20+",
    current: false,
  },
  { name: "Documents", href: "#", current: false },
  { name: "Reports", href: "#", current: false },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar() {
  const { data: session } = useSession();
  const [isSidebarOpen, setSidebarOpen] = React.useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div
      className={`flex flex-col overflow-hidden gap-y-5 bg-neutral-800 opacity-95 ${
        isSidebarOpen ? "min-w-64 px-6" : "max-w-10"
      } transition-all duration-200`}
    >
      <div
        className={`flex h-16 items-center text-slate-400 ${
          isSidebarOpen ? "justify-between" : "justify-center"
        }`}
      >
        <img
          className={`h-8 w-auto ${isSidebarOpen ? "" : "hidden"}`}
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
          alt="Your Company"
        />
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
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul
              role="list"
              className={`-mx-2 space-y-1 ${isSidebarOpen ? "" : "hidden"}`}
            >
              {navigation.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-gray-800 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800",
                      "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                    )}
                  >
                    {item.name}
                    {item.count ? (
                      <span
                        className="ml-auto w-9 min-w-max whitespace-nowrap rounded-full bg-gray-900 px-2.5 py-0.5 text-center text-xs font-medium leading-5 text-white ring-1 ring-inset ring-gray-700"
                        aria-hidden="true"
                      >
                        {item.count}
                      </span>
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>
          </li>
          <li>
            <div
              className={`text-xs font-semibold leading-6 text-gray-400 ${
                isSidebarOpen ? "" : "hidden"
              }`}
            >
              Your teams
            </div>
            <div
              role="list"
              className={`mt-2 space-y-1 ${isSidebarOpen ? "" : "p-2"}`}
            >
              {session && (
                <img
                  className="h-8 w-8"
                  src={session.user?.image!}
                  alt={session.user?.name!}
                  srcSet={session.user?.image!}
                />
              )}
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
}

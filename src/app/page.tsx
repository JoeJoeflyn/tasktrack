"use client";
import List from "@/app/components/list";
import Sidebar from "@/app/components/sidebar";
export default function Home() {
  return (
    <main
      className="flex-grow flex"
      style={{ backgroundImage: `url(/Tsunami_by_hokusai_19th_century.jpg)` }}
    >
      <Sidebar />
      <div className="flex-grow flex flex-col overflow-y-hidden">
        <div className="flex items-center justify-between bg-stone-300 text-slate-800 opacity-80 py-3 px-5">
          <div className="flex-1">
            <p className="text-xl font-bold leading-7 sm:truncate sm:text-lg sm:tracking-tight">
              Back End Developer
            </p>
          </div>

          <div className="mt-4 md:flex md:ml-4 md:mt-0">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Edit
            </button>
            <button
              type="button"
              className="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Publish
            </button>
          </div>
        </div>
        <div className="flex-grow overflow-x-auto scrollbar scrollbar-thumb-neutral-500 scrollbar-track-[#00000026]">
          <List />
        </div>
      </div>
    </main>
  );
}

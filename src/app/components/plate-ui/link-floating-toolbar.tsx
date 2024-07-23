"use client";

import { cn } from "@udecode/cn";
import {
  getEndPoint,
  getStartPoint,
  replaceNodeChildren,
  useEditorRef,
  useFormInputProps,
} from "@udecode/plate-common";
import {
  type UseVirtualFloatingOptions,
  flip,
  offset,
} from "@udecode/plate-floating";
import {
  FloatingLinkUrlInput,
  type LinkFloatingToolbarState,
  LinkOpenButton,
  useFloatingLinkEdit,
  useFloatingLinkEditState,
  useFloatingLinkInsert,
  useFloatingLinkInsertState,
} from "@udecode/plate-link";

import { buttonVariants } from "./button";
import { inputVariants } from "./input";
import { popoverVariants } from "./popover";
import { Separator } from "./separator";

const floatingOptions: UseVirtualFloatingOptions = {
  middleware: [
    offset(12),
    flip({
      fallbackPlacements: ["bottom-end", "top-start", "top-end"],
      padding: 12,
    }),
  ],
  placement: "bottom-start",
};

export interface LinkFloatingToolbarProps {
  state?: LinkFloatingToolbarState;
}

export function LinkFloatingToolbar({ state }: LinkFloatingToolbarProps) {
  const insertState = useFloatingLinkInsertState({
    ...state,
    floatingOptions: {
      ...floatingOptions,
      ...state?.floatingOptions,
    },
  });
  const {
    hidden,
    props: insertProps,
    ref: insertRef,
    textInputProps,
  } = useFloatingLinkInsert(insertState);

  const editState = useFloatingLinkEditState({
    ...state,
    floatingOptions: {
      ...floatingOptions,
      ...state?.floatingOptions,
    },
  });
  const {
    editButtonProps,
    props: editProps,
    ref: editRef,
    unlinkButtonProps,
  } = useFloatingLinkEdit(editState);
  const inputProps = useFormInputProps({
    preventDefaultOnEnterKeydown: true,
  });

  if (hidden) return null;

  const input = (
    <div className="flex w-[330px] flex-col" {...inputProps}>
      <div className="flex items-center">
        <div className="flex items-center pl-3 text-zinc-500 dark:text-zinc-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-link size-4"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M9 15l6 -6" />
            <path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464" />
            <path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463" />
          </svg>
        </div>

        <FloatingLinkUrlInput
          className={inputVariants({ h: "sm", variant: "ghost" })}
          placeholder="Paste link"
        />
      </div>
      <Separator />
      <div className="flex items-center">
        <div className="flex items-center pl-3 text-zinc-500 dark:text-zinc-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-notes size-4"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M5 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
            <path d="M9 7l6 0" />
            <path d="M9 11l6 0" />
            <path d="M9 15l4 0" />
          </svg>
        </div>
        <input
          className={inputVariants({ h: "sm", variant: "ghost" })}
          placeholder="Text to display"
          {...textInputProps}
        />
      </div>
    </div>
  );

  const editContent = editState.isEditing ? (
    input
  ) : (
    <div className="box-content flex h-9 items-center gap-1">
      <button
        className={buttonVariants({ size: "sm", variant: "ghost" })}
        type="button"
        // onClick={(e) => {
        //   const anchor = getStartPoint(editor, []);
        //   const focus = getEndPoint(editor, []);

        //   replaceNodeChildren(editor, {
        //     at: [],
        //     nodes: [
        //       {
        //         type: "p",
        //         children: [
        //           {
        //             text: "never gonna give you up",
        //           },
        //         ],
        //       },
        //     ],
        //   });

        //   console.log("editor", editor);
        // }}
      >
        <svg
          width={18}
          height={18}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="presentation"
        >
          <rect
            x="6"
            y="15"
            width="20"
            height="2"
            rx="1"
            fill="currentColor"
          ></rect>
        </svg>
      </button>

      <button
        className={buttonVariants({ size: "sm", variant: "ghost" })}
        type="button"
      >
        <svg
          width={18}
          height={18}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="presentation"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M8 12c-1.10457 0-2 .8954-2 2v4c0 1.1046.89543 2 2 2h16c1.1046 0 2-.8954 2-2v-4c0-1.1046-.8954-2-2-2H8Zm0 3c0-.5523.44772-1 1-1h2c.5523 0 1 .4477 1 1v2c0 .5523-.4477 1-1 1H9c-.55228 0-1-.4477-1-1v-2Zm5 1c0-.2761.2239-.5.5-.5h10c.2761 0 .5.2239.5.5s-.2239.5-.5.5h-10c-.2761 0-.5-.2239-.5-.5Z"
            fill="currentColor"
          ></path>
        </svg>
      </button>

      <button
        className={buttonVariants({ size: "sm", variant: "ghost" })}
        type="button"
      >
        <svg
          width={18}
          height={18}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="presentation"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M8 9c-1.10457 0-2 .89543-2 2v10c0 1.1046.89543 2 2 2h16c1.1046 0 2-.8954 2-2V11c0-1.10457-.8954-2-2-2H8Zm0 3c0-.5523.44772-1 1-1h2c.5523 0 1 .4477 1 1v2c0 .5523-.4477 1-1 1H9c-.55228 0-1-.4477-1-1v-2Zm5 1c0-.2761.2239-.5.5-.5h10c.2761 0 .5.2239.5.5s-.2239.5-.5.5h-10c-.2761 0-.5-.2239-.5-.5Zm-4 3c-.55228 0-1 .4477-1 1s.44772 1 1 1h14c.5523 0 1-.4477 1-1s-.4477-1-1-1H9Zm-1 4c0-.5523.44772-1 1-1h6c.5523 0 1 .4477 1 1s-.4477 1-1 1H9c-.55228 0-1-.4477-1-1Z"
            fill="currentColor"
          ></path>
        </svg>
      </button>

      <button
        className={buttonVariants({ size: "sm", variant: "ghost" })}
        type="button"
      >
        <svg
          width={18}
          height={18}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="presentation"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M8 6c-1.10457 0-2 .89543-2 2v16c0 1.1046.89543 2 2 2h16c1.1046 0 2-.8954 2-2V8c0-1.10457-.8954-2-2-2H8Zm1 2c-.55228 0-1 .44772-1 1v2c0 .5523.44772 1 1 1h2c.5523 0 1-.4477 1-1V9c0-.55228-.4477-1-1-1H9Zm4.5 1.5c-.2761 0-.5.22386-.5.5 0 .2761.2239.5.5.5h10c.2761 0 .5-.2239.5-.5 0-.27614-.2239-.5-.5-.5h-10ZM9 14c-.55228 0-1 .4477-1 1v8c0 .5523.44772 1 1 1h14c.5523 0 1-.4477 1-1v-8c0-.5523-.4477-1-1-1H9Zm6 2.5c0 .8284-.6716 1.5-1.5 1.5s-1.5-.6716-1.5-1.5.6716-1.5 1.5-1.5 1.5.6716 1.5 1.5Zm0 5.5-1-1-2 2h8v-1.8L18 19l-3 3Z"
            fill="currentColor"
          ></path>
        </svg>
      </button>

      <Separator orientation="vertical" />

      <button
        className={buttonVariants({ size: "sm", variant: "ghost" })}
        type="button"
        {...editButtonProps}
      >
        Edit link
      </button>

      <Separator orientation="vertical" />

      <LinkOpenButton
        className={buttonVariants({
          size: "sms",
          variant: "ghost",
        })}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={18}
          height={18}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="icon icon-tabler icons-tabler-outline icon-tabler-external-link"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6" />
          <path d="M11 13l9 -9" />
          <path d="M15 4h5v5" />
        </svg>
      </LinkOpenButton>

      <Separator orientation="vertical" />

      <button
        className={buttonVariants({
          size: "sms",
          variant: "ghost",
        })}
        type="button"
        {...unlinkButtonProps}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={18}
          height={18}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="icon icon-tabler icons-tabler-outline icon-tabler-unlink"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M17 22v-2" />
          <path d="M9 15l6 -6" />
          <path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464" />
          <path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463" />
          <path d="M20 17h2" />
          <path d="M2 7h2" />
          <path d="M7 2v2" />
        </svg>
      </button>
    </div>
  );

  return (
    <>
      <div
        className={cn(popoverVariants(), "w-auto p-1")}
        ref={insertRef}
        {...insertProps}
      >
        {input}
      </div>

      <div
        className={cn(popoverVariants(), "w-auto p-1")}
        ref={editRef}
        {...editProps}
      >
        {editContent}
      </div>
    </>
  );
}

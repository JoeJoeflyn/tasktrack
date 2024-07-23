import { withRef } from "@udecode/cn";
import { PlateElement, useElement } from "@udecode/plate-common";
import { useToggleButton, useToggleButtonState } from "@udecode/plate-toggle";

export const ToggleElement = withRef<typeof PlateElement>(
  ({ children, ...props }, ref) => {
    const element = useElement();
    const state = useToggleButtonState(element.id as string);
    const { buttonProps, open } = useToggleButton(state);

    return (
      <PlateElement asChild ref={ref} {...props}>
        <div className="relative pl-6">
          <span
            className="absolute -left-0.5 -top-0.5 flex cursor-pointer select-none items-center justify-center rounded-sm p-px transition-colors hover:bg-slate-200"
            contentEditable={false}
            {...buttonProps}
          >
            {open ? (
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
                className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-down"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M6 9l6 6l6 -6" />
              </svg>
            ) : (
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
                className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M9 6l6 6l-6 6" />
              </svg>
            )}
          </span>
          {children}
        </div>
      </PlateElement>
    );
  }
);

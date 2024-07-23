import { getMetadata } from "@/app/api";
import { useQuery } from "@tanstack/react-query";
import { cn, withRef } from "@udecode/cn";
import { PlateElement, useElement } from "@udecode/plate-common";
import { type TLinkElement, useLink } from "@udecode/plate-link";

export const LinkElement = withRef<typeof PlateElement>(
  ({ children, className, ...props }, ref) => {
    const element = useElement<TLinkElement>();
    const { props: linkProps } = useLink({ element });

    const { data, isLoading } = useQuery({
      queryKey: ["card", linkProps.href],
      queryFn: () => getMetadata(linkProps.href as string),
    });
    console.log(children);

    return (
      <PlateElement
        asChild
        className={cn(
          "font-medium cursor-pointer decoration-primary underline-offset-4 dark:text-zinc-50",
          className
        )}
        ref={ref}
        {...(linkProps as any)}
        {...props}
      >
        {isLoading ? (
          <a className="text-[#579dff] hover:underline">{children}</a>
        ) : (
          <>
            <div className="flex items-center gap-2 w-fit border border-[#a6c5e229] py-0.5 px-1">
              <img
                width={16}
                height={16}
                className="object-cover"
                src={data.favicon}
                alt={data.siteName}
              />
              <a
                target="_blank"
                contentEditable={false}
                href={linkProps.href}
                className=" text-[#579dff] hover:underline"
              >
                {data.title}
              </a>
            </div>
          </>
          // <div
          //   contentEditable={false}
          //   className="flex w-full h-full border border-[#a6c5e229] rounded-lg overflow-hidden"
          // >
          //   <div className="flex flex-col gap-2 py-4 pl-4 pr-2">
          //     <div className="flex items-center gap-2">
          //       <img
          //         width={24}
          //         height={24}
          //         className="object-contain"
          //         src={data.favicon}
          //         alt={data.siteName}
          //       />
          //       <a
          //         target="_blank"
          //         href={linkProps.href}
          //         className="font-semibold text-[#579dff] hover:underline"
          //       >
          //         {data.title}
          //       </a>
          //     </div>
          //     <p className="text-xs">{data.description}</p>
          //     <div className="flex text-xs">
          //       <img
          //         width={16}
          //         height={16}
          //         className="object-cover"
          //         src={data.favicon}
          //         alt={data.siteName}
          //       />
          //       <span>{data.siteName}</span>
          //     </div>
          //   </div>
          //   <img
          //     style={{ width: "30%" }}
          //     className="object-cover"
          //     src={data.image}
          //     alt={data.title}
          //   />
          // </div>
        )}
      </PlateElement>
    );
  }
);

import { useMyContext } from "@/hooks/useMyContext";
import React from "react";
import { colorPairs } from "../../shared/colors";
import { CloseButton } from "./closeButton";
import CreateLabel from "./createLabel";
import { useQueryColor } from "./queryColor";

const LabelsList = ({
  setMode,
  setIsCreating,
  setEditing,
}: {
  setMode: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
  setEditing: React.Dispatch<
    React.SetStateAction<{
      id: string;
      bgColor: string;
    }>
  >;
}) => {
  const { colors, updateCardMutate } = useQueryColor();
  const { cardDetail } = useMyContext();

  const [checkedStates, setCheckedStates] = React.useState<{
    [key: string]: boolean;
  }>({});

  React.useEffect(() => {
    if (colors?.cardColors) {
      const initialCheckedStates = colors.cardColors.reduce(
        (acc, { color, isChecked }) => {
          acc[color.id] = isChecked;
          return acc;
        },
        {} as { [key: string]: boolean }
      );

      setCheckedStates(initialCheckedStates);
    }
  }, [colors]);

  const handleCheckState = (
    e:
      | React.MouseEvent<HTMLLabelElement, MouseEvent>
      | React.ChangeEvent<HTMLInputElement>,
    color: { id: string; color: string }
  ) => {
    e.preventDefault();

    setCheckedStates((prevCheckedStates) => {
      const newState = !prevCheckedStates[color.id];

      updateCardMutate({
        id: cardDetail.id,
        colorId: color.id,
        isChecked: newState,
      });

      return {
        ...prevCheckedStates,
        [color.id]: newState,
      };
    });
  };

  return (
    <form>
      <div className="p-3">
        <div className="grid grid-cols-[32px,1fr,32px] items-center mb-2">
          <div></div>
          <div className="col-span-1 flex justify-center">
            <span className="font-bold">Labels</span>
          </div>
          <CloseButton />
        </div>
        <div>
          <input
            // ref={inputRef}
            type="text"
            // value={searchTerm}
            placeholder="Search labels ..."
            // onChange={handleSearchTermChange}
            // onClick={() => setIsOpen(true)}
            className="w-full outline-none px-3 py-2 bg-zinc-800 text-gray-400 rounded-sm ring-1 ring-[#738496] focus-within:ring-2 focus-within:ring-[#85b8ff]"
          />
        </div>
        <div>
          <p className="mt-3 mb-2">Labels</p>
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
                <label
                  key={index}
                  onClick={(e) => {
                    handleCheckState(e, color);
                  }}
                  className="flex items-center space-x-2 px-1 mb-1 cursor-pointer rounded-md"
                >
                  <span className="relative flex items-center">
                    <input
                      className="hidden"
                      type="checkbox"
                      checked={checkedStates[color.id] || isChecked}
                      onChange={(e) => handleCheckState(e, color)}
                      readOnly
                      aria-disabled="false"
                      aria-invalid="false"
                    />
                    <span
                      className={`${
                        (checkedStates[color.id] || isChecked) && "bg-blue-400"
                      } text-xs text-[#1d2125] h-4 w-4 flex items-center justify-center ring-1 ring-gray-400 rounded-sm`}
                    >
                      {(checkedStates[color.id] || isChecked) && (
                        <svg
                          className="size-4"
                          viewBox="-3 -4 16 16"
                          xmlns="http://www.w3.org/2000/svg"
                          focusable="false"
                          role="presentation"
                        >
                          <path d="M1.49022 3.21486C1.2407 2.94412 0.818938 2.92692 0.548195 3.17644C0.277453 3.42597 0.260252 3.84773 0.509776 4.11847L2.91785 6.73131C3.2762 7.08204 3.80964 7.08204 4.14076 6.75092C4.18159 6.71082 4.18159 6.71082 4.38359 6.51218C4.57995 6.31903 4.79875 6.1037 5.03438 5.87167C5.70762 5.20868 6.38087 4.54459 7.00931 3.92318L7.0362 3.89659C8.15272 2.79246 9.00025 1.9491 9.47463 1.46815C9.73318 1.20602 9.73029 0.783922 9.46815 0.525367C9.20602 0.266812 8.78392 0.269712 8.52537 0.531843C8.05616 1.00754 7.21125 1.84829 6.09866 2.94854L6.07182 2.97508C5.4441 3.59578 4.77147 4.25926 4.09883 4.92165C3.90522 5.11231 3.72299 5.29168 3.55525 5.4567L1.49022 3.21486Z"></path>
                        </svg>
                      )}
                    </span>
                  </span>
                  <span className="flex flex-grow space-x-1 justify-between items-center">
                    <div className="has-tooltip flex-grow">
                      <span
                        style={{ backgroundColor: color.color }}
                        onMouseEnter={(e) => {
                          if (matchingPair) {
                            e.currentTarget.style.backgroundColor =
                              matchingPair.hoverBgColor;
                          }
                        }}
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = color.color)
                        }
                        className="flex items-center font-semibold h-8 text-[#1d2125] px-3 rounded"
                      >
                        {color.title}
                      </span>
                      <span className="tooltip max-w-52 bg-[#9fadbc] text-[#1d2125] text-xs px-2 py-0.5 mt-1 rounded-sm">
                        color: {matchingPair?.color.toLowerCase()}, title:{" "}
                        {color.title || "none"}
                      </span>
                    </div>
                    <button
                      className="p-1 hover:bg-[#a6c5e229] text-gray-400 rounded"
                      type="button"
                      aria-label="Edit"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsCreating((prev) => !prev);
                        setEditing({
                          id: color.id,
                          bgColor: color.color,
                        });
                        setMode(true);
                      }}
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
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M7.82034 14.4893L9.94134 16.6103L18.4303 8.12131L16.3093 6.00031H16.3073L7.82034 14.4893ZM17.7233 4.58531L19.8443 6.70731C20.6253 7.48831 20.6253 8.7543 19.8443 9.53531L10.0873 19.2933L5.13734 14.3433L14.8943 4.58531C15.2853 4.19531 15.7973 4.00031 16.3093 4.00031C16.8203 4.00031 17.3323 4.19531 17.7233 4.58531ZM5.20094 20.4097C4.49794 20.5537 3.87694 19.9327 4.02094 19.2297L4.80094 15.4207L9.00994 19.6297L5.20094 20.4097Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </button>
                  </span>
                </label>
              );
            })}
        </div>
        <div className="my-3 font-bold">
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsCreating((prev) => !prev);
              setMode(false);
            }}
            className="bg-[#a1bdd914] hover:bg-[#a6c5e229] w-full py-1.5 px-3 font-semibold text-sm rounded-sm"
          >
            Create a new label
          </button>
        </div>
        <hr className="bg-[#a6c5e229] h-px border-none" />
        <div className="mt-3 font-bold">
          <button
            type="submit"
            className="bg-[#a1bdd914] hover:bg-[#a6c5e229] w-full py-1.5 px-3 font-semibold text-sm rounded-sm"
          >
            Enable colorblind friendly mode
          </button>
        </div>
      </div>
    </form>
  );
};

export default function Label() {
  const [isCreating, setIsCreating] = React.useState(false);
  const [mode, setMode] = React.useState(false);
  const [editing, setEditing] = React.useState<{
    id: string;
    bgColor: string;
  }>({ id: "", bgColor: "" });

  return isCreating ? (
    <CreateLabel
      mode={mode}
      setMode={setMode}
      setEditing={setEditing}
      editing={editing}
      setIsCreating={setIsCreating}
    />
  ) : (
    <LabelsList
      setMode={setMode}
      setEditing={setEditing}
      setIsCreating={setIsCreating}
    />
  );
}

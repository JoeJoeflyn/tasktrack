import React from "react";
import { Card } from "@/app/shared/interface";
import { colorPairs } from "../../shared/colors";

export const CardLabels = ({ card }: { card: Card }) => {
  const checkedCardColors = React.useMemo(() => {
    return card.cardColors.filter(({ isChecked }) => isChecked);
  }, [card.cardColors]);

  return (
    <>
      {checkedCardColors.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {card.cardColors.map(({ color, isChecked }, index) => {
            const matchingPair = React.useMemo(() => {
              return colorPairs.find((pair) => pair.bgColor === color.color);
            }, [color.color, colorPairs]);

            return (
              isChecked && (
                <div key={index} className="has-tooltip cursor-pointer">
                  <span
                    className="flex items-center font-semibold text-xs text-[#1d2125] p-1 rounded"
                    style={{ backgroundColor: color.color }}
                    onMouseEnter={(e) => {
                      if (matchingPair) {
                        e.currentTarget.style.backgroundColor =
                          matchingPair.hoverBgColor;
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = color.color;
                    }}
                  >
                    {color.title}
                  </span>
                  <span className="tooltip min-w-52 bg-[#9fadbc] text-[#1d2125] text-left text-xs px-2 py-0.5 mt-1 rounded-sm">
                    color: {matchingPair?.color.toLowerCase()}, title:{" "}
                    {color.title || "none"}
                  </span>
                </div>
              )
            );
          })}
        </div>
      )}
    </>
  );
};

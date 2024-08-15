import { updateBoard } from "@/app/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import React from "react";

export default function StarComponent({
  boardId,
  star,
}: {
  boardId: string;
  star: boolean;
}) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: updateBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });

  const handleStar = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.preventDefault();
    // Toggle the star value directly, instead of using a local state
    mutate({ id: boardId, star: !star });
  };

  return (
    <Star
      className={`${
        star ? "fill-[#8c9bab]" : ""
      } ml-auto cursor-pointer hover:scale-110`}
      onClick={handleStar}
    />
  );
}

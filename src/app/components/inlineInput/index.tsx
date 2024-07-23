import { updateList } from "@/app/api";
import { List } from "@/app/shared/interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const InlineInput = ({ list }: { list: List }) => {
  const { id, name } = list;
  const queryClient = useQueryClient();
  const [value, setValue] = useState(name);
  const [isEditing, setIsEditing] = useState(false);

  const { mutate } = useMutation({
    mutationFn: updateList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
  });

  const handleBlur = () => {
    mutate({
      id: id,
      name: value,
    } as List);
    setIsEditing(false);
  };

  return (
    <p className="bg-neutral-900 w-full" onClick={() => setIsEditing(true)}>
      {isEditing ? (
        <input
          className="w-full bg-transparent py-1 p-2 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          value={value}
          onBlur={handleBlur}
          onChange={(e) => setValue(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          autoFocus
        />
      ) : (
        <span className="w-full py-1 p-2">{name}</span>
      )}
    </p>
  );
};

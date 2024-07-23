import React from "react";
import ActionMenu from "./actionMenu";
import CopyList from "./copyList";
import MoveList from "./moveList";

export default function Actions({
  listId,
  setIsAdding,
  setIsFormVisible,
}: {
  listId: string;
  setIsAdding: React.Dispatch<React.SetStateAction<string>>;
  setIsFormVisible: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [mode, setMode] = React.useState<"copy" | "move" | "actions">(
    "actions"
  );

  return {
    copy: <CopyList setMode={setMode} listId={listId} />,
    move: <MoveList setMode={setMode} listId={listId} />,
    actions: (
      <ActionMenu
        listId={listId}
        setMode={setMode}
        setIsAdding={setIsAdding}
        setIsFormVisible={setIsFormVisible}
      />
    ),
  }[mode];
}

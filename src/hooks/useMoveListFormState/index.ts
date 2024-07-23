
import { List } from "@/app/shared/interface";
import { useQueryClient } from "@tanstack/react-query";
import { debounce } from "lodash";

import React from "react";

export const useMoveListFormState = (listId: string) => {
    const queryClient = useQueryClient();
    const lists = queryClient.getQueryData<List[]>(["lists"]);
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState(searchTerm);

    const sortedLists = React.useMemo(() => {
        const sortedLists = lists?.sort((a, b) => a.position - b.position);
        return sortedLists?.map((list, index) => ({
            ...list,
            position: index + 1,
        }));
    }, [lists]);

    const updatedLists = sortedLists?.map((list, index) => ({
        ...list,
        position: index + 1,
    }));

    const currentList = React.useMemo(() => sortedLists?.find((list) => list.id === listId), [sortedLists, listId]);

    const currentListIndex = React.useMemo(() => updatedLists?.findIndex((list) => list.id === listId), [sortedLists, listId]);

    const [selectedOption, setSelectedOption] = React.useState(
        currentListIndex !== undefined ? currentListIndex + 1 : undefined
    );

    const positions = React.useMemo(
        () => Array.from({ length: sortedLists?.length || 0 }, (_, i) => i + 1),
        [sortedLists]
    );

    const filteredPositions = React.useMemo(
        () =>
            positions.filter((position) => position.toString().includes(searchTerm)),
        [positions, searchTerm]
    );

    const debouncedSetSearchTerm = React.useCallback(
        debounce((value: string) => {
            setDebouncedSearchTerm(value);
        }, 300),
        []
    );

    const handleSearchTermChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSetSearchTerm(e.target.value);
    }, [debouncedSetSearchTerm]);

    return {
        isOpen,
        setIsOpen,
        searchTerm,
        setSearchTerm,
        selectedOption,
        setSelectedOption,
        positions,
        filteredPositions,
        handleSearchTermChange,
        currentList,
        updatedLists,
    };
};
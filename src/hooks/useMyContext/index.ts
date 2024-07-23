import { MyContext } from "@/context";
import { useContext } from "react";

export const useMyContext = () => {
    const context = useContext(MyContext);
    return context;
};
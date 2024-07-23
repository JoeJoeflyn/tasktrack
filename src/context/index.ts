import { createContext, Dispatch, SetStateAction } from 'react';
import { Card } from '../app/shared/interface';

export type MyContextType = {
    cardDetail: Card;
    setCardDetail: Dispatch<SetStateAction<Card>>;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>
}

const defaultCardDetail: Card = {
    id: "",
    listId: "",
    userId: "",
    name: '',
    position: 0
};

export const MyContext = createContext<MyContextType>({
    cardDetail: defaultCardDetail,
    setCardDetail: () => { },
    open: false,
    setOpen: () => { },
});
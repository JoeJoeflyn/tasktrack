import { addColor, deleteColor, getCardId, getColorId, updateCard, updateColor } from '@/app/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Color } from '../../shared/interface';
import { useMyContext } from '@/hooks/useMyContext';

export const useQueryColor = (id?: string) => {
    const queryClient = useQueryClient();
    const { cardDetail } = useMyContext();

    const { data: colors } = useQuery<Card>({
        queryKey: ["card", cardDetail.id],
        queryFn: () => getCardId(cardDetail.id),
    });

    const { data: color } = useQuery<Color>({
        queryKey: ["color", id],
        queryFn: () => getColorId(id),
        enabled: !!id,
    });

    const { mutate: updateCardMutate } = useMutation({
        mutationFn: updateCard,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["card", cardDetail.id] });
        },
    });

    const { mutate: addMutate, isPending: isAddPending, isSuccess: isAddSuccess } = useMutation({
        mutationFn: addColor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['colors'] });
        },
    });

    const { mutate: updateMutate, isPending: isUpdatePending, isSuccess: isUpdateSuccess } = useMutation({
        mutationFn: updateColor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['colors'] });
        },
    });

    const { mutate: deleteMutate, isPending: isDeletePending, isSuccess: isDeleteSuccess } = useMutation({
        mutationFn: deleteColor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['colors'] });
        },
    });

    return {
        addMutate,
        isAddPending,
        isAddSuccess,
        updateMutate,
        isUpdatePending,
        isUpdateSuccess,
        deleteMutate,
        isDeletePending,
        isDeleteSuccess,
        updateCardMutate,
        colors,
        color
    };
};
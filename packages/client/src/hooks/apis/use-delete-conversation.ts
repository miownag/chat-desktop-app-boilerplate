import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '@/constants';
import { deleteConversation } from '@/services';

function useDeleteConversation(config?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => deleteConversation(conversationId),
    onSuccess: () => {
      config?.onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.CONVERSATION_LIST],
      });
    },
  });
}

export default useDeleteConversation;

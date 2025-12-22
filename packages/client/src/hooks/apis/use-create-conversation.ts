import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '@/constants';
import { createConversation } from '@/services';
import type { CommonResponse } from '@/types';

function useCreateConversation(config?: {
  onSuccess?: (
    params: CommonResponse<{
      id: string;
      title: string;
      createdAt: string;
    }>,
  ) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => createConversation(),
    onSuccess: (params) => {
      config?.onSuccess?.(params);
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.CONVERSATION_LIST],
      });
    },
  });
}

export default useCreateConversation;

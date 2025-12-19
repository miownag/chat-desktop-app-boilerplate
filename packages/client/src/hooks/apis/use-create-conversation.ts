import { QueryKeys } from "@/constants";
import { createConversation } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useCreateConversation(config?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (title?: string) => createConversation(title),
    onSuccess: () => {
      config?.onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.CONVERSATION_LIST],
      });
    },
  });
}

export default useCreateConversation;

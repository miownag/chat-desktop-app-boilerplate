import { QueryKeys } from "@/constants";
import { createConversation } from "@/services";
import { CommonResponse } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useCreateConversation(config?: {
  onSuccess?: (
    params: CommonResponse<{
      id: string;
      title: string;
      createdAt: string;
    }>
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

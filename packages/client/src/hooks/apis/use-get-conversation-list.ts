import { QueryKeys } from "@/constants";
import { getSessionList } from "@/services";
import { useQuery, useQueryClient } from "@tanstack/react-query";

function useGetConversationList({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: [QueryKeys.CONVERSATION_LIST, page, pageSize],
    queryFn: async () => {
      const response = await getSessionList(page, pageSize);
      return response;
    },
  });

  const refreshConversationList = async () => {
    await queryClient.invalidateQueries({
      queryKey: [QueryKeys.CONVERSATION_LIST, page, pageSize],
    });
  };

  return {
    data,
    isLoading,
    isError,
    refreshConversationList,
  };
}

export default useGetConversationList;

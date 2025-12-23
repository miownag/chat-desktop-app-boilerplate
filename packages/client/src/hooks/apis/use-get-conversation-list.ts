import { useQuery, useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '@/constants';
import { getConversationList } from '@/services';

function useGetConversationList({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) {
  const { data, isLoading, isError } = useQuery({
    queryKey: [QueryKeys.CONVERSATION_LIST, page, pageSize],
    queryFn: async () => {
      const response = await getConversationList(page, pageSize);
      return response;
    },
  });

  return {
    data,
    isLoading,
    isError,
  };
}

function useRefreshConversationList() {
  const queryClient = useQueryClient();
  const refreshConversationList = async () => {
    await queryClient.invalidateQueries({
      queryKey: [QueryKeys.CONVERSATION_LIST],
    });
  };
  return refreshConversationList;
}

export { useRefreshConversationList };
export default useGetConversationList;

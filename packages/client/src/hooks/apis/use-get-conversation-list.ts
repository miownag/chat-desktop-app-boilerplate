import { getSessionList } from "@/services";
import { useQuery } from "@tanstack/react-query";

function useGetConversationList({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["conversationList", page, pageSize],
    queryFn: async () => {
      const response = await getSessionList(page, pageSize);
      return response;
    },
  });
  return {
    data,
    isLoading,
    isError,
  };
}

export default useGetConversationList;

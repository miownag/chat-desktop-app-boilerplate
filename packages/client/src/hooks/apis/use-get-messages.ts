import { getMessagesById } from "@/services";
import { useQuery } from "@tanstack/react-query";

function useGetMessages({ conversationId }: { conversationId: string }) {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      const response = await getMessagesById(conversationId);
      return response;
    },
  });
}

export default useGetMessages;

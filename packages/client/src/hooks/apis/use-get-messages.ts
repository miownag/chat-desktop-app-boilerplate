import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from '@/constants';
import { getMessagesById } from '@/services';

function useGetMessages({ conversationId }: { conversationId: string }) {
  return useQuery({
    queryKey: [QueryKeys.MESSAGES, conversationId],
    queryFn: async () => {
      const response = await getMessagesById(conversationId);
      return response;
    },
    enabled: Boolean(conversationId) && conversationId !== 'new',
  });
}

export default useGetMessages;

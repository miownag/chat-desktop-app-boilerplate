import dayjs from 'dayjs';
import { groupBy, pick } from 'es-toolkit';
import { useEffect } from 'react';
import { useShallowChatBotStore } from '@/stores';
import useGetConversationList from './apis/use-get-conversation-list';

function useGroupedConversationList(pageConfig: {
  pageSize: number;
  page: number;
}) {
  const { data, isLoading, isError } = useGetConversationList(pageConfig);
  const {
    currentConversationId,
    setCurrentConversationId,
    addLoadedConversationIds,
  } = useShallowChatBotStore((state) =>
    pick(state, [
      'currentConversationId',
      'setCurrentConversationId',
      'addLoadedConversationIds',
    ]),
  );
  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (
      data?.data?.data?.length &&
      currentConversationId !== 'new' &&
      (!currentConversationId ||
        !data.data.data.map((item) => item.id).includes(currentConversationId))
    ) {
      setCurrentConversationId(data.data.data[0].id);
      addLoadedConversationIds([data.data.data[0].id]);
      return;
    }
    if (
      !data?.data?.data?.length ||
      (currentConversationId &&
        currentConversationId !== 'new' &&
        !data.data.data.map((item) => item.id).includes(currentConversationId))
    ) {
      setCurrentConversationId('new');
    }
  }, [
    isLoading,
    data?.data?.data,
    setCurrentConversationId,
    addLoadedConversationIds,
    currentConversationId,
  ]);

  if (data?.code !== 0 || !data?.data?.data) {
    return { data: {}, isLoading, isError };
  }
  return {
    data: groupBy(data.data.data, (item) =>
      dayjs(Number(item.createdAt)).format('YYYY-MM-DD'),
    ),
    isLoading,
    isError,
  };
}

export default useGroupedConversationList;

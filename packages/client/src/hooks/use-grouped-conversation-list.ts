import useGetConversationList from "./apis/use-get-conversation-list";
import { groupBy, pick } from "es-toolkit";
import dayjs from "dayjs";
import { useShallowChatBotStore } from "@/stores";
import { useEffect } from "react";

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
      "currentConversationId",
      "setCurrentConversationId",
      "addLoadedConversationIds",
    ])
  );
  useEffect(() => {
    if (
      data?.data?.data &&
      (!currentConversationId ||
        !data.data.data.map((item) => item.id).includes(currentConversationId))
    ) {
      setCurrentConversationId(data.data.data[0].id);
      addLoadedConversationIds([data.data.data[0].id]);
    }
  }, [data?.data?.data]);
  if (data?.code !== 0 || !data?.data?.data) {
    return { data: {}, isLoading, isError };
  }
  return {
    data: groupBy(data.data.data, (item) =>
      dayjs(Number(item.createdAt)).format("YYYY-MM-DD")
    ),
    isLoading,
    isError,
  };
}

export default useGroupedConversationList;

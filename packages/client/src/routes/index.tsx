import { createFileRoute } from "@tanstack/react-router";
import MainBox from "@/components/main-box";
import { useShallowChatBotStore } from "@/stores";
import { pick } from "es-toolkit";

export const Route = createFileRoute("/")({
  component: IndexComponent,
});

function IndexComponent() {
  const { loadedConversationIds, currentConversationId } =
    useShallowChatBotStore((state) =>
      pick(state, ["loadedConversationIds", "currentConversationId"])
    );
  return (
    <>
      {(!loadedConversationIds?.length || currentConversationId === "new") && (
        <MainBox conversationId="new" isActive />
      )}
      {loadedConversationIds
        ?.filter((id) => id !== "new")
        .map((id) => (
          <MainBox
            key={id}
            conversationId={id}
            isActive={id === currentConversationId}
          />
        ))}
    </>
  );
}

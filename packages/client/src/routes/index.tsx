import { createFileRoute } from "@tanstack/react-router";
import MainBox from "@/components/main-box";
import { useShallowChatBotStore } from "@/stores";
import { pick } from "es-toolkit";
import Welcome from "@/components/welcome";

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
      {!loadedConversationIds?.length && <Welcome />}
      {loadedConversationIds?.map((id) => (
        <MainBox
          key={id}
          conversationId={id}
          isActive={id === currentConversationId}
        />
      ))}
    </>
  );
}

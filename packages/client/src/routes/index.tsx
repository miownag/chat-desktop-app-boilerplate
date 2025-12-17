import { createFileRoute } from "@tanstack/react-router";
import MainBox from "@/components/main-box";
import { useShallowChatBotStore } from "@/stores";
import { pick } from "es-toolkit";
import { twJoin } from "tailwind-merge";

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
      {loadedConversationIds?.map((id) => {
        return (
          <div
            className={twJoin(
              "p-2 flex-1 flex flex-col items-center justify-center overflow-auto",
              `${id === currentConversationId ? "" : "hidden"}`
            )}
          >
            <MainBox key={id} conversationId={id} />
          </div>
        );
      })}
    </>
  );
}

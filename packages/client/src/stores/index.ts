import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";
import type { Actions, State } from "./types";

export const useChatBotStore = create<State & Actions>()(
  immer((set) => ({
    sideBarVisible: true,
    currentConversationId: null,
    conversationList: [],
    loadedConversationIds: [],
    pendingMessage: null,
    toggleSideBar: () =>
      set((state) => {
        state.sideBarVisible = !state.sideBarVisible;
      }),
    setCurrentConversationId: (id: string | null) =>
      set((state) => {
        if (id && !state.loadedConversationIds.includes(id)) {
          state.loadedConversationIds.push(id);
        }
        state.currentConversationId = id;
      }),
    addLoadedConversationIds: (ids: string[]) =>
      set((state) => {
        ids.forEach((id) => {
          if (!state.loadedConversationIds.includes(id)) {
            state.loadedConversationIds.push(id);
          }
        });
      }),
    setPendingMessage: (message: string | null) =>
      set((state) => {
        state.pendingMessage = message;
      }),
  }))
);

export const useShallowChatBotStore = <TSelected>(
  selector: (state: State & Actions) => TSelected
): TSelected => {
  return useChatBotStore(useShallow(selector));
};

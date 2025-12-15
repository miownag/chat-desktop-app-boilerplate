import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { useShallow } from 'zustand/react/shallow';
import type { Actions, State } from './types';

export const useChatBotStore = create<State & Actions>()(
  immer((set) => ({
    sideBarVisible: true,
    currentConversationId: null,
    toggleSideBar: () =>
      set((state) => {
        state.sideBarVisible = !state.sideBarVisible;
      }),
    setCurrentConversationId: (id: string | null) =>
      set((state) => {
        state.currentConversationId = id;
      }),
    addNewConversation: () => {
      // TODO: 新建会话
      console.log('add new conversation');
    },
  })),
);

export const useShallowChatBotStore = <TSelected>(selector: (state: State & Actions) => TSelected): TSelected => {
  return useChatBotStore(useShallow(selector));
};

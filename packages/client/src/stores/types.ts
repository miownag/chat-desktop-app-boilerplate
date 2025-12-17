type State = {
  sideBarVisible: boolean;
  currentConversationId: string | null;
  loadedConversationIds: string[];
};

type Actions = {
  toggleSideBar: () => void;
  setCurrentConversationId: (id: string | null) => void;
  addNewConversation: () => void;
  addLoadedConversationIds: (ids: string[]) => void;
};

export type { State, Actions };

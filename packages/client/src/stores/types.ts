type State = {
  sideBarVisible: boolean;
  currentConversationId: string | null;
  loadedConversationIds: string[];
  pendingMessage: string | null;
};

type Actions = {
  toggleSideBar: () => void;
  setCurrentConversationId: (id: string | null) => void;
  addLoadedConversationIds: (ids: string[]) => void;
  setPendingMessage: (message: string | null) => void;
};

export type { State, Actions };

type State = {
  sideBarVisible: boolean;
  currentConversationId: string | null;
};

type Actions = {
  toggleSideBar: () => void;
  setCurrentConversationId: (id: string | null) => void;
  addNewConversation: () => void;
};

export type { State, Actions };

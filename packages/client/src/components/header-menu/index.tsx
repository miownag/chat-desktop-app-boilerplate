import { TbMessagePlus } from "react-icons/tb";
import { PiSidebar } from "react-icons/pi";
import { useChatBotStore } from "@/stores";
import AccountManage from "../account-manage";
import Space from "../space";
import { Button } from "../ui/button";
import { useSidebar } from "../ui/sidebar";

function HeaderMenu() {
  const { toggleSidebar, open } = useSidebar();
  const addNewConversation = useChatBotStore(
    (state) => state.addNewConversation
  );

  return (
    <div className="flex justify-between py-2 px-3 items-center h-12">
      {!open ? (
        <Space>
          <Button
            size="icon"
            variant="ghost"
            className="cursor-pointer"
            onClick={toggleSidebar}
          >
            <PiSidebar className="w-6! h-6! text-neutral-500" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="cursor-pointer"
            onClick={addNewConversation}
          >
            <TbMessagePlus className="w-5! h-5! text-neutral-500" />
          </Button>
        </Space>
      ) : (
        <div />
      )}
      <AccountManage />
    </div>
  );
}

export default HeaderMenu;

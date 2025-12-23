import { useState } from 'react';
import { MdOutlineArrowDropDown } from 'react-icons/md';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth, useSignOut } from '@/hooks/apis/use-auth';
import { LoginForm } from '../login-form';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog';

export default function AccountManage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const signOutMutation = useSignOut();
  const [showDialog, setShowDialog] = useState(false);

  const handleLogout = async () => {
    await signOutMutation.mutateAsync();
  };

  const handleLogin = () => {
    setShowDialog(true);
  };

  // Get user initials for avatar fallback
  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="cursor-pointer flex items-center gap-1 pl-2 py-1 rounded-lg">
        <Avatar>
          <AvatarFallback>...</AvatarFallback>
        </Avatar>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <button
          type="button"
          className="cursor-pointer flex items-center gap-1 pl-2 py-1 rounded-lg hover:bg-neutral-100 transition-colors"
          onClick={handleLogin}
        >
          <Avatar>
            <AvatarFallback>?</AvatarFallback>
          </Avatar>
          <span className="text-sm">Login</span>
        </button>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader />
            <LoginForm />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer flex items-center gap-1 pl-2 py-1 rounded-lg hover:bg-neutral-100 transition-colors">
          <Avatar>
            <AvatarImage
              src={user?.image ?? undefined}
              alt={user?.name ?? 'User'}
            />
            <AvatarFallback>{getInitials(user?.name ?? null)}</AvatarFallback>
          </Avatar>
          <MdOutlineArrowDropDown className="text-2xl" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span>{user?.name ?? 'User'}</span>
            <span className="text-xs text-muted-foreground font-normal">
              {user?.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            Keyboard shortcuts
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">Team</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem className="cursor-pointer">
                  Email
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Message
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  More...
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem className="cursor-pointer">
            New Team
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">GitHub</DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">Support</DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" disabled>
          API
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={handleLogout}
          disabled={signOutMutation.isPending}
        >
          {signOutMutation.isPending ? 'Logging out...' : 'Log out'}
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const getInitials = (name: string | null) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const AVATAR_DEFAULT_CLASSES = [
  'bg-purple-700',
  'bg-blue-700',
  'bg-green-700',
  'bg-red-700',
  'bg-orange-700',
];

const getColorClassByInitials = (firstChar: string) => {
  return AVATAR_DEFAULT_CLASSES[firstChar.charCodeAt(0) % 5];
};

function UserAvatar({
  user,
}: {
  user: { name: string | null; image?: string | null } | null;
}) {
  const firstChar = getInitials(user?.name ?? null)?.[0];

  return (
    <Avatar>
      <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? 'User'} />
      <AvatarFallback
        className={`${getColorClassByInitials(firstChar)} text-white`}
      >
        {firstChar}
      </AvatarFallback>
    </Avatar>
  );
}

export default UserAvatar;

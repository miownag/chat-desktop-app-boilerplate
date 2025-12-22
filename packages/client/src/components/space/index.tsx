import { twMerge } from 'tailwind-merge';

function Space(props: {
  children: React.ReactNode;
  className?: string;
  gap?: number;
}) {
  const { children, className, gap = 2 } = props;

  return (
    <div className={twMerge('flex items-center', `gap-${gap}`, className)}>
      {children}
    </div>
  );
}

export default Space;

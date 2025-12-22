import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface TypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
  loop?: boolean;
  loopDelay?: number;
  showCursor?: boolean;
  cursorChar?: string;
  className?: string;
  cursorClassName?: string;
  deleteEndIndex?: number;
  onComplete?: () => void;
}

const Typewriter = ({
  text,
  speed = 50,
  delay = 0,
  loop = false,
  loopDelay = 1000,
  showCursor = true,
  cursorChar = '|',
  className,
  cursorClassName,
  deleteEndIndex = 0,
  onComplete,
}: TypewriterProps) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const textRef = useRef(text);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Update text when prop changes
  useEffect(() => {
    textRef.current = text;
    setCurrentText('');
    setCurrentIndex(0);
    setIsDeleting(false);
  }, [text]);

  useEffect(() => {
    const type = () => {
      const currentText = textRef.current;
      const currentSpeed = isDeleting ? speed / 2 : speed;

      if (!isDeleting) {
        // Typing forward
        setCurrentText(currentText.substring(0, currentIndex + 1));

        if (currentIndex + 1 === currentText.length) {
          // Finished typing
          if (loop) {
            timerRef.current = setTimeout(() => {
              setIsDeleting(true);
            }, loopDelay);
          } else {
            onComplete?.();
          }
        } else {
          setCurrentIndex(currentIndex + 1);
          timerRef.current = setTimeout(type, currentSpeed);
        }
      } else {
        // Deleting
        setCurrentText(currentText.substring(0, currentIndex - 1));
        setCurrentIndex(currentIndex - 1);

        if (currentIndex - 1 === deleteEndIndex) {
          // Finished deleting
          setIsDeleting(false);
          timerRef.current = setTimeout(type, speed);
        } else {
          timerRef.current = setTimeout(type, currentSpeed);
        }
      }
    };

    if (delay > 0) {
      timerRef.current = setTimeout(type, delay);
    } else {
      timerRef.current = setTimeout(type, 0);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [
    currentIndex,
    isDeleting,
    speed,
    loop,
    loopDelay,
    delay,
    onComplete,
    deleteEndIndex,
  ]);

  return (
    <div className={cn('flex items-center', className)}>
      <span className="whitespace-nowrap">{currentText}</span>
      {showCursor && (
        <span
          className={cn('ml-1', cursorClassName)}
          style={{
            animation: 'blink 1s infinite',
          }}
        >
          {cursorChar}
        </span>
      )}
    </div>
  );
};

export default Typewriter;

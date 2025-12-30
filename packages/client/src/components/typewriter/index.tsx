import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface TypewriterProps {
  textProps: {
    baseText: string;
    dynamicTexts: string[];
  };
  speed?: number;
  delay?: number;
  loop?: boolean;
  loopDelay?: number;
  showCursor?: boolean;
  cursorChar?: string;
  className?: string;
  cursorClassName?: string;
  onComplete?: () => void;
}

const Typewriter = ({
  textProps,
  speed = 50,
  delay = 0,
  loop = false,
  loopDelay = 1000,
  showCursor = true,
  cursorChar = '|',
  className,
  cursorClassName,
  onComplete,
}: TypewriterProps) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [dynamicTextIndex, setDynamicTextIndex] = useState(0);
  const textPropsRef = useRef(textProps);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Update text when prop changes
  useEffect(() => {
    textPropsRef.current = textProps;
    setCurrentText(textProps.baseText);
    setCurrentIndex(0);
    setIsDeleting(false);
    setDynamicTextIndex(0);
  }, [textProps]);

  useEffect(() => {
    const type = () => {
      const { baseText, dynamicTexts } = textPropsRef.current;
      const currentDynamicText = dynamicTexts[dynamicTextIndex];
      const fullText = baseText + currentDynamicText;
      const currentSpeed = isDeleting ? speed / 2 : speed;

      if (!isDeleting) {
        // Typing forward
        const targetLength = baseText.length + currentIndex + 1;
        setCurrentText(fullText.substring(0, targetLength));

        if (targetLength === fullText.length) {
          // Finished typing current dynamic text
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
        // Deleting only the dynamic text part
        const targetLength = baseText.length + currentIndex - 1;
        setCurrentText(fullText.substring(0, targetLength));
        setCurrentIndex(currentIndex - 1);

        if (currentIndex - 1 === 0) {
          // Finished deleting, move to next dynamic text
          setIsDeleting(false);
          const nextIndex = (dynamicTextIndex + 1) % dynamicTexts.length;
          setDynamicTextIndex(nextIndex);
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
    dynamicTextIndex,
    speed,
    loop,
    loopDelay,
    delay,
    onComplete,
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

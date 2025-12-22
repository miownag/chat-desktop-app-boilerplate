import { useMutation } from '@tanstack/react-query';
import { submitFeedback } from '@/services';

type FeedbackParams = {
  messageId: string;
  actionType: 'like' | 'dislike';
  action: 'submit' | 'cancel';
};

function useFeedback() {
  return useMutation({
    mutationFn: (params: FeedbackParams) => submitFeedback(params),
  });
}

export default useFeedback;

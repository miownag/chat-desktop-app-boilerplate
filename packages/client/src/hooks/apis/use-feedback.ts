import { submitFeedback } from "@/services";
import { useMutation } from "@tanstack/react-query";

type FeedbackParams = {
  messageId: string;
  actionType: "like" | "dislike";
  action: "submit" | "cancel";
};

function useFeedback() {
  return useMutation({
    mutationFn: (params: FeedbackParams) => submitFeedback(params),
  });
}

export default useFeedback;

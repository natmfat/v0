import { useActionData, useNavigation } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { StandardResponse } from "~/lib/utils.server";

type RemixFormArgs = {
  onSuccess?: (payload: StandardResponse) => void;
  onError?: (payload: StandardResponse) => void;
};

export function useRemixForm({
  onSuccess = () => {},
  onError = () => {},
}: RemixFormArgs = {}) {
  const formRef = useRef<HTMLFormElement>(null);
  const navigation = useNavigation();
  const actionData = useActionData();

  useEffect(() => {
    if (
      navigation.state === "idle" &&
      actionData &&
      typeof actionData === "object"
    ) {
      const typedActionData = actionData as StandardResponse;
      if (typedActionData.success) {
        onSuccess(typedActionData);
      } else {
        onError(typedActionData);
      }
    }
  }, [navigation.state, actionData, onSuccess, onError]);

  return { formRef };
}

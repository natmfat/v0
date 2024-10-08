/**
 * Format message with capital letter & period if necessary
 * @returns Formatted message
 */
export function formatMessage(message: string): string {
  if (typeof message === "string") {
    return `${message.charAt(0).toLocaleUpperCase()}${message.substring(1)}${
      message.endsWith(".") ? "" : "."
    }`;
  }

  return formatMessage("no status message provided");
}

/**
 * Easily create a 404 message
 * @returns 404 Response
 */
export function notFound() {
  return new Response(null, {
    status: 404,
    statusText: formatMessage("not found"),
  });
}

/**
 * Easily create a server side error
 * @param statusText Any additional client side messages
 * @returns 500 Response
 */
export function serverError(statusText: string = "internal server error") {
  return new Response(null, {
    status: 500,
    statusText: formatMessage(statusText),
  });
}

/**
 * Ensure that a value exists; otherwise throw a 500 error
 * @param value
 */
export function requireTruthy(
  value: unknown,
  response: Response | string = "missing required value",
): asserts value {
  if (!value) {
    // throw server error if provided
    if (response && typeof response === "string") {
      throw standard(false, response);
    }

    throw response;
  }
}

/**
 * Return a standard response \
 * Use if you are not simply returning data (ie: error messages, status messages)
 * @param success If the operation succeeded or not
 * @param message Message to include (defaults to a generic message depending on the value of success, you should write something better)
 * @param data Optional data payload (untyped, use sparingly for debugging purposes)
 * @returns Simple standard response object with JSON payload
 */
export async function standard(
  success: boolean,
  message?: string,
  data?: object,
) {
  const fMessage = formatMessage(
    message || (success ? "this operation succeeded" : "this operation failed"),
  );

  return new Response(
    JSON.stringify({
      success,
      message: fMessage,
      data,
    } satisfies StandardResponse),
    {
      status: success ? 200 : 500,
      statusText: fMessage,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}

export type StandardResponse = {
  success: boolean;
  message: string;
  data?: object;
};

export function logStandardError(error: unknown, message: string) {
  console.error(error);
  const fMessage = formatMessage(message);
  console.log(fMessage);
  return standard(false, fMessage, { error });
}

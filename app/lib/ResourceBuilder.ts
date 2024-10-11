// heavily inspired by koa-zod-router
// https://github.com/JakeFenley/koa-zod-router/
import {
  ActionFunction,
  ActionFunctionArgs,
  LoaderFunction,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { ZodSchema, ZodTypeAny, z } from "zod";

import { INTENT } from "./types";
import { logStandardError, requireTruthy, standard } from "./utils.server";

type RequestMethod = "DELETE" | "PATCH" | "POST" | "PUT" | "GET" | "ANY";
type RequestParameter = "headers" | "params" | "query" | "body" | "formData";

/* eslint-disable @typescript-eslint/no-explicit-any */
type ValidationOptions<Headers, Params, Query, Body, FormData> = {
  headers?: ZodSchema<Headers, z.ZodTypeDef, any>;
  params?: ZodSchema<Params, z.ZodTypeDef, any>;
  query?: ZodSchema<Query, z.ZodTypeDef, any>;
  body?: ZodSchema<Body, z.ZodTypeDef, any>;
  formData?: ZodSchema<FormData, z.ZodTypeDef, any>;
};
/* eslint-enable @typescript-eslint/no-explicit-any */

type HandlerFn<Headers, Params, Query, Body, FormData, Context> = (args: {
  headers: Headers;
  body: Body;
  params: Params;
  query: Query;
  formData: FormData;
  context: Context;
}) => ReturnType<ActionFunction> | ReturnType<LoaderFunction>;

type Action<Headers, Params, Query, Body, FormData, Context> = {
  /** Expected request method (GET, POST, etc.) */
  method: RequestMethod;
  /** Validate request parameters */
  validate: Partial<ValidationOptions<Headers, Params, Query, Body, FormData>>;
  /** Request handler that should return a response; runs after validation */
  handler: HandlerFn<Headers, Params, Query, Body, FormData, Context>;
};

export class ResourceBuilder {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private actions: Record<string, Action<any, any, any, any, any, any>> = {};

  register<H, P, Q, B, F>({
    intent = "default",
    method = "GET",
    validate = {},
    handler = () => standard(false, "no handler was defined for this method"),
  }: {
    intent?: string;
    method?: RequestMethod;
    validate?: Partial<ValidationOptions<H, P, Q, B, F>>;
    handler: HandlerFn<H, P, Q, B, F, { request: Request }>;
  }) {
    this.actions[intent] = {
      method,
      validate,
      handler,
    };
    return this;
  }
  async validate(
    requestParameter: RequestParameter,
    data: unknown,
    schema: ZodTypeAny | undefined,
  ) {
    if (!schema) {
      return {};
    }

    const parsed = await schema.safeParseAsync(data);
    if (!parsed.success) {
      throw logStandardError(
        parsed.error,
        `failed to parse ${requestParameter}`,
      );
    }
    return parsed.data;
  }

  create() {
    const resourceFunction = async (
      args: ActionFunctionArgs | LoaderFunctionArgs,
    ) => {
      // get intent from url search params or form data
      const url = new URL(args.request.url);
      let rawFormData: FormData = new FormData();
      let rawBody: Record<string, unknown> = {};
      if (args.request.method !== "GET") {
        try {
          if (args.request.headers.get("Content-Type") === "application/json") {
            rawBody = await args.request.json();
          } else {
            rawFormData = await args.request.formData();
          }
        } catch (error) {
          return logStandardError(
            error,
            "failed to get request body or form data",
          );
        }
      }

      // verify intent
      const intent =
        url.searchParams.get(INTENT) ||
        rawFormData.get(INTENT) ||
        rawBody[INTENT] ||
        "default";
      requireTruthy(
        intent && typeof intent === "string" && intent in this.actions,
        "intent not found in action builder",
      );

      // verify intent method
      const action = this.actions[intent];
      requireTruthy(
        action.method === "ANY" || action.method === args.request.method,
        "intent found, but does not match action builder request method",
      );

      // validate everything
      const validate = action.validate || {};
      try {
        const [headers, params, query, body, formData] = await Promise.all([
          this.validate(
            "headers",
            Object.fromEntries(args.request.headers),
            validate.headers,
          ),
          this.validate("params", args.params, validate.params),
          this.validate("query", url.searchParams, validate.query),
          this.validate("body", rawBody, validate.body),
          this.validate("formData", rawFormData, validate.formData),
        ]);

        return action.handler({
          headers,
          params,
          query,
          body,
          formData,
          context: { request: args.request },
        });
      } catch (error) {
        return logStandardError(error, "failed to execute action handler");
      }
    };

    return resourceFunction;
  }
}

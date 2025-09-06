/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as actions from "../actions.js";
import type * as analytics from "../analytics.js";
import type * as applications from "../applications.js";
import type * as auth from "../auth.js";
import type * as billing from "../billing.js";
import type * as clientInvitations from "../clientInvitations.js";
import type * as clients from "../clients.js";
import type * as documents from "../documents.js";
import type * as loanFiles from "../loanFiles.js";
import type * as loanTypes from "../loanTypes.js";
import type * as messages from "../messages.js";
import type * as notifications from "../notifications.js";
import type * as permissions from "../permissions.js";
import type * as tasks from "../tasks.js";
import type * as userInvitations from "../userInvitations.js";
import type * as userInvitations_fixed from "../userInvitations_fixed.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  actions: typeof actions;
  analytics: typeof analytics;
  applications: typeof applications;
  auth: typeof auth;
  billing: typeof billing;
  clientInvitations: typeof clientInvitations;
  clients: typeof clients;
  documents: typeof documents;
  loanFiles: typeof loanFiles;
  loanTypes: typeof loanTypes;
  messages: typeof messages;
  notifications: typeof notifications;
  permissions: typeof permissions;
  tasks: typeof tasks;
  userInvitations: typeof userInvitations;
  userInvitations_fixed: typeof userInvitations_fixed;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

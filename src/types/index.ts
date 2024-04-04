import type { PlaidEventName, PlaidSelection, PlaidViewName } from './event-types';
import type { ExitStatus } from './exit-status-types';

// #region Misc
export interface PlaidAccount {
  id: string;
  name: string;
  mask: string;
  type: string;
  subtype: string;
  verification_status: string;
}

export interface PlaidInstitution {
  name: string;
  institution_id: string;
}

export interface PlaidLinkError {
  error_type: string;
  error_code: string;
  error_message: string;
  display_message: string;
}

export interface PlaidLinkOptions {
  token: string | null;
  receivedRedirectUri?: string;
  onSuccess: PlaidLinkOnSuccess;
  onExit?: PlaidLinkOnExit;
  onLoad?: () => void;
  onEvent?: PlaidLinkOnEvent;
}

export interface PlaidExitOptions {
  force?: boolean;
}
// #endregion

// #region Callbacks
export interface PlaidLinkOnSuccessMetadata {
  institution: null | PlaidInstitution;
  accounts: PlaidAccount[];
  link_session_id: string;
  transfer_status?: string;
}

export interface PlaidLinkOnExitMetadata {
  institution: PlaidInstitution | null;
  status: ExitStatus | null;
  link_session_id: string;
  request_id: string;
}

export interface PlaidLinkOnEventMetadata {
  error_type: string | null;
  error_code: string | null;
  error_message: string | null;
  exit_status: string | null;
  institution_id: string | null;
  institution_name: string | null;
  institution_search_query: string | null;
  mfa_type: string | null;
  view_name: PlaidViewName | null;
  selection: PlaidSelection | null;
  timestamp: string; // ISO 8601 format timestamp
  link_session_id: string;
  request_id: string;
}

export type PlaidLinkOnSuccess = (public_token: string, metadata: PlaidLinkOnSuccessMetadata) => void;
export type PlaidLinkOnExit = (err: PlaidLinkError | null, metadata: PlaidLinkOnExitMetadata) => void;
export type PlaidLinkOnEvent = (eventName: PlaidEventName, metadata: PlaidLinkOnEventMetadata) => void;
// #endregion

// #region Global Plaid
export interface PlaidHandler {
  open: () => void;
  exit: (options?: PlaidExitOptions) => void;
  destroy: () => void;
}

export interface PlaidEmbeddedHandler {
  destroy: () => void;
}

export interface Plaid extends PlaidHandler {
  create: (config: PlaidLinkOptions) => PlaidHandler;
  createEmbedded: (config: PlaidLinkOptions, domTarget: HTMLElement) => PlaidEmbeddedHandler;
}

declare global {
  interface Window {
    Plaid: Plaid;
  }
}
// #endregion

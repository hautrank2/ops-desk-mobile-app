import { ReactNode } from "react";

/** Normalized option shape the engine works with — entity-agnostic. */
export type SelectOption = {
  value: string;
  name: string;
  code: string;
  data?: unknown;
};

export type SelectOptionPage = {
  items: SelectOption[];
  hasNext: boolean;
  pageIndex: number;
};

/** Adapter every entity must provide: fetch one page of options from the server. */
export type FetchSelectPage = (params: {
  search: string;
  pageIndex: number;
  pageSize: number;
}) => Promise<SelectOptionPage>;

/** Adapter to resolve a single option by id — used to show the label of a preset value. */
export type FetchSelectOne = (id: string) => Promise<SelectOption | null>;

export type EntitySelectProps = {
  value?: string;
  onChange: (value: string) => void;
  fetchPage: FetchSelectPage;
  fetchOne?: FetchSelectOne;
  /** Cache/query key prefix — must include every filter the fetchPage closure depends on. */
  queryKey: unknown[];
  placeholder?: string;
  isDisabled?: boolean;
  isInvalid?: boolean;
  /** Shows a clear ("x") control — use for filters, not for required form fields. */
  isClearable?: boolean;
  pageSize?: number;
  renderOption?: (option: SelectOption) => ReactNode;
  renderTrigger?: (option: SelectOption | null) => ReactNode;
};

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { EntitySelectProps, SelectOption } from "./type";

const DEBOUNCE_MS = 300;
const DEFAULT_PAGE_SIZE = 20;

export type UseEntitySelectProps = EntitySelectProps;

export const useEntitySelect = ({
  value,
  onChange,
  fetchPage,
  fetchOne,
  queryKey,
  pageSize = DEFAULT_PAGE_SIZE,
}: UseEntitySelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [labelCache, setLabelCache] = useState<Record<string, SelectOption>>(
    {},
  );

  // Debounce the search box so we don't hit the server on every keystroke.
  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedSearch(searchText.trim()),
      DEBOUNCE_MS,
    );
    return () => clearTimeout(timer);
  }, [searchText]);

  const open = useCallback(() => {
    setHasOpenedOnce(true);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setSearchText("");
    setDebouncedSearch("");
  }, []);

  // Lazy: the list is only fetched once the dropdown has been opened at least once.
  const infiniteQuery = useInfiniteQuery({
    queryKey: [...queryKey, "select", debouncedSearch],
    queryFn: ({ pageParam }) =>
      fetchPage({ search: debouncedSearch, pageIndex: pageParam, pageSize }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.pageIndex + 1 : undefined,
    enabled: hasOpenedOnce,
  });

  const items = useMemo(
    () => infiniteQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [infiniteQuery.data],
  );

  // Label cache keyed by id: keeps the selected option's label visible even
  // after a search narrows it out of `items`, or across dropdown re-opens.
  useEffect(() => {
    if (items.length === 0) return;
    setLabelCache((prev) => {
      let changed = false;
      const next = { ...prev };
      for (const item of items) {
        if (!next[item.value]) {
          next[item.value] = item;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [items]);

  const selectedOption = value ? (labelCache[value] ?? null) : null;

  // Resolve the label of a preset value (e.g. Edit form) that isn't cached yet.
  const resolveOneQuery = useQuery({
    queryKey: [...queryKey, "select-one", value],
    queryFn: () => fetchOne!(value!),
    enabled: !!value && !selectedOption && !!fetchOne,
  });

  useEffect(() => {
    const resolved = resolveOneQuery.data;
    if (!resolved) return;
    setLabelCache((prev) =>
      prev[resolved.value] ? prev : { ...prev, [resolved.value]: resolved },
    );
  }, [resolveOneQuery.data]);

  const isResolvingPreset =
    !!value && !selectedOption && resolveOneQuery.isFetching;

  const onEndReached = useCallback(() => {
    if (infiniteQuery.hasNextPage && !infiniteQuery.isFetchingNextPage) {
      infiniteQuery.fetchNextPage();
    }
  }, [infiniteQuery]);

  const selectOption = useCallback(
    (option: SelectOption) => {
      onChange(option.value);
      close();
    },
    [onChange, close],
  );

  const clear = useCallback(() => {
    onChange("");
  }, [onChange]);

  return {
    isOpen,
    open,
    close,
    searchText,
    setSearchText,
    items,
    isLoading: infiniteQuery.isLoading,
    isFetchingNextPage: infiniteQuery.isFetchingNextPage,
    isError: infiniteQuery.isError,
    onEndReached,
    selectedOption,
    isResolvingPreset,
    selectOption,
    clear,
  };
};

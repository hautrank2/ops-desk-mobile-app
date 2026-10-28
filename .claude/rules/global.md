# Global code rules

These rules are mandatory for every new or edited file under `app/`, `components/`, `types/`, or `apis/`. Match the surrounding code when a local convention is stricter.

- Định nghĩa và sử dụng API tại `apis/` (hoặc `api/`)

## 1. Prefer arrow functions

Use arrow-function expressions for components, hooks, handlers, and helpers. Reserve `function` declarations only where hoisting is genuinely required.

```tsx
// ✅
export const formatQty = (n: number): string => n.toLocaleString();
export const TicketCard = ({ ticket }: TicketCardProps) => { ... };

// ❌
export function formatQty(n: number) { ... }
```

## 2. `type` only — never `interface`

Model every shape with `type`. Do not use `interface`.

```ts
// ✅
export type TicketCardProps = { ticket: TicketModel; compact?: boolean };

// ❌
export interface TicketCardProps {
  ticket: TicketModel;
}
```

## 3. Use Gluestack UI components + Lucide icons

- Build UI from the Gluestack UI components in `@/components/ui/` (e.g., `@/components/ui/button`, `@/components/ui/form-control`, `@/components/ui/input`, `@/components/ui/select`, `@/components/ui/vstack`). Do not hand-roll a raw `<Button>` or `<TextInput>` when a Gluestack primitive exists.
- Use icons from `lucide-react-native`. Do not add new inline SVG icon paths or use standard `lucide-react`.

```tsx
// ✅
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Plus } from "lucide-react-native";

<Button size="sm" onPress={handlePress}>
  <ButtonIcon as={Plus} className="mr-2" />
  <ButtonText>Create</ButtonText>
</Button>;
```

## 4. Never hardcode colors

Colors must come from the semantic design tokens (Tailwind / NativeWind classes matching Gluestack UI variables) so light/dark mode adapts correctly. Never write raw hex, `rgb()`, `hsl()`, or named colors.

```tsx
// ✅ semantic tokens: text-typography-900, text-typography-500, bg-background-50, border-outline-300 ...
<View className="bg-background-50 border border-outline-300 p-4 rounded-lg">
  <Text className="text-typography-900">Label</Text>
</View>

// ❌
<View style={{ color: "#111827", backgroundColor: "#fff" }} className="p-4 rounded-lg">
  <Text className="text-[#111827]">Label</Text>
</View>
```

## 5. Component props naming + folder split

- Every component defines its props as a `type` named `<ComponentName>Props`.
- A **simple** component is a single file `<ComponentName>.tsx`.
- A component with **non-trivial logic** becomes a folder with at least two files:
  - `index.tsx` — UI only; defines `<ComponentName>Props`.
  - `hook.ts` — all logic (state, effects, handlers, data shaping); defines `Use<ComponentName>Props` that **extends** the component's props, and returns what the UI needs.

```
TicketCard/
  index.tsx   // UI, exports TicketCard + TicketCardProps
  hook.ts     // useTicketCard + UseTicketCardProps
```

## 6. Optimize renders with `useMemo` / `useCallback`

Memoize derived values with `useMemo` and stable callbacks with `useCallback`, especially anything passed to child components or dependency arrays. Keep dependency arrays complete and correct.

## 7. Comments in English

Write all comments (and commit messages) in English. Keep them concise and explain _why_, not _what_.

## 8. Server state with TanStack Query

All server state (anything fetched from the API) goes through TanStack Query (`@tanstack/react-query` v5). Do **not** fetch with `useEffect` + `useState` within components, and do not keep server data in `useState`/context.

- Wrap each resource's calls in a colocated data hook or central API utility (e.g. under `@/apis/<resource>`) that return `useQuery` / `useMutation`.
- Query keys are structured arrays, most-general → most-specific: `["get", "ticket", id]`.
- After a mutation, invalidate the affected keys via `queryClient.invalidateQueries({ queryKey: ["get", "ticket"] })`.
- Use the v5 object API and status flags (`isPending`, `isError`, `error`).

```ts
// ✅
export const useTickets = (query: TicketQueryModel) =>
  useQuery({
    queryKey: ["get", "tickets", query],
    queryFn: () => ticketApis.getList(query),
  });
```

---

## Project-Specific Conventions

- **Imports**: Import via the `@/` alias (e.g., `@/components/ui`, `@/lib`, `@/types`, `@/apis`).
- **AsyncStorage**: Use `@react-native-async-storage/async-storage` instead of browser `localStorage`. Retrieve tokens from `LOCAL_KEYS.TOKEN` correctly parsing JSON if needed.
- **Multipart Uploads (React Native fetch bug)**: Native React Native Hermes engine + Axios has a known bug where the Content-Type boundary header is not set correctly for `FormData` uploads. Always use standard Native `fetch` with raw `FormData` for multipart file uploads (such as creating tickets or comments with attachments), omitting the `Content-Type` header entirely so the engine sets the correct multipart boundary.
- **Expo Router Navigation**: Use `expo-router`'s `router.push`, `router.back`, and `useLocalSearchParams` for navigation and reading params.

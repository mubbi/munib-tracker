import type { TestInstance } from "test-renderer";

/**
 * Props of the nearest composite ancestor (including the host itself) matching
 * `predicate` — for reaching callbacks a host element never receives, e.g.
 * RN `Pressable`'s `style` function or a mocked third-party component's
 * `onChangeJS`. Throws when nothing matches.
 */
export function ancestorProps<P extends Record<string, unknown>>(
  host: TestInstance,
  predicate: (props: Record<string, unknown>) => boolean,
): P {
  let fiber = host.unstable_fiber;
  while (fiber) {
    const props = fiber.memoizedProps as Record<string, unknown> | null;
    if (props && predicate(props)) return props as P;
    fiber = fiber.return;
  }
  throw new Error("No ancestor matched the predicate");
}

/** RN `Pressable` props (its `style` is a function of the interaction state). */
export function pressableProps<P extends Record<string, unknown>>(host: TestInstance): P {
  return ancestorProps<P>(host, (props) => typeof props.style === "function");
}

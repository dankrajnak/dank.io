export default function MemoService<A extends unknown[], R = unknown>(
  func: (...arg0: A) => R
): (...arg0: A) => R {
  const store: Map<string, R> = new Map();
  return (...args: A) => {
    // TODO: in some cases, stringify might be more expensive than the actual function
    // Need to figure out if there's some way we could hash args.
    const key = JSON.stringify(args);
    if (store.has(key)) {
      const returnItem: R | undefined = store.get(key);
      // Check for undefined is really just for typescript.  Not actually necessary.
      if (returnItem) {
        return returnItem;
      } else {
        return func(...args);
      }
    } else {
      const result = func(...args);

      store.set(key, result);
      return result;
    }
  };
}

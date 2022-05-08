/**
 * Return a function that will call all functions in the order they were chained with the same arguments.
 */
export function chain(...callbacks: any[]) {
  return (...args: any[]) => {
    for (const callback of callbacks) {
      if (typeof callback === "function") {
        callback(...args);
      }
    }
  };
}

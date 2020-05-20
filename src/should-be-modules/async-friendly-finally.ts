
/**
 * Implement a finally function that gets called when the first callback completes,
 * even if it throws an exception.  If the callback returns a promise, the finally
 * function will only be called after the promise is complete, either when it is
 * resolved successfully or if it is rejected due to an exception.
 * @param workFn The function to call, which may or may not be an async funtion returning a promise
 * @param finallyFn_ToCallAfterWorkFnHasSucceededOrFailed The function to call after the callback completes (but not until after any
 * promise the callback returns has been resolved or rejected).
 * @returns The result of the callback function.
 */
export function asyncFriendlyFinally<T>(
    workFn: () => T,
    finallyFn_ToCallAfterWorkFnHasSucceededOrFailed: () => unknown
  ): T {
      // We'll have two different mechanisms for ensuring the finallyFn is called, depending
      // on whether the callback is an async function which should not be treated as
      // complete until the promise it returns has completed.
      var finallyCannotBeCalledUntilAsyncCallbacksPromiseCompletes = false;
  
      // For non-async callbacks, this try-finally block will ensure that we can
      // call the finally function regardless of whether workFn completes successfully
      // or even if an exception is thrown.
      try {
        // Call the work function
        const result: T = workFn();
  
        // Now we can test if the callback is an async function by seeing if it returned a promise.
        if (typeof(result) === "object" && result instanceof Promise) {
          // make sure we call the finallyFn AFTER the callback's promise completes
          result.finally( finallyFn_ToCallAfterWorkFnHasSucceededOrFailed )
          // Since this is not an async function (it can't return a promise unless the callback
          // returns a promise) the finally block below will run before the async callback completes.
          // Make sure the finally block below does not run, as we'll rely on the call above.
          finallyCannotBeCalledUntilAsyncCallbacksPromiseCompletes = true;
        }
  
        // We return the result of the callback to the caller.
        // If the callback was a async function, we return the (still unresolved) promise,
        // since we're not waiting for it.
        return result;
      } finally {
        // Call the finallyFn, unless we're returning a promise and need to wait for it to complete.
        // (If so, the result.finally call above will ensure the finallyFn is called.)
        if (!finallyCannotBeCalledUntilAsyncCallbacksPromiseCompletes) {
          finallyFn_ToCallAfterWorkFnHasSucceededOrFailed();
        }
      }
  }
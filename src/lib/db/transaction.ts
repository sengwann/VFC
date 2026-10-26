import "server-only";

import { isSerializationConflict } from "./retry";

export { isSerializationConflict } from "./retry";

export async function withSerializableRetry<T>(
  operation: () => Promise<T>,
  retries = 3,
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (isSerializationConflict(error) && retries > 0) {
      const attempt = 4 - retries;
      const backoffMs = 50 * attempt;
      const jitterMs = Math.random() * 50;

      await new Promise((resolve) => setTimeout(resolve, backoffMs + jitterMs));

      return withSerializableRetry(operation, retries - 1);
    }

    throw error;
  }
}

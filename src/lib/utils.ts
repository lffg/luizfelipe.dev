export class AllSettledManager {
  private errors: unknown[] = [];

  unwrapOk<T>(data: PromiseSettledResult<T>[]): T[] {
    const ok = [];
    for (const element of data) {
      switch (element.status) {
        case "fulfilled":
          ok.push(element.value);
          break;
        case "rejected":
          this.errors.push(element.reason);
          break;
      }
    }
    return ok;
  }

  assertNoErrors() {
    if (this.errors.length > 0) {
      throw new AggregateError(this.errors);
    }
  }
}

export function ensureString(
  maybe: unknown,
  message: string,
  Class = Error
): string {
  if (!maybe) {
    throw new Class(message);
  }
  if (typeof maybe !== "string") {
    throw new Error(
      [
        `Invalid property. Expected string, got type ${typeof maybe}.`,
        "Raised near error:",
        `  ${message}`,
      ].join("\n")
    );
  }
  return maybe;
}

export function assertNever(val: never) {
  throw new Error("Unreachable.");
}

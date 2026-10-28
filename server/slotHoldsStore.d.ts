export function createSlotHoldsMiddleware(): (
  req: import("http").IncomingMessage,
  res: import("http").ServerResponse,
  next: () => void,
) => void;

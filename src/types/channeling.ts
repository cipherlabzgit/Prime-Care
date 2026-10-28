export interface SessionTimeSlot {
  id: number;
  /** Unique id used for temporary holds (may be derived from session + time). */
  channelSlotId: number;
  /** ERP slot id sent at checkout when it differs from the hold id. */
  checkoutSlotId?: number;
  time: string;
  label: string;
  available: boolean;
}

/** Checkout payment options sent to the channeling ERP API. */
export type ChannelingPaymentMethod = "Cash" | "Card";

export const PAYMENT_METHOD_LABELS: Record<ChannelingPaymentMethod, string> = {
  Cash: "Pay cash at hospital",
  Card: "Pay by card online",
};

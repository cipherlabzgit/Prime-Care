export interface SessionTimeSlot {
  id: number;
  channelSlotId: number;
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

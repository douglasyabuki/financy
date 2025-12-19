import {
  BaggageClaim,
  BookOpen,
  BriefcaseBusiness,
  CarFront,
  Dumbbell,
  Gift,
  HeartPulse,
  House,
  Mailbox,
  PawPrint,
  PiggyBank,
  ReceiptText,
  ShoppingCart,
  Ticket,
  ToolCase,
  Utensils,
  type LucideIcon,
} from "lucide-react";

export type CategoryColor =
  | "GREEN"
  | "BLUE"
  | "PURPLE"
  | "PINK"
  | "ORANGE"
  | "RED"
  | "YELLOW";

export const CategoryIcons: Record<string, LucideIcon> = {
  BRIEFCASE_BUSINESS: BriefcaseBusiness,
  CAR_FRONT: CarFront,
  HEART_PULSE: HeartPulse,
  PIGGY_BANK: PiggyBank,
  SHOPPING_CART: ShoppingCart,
  TICKET: Ticket,
  TOOL_CASE: ToolCase,
  UTENSILS: Utensils,
  PAW_PRINT: PawPrint,
  HOUSE: House,
  GIFT: Gift,
  DUMBBELL: Dumbbell,
  BOOK_OPEN: BookOpen,
  BAGGAGE_CLAIM: BaggageClaim,
  MAILBOX: Mailbox,
  RECEIPT_TEXT: ReceiptText,
};

export type CategoryIcon = keyof typeof CategoryIcons;

import { ReactNode } from "react";

export interface ModalConfig {
  title?: string;
  description?: string;
  content?: ReactNode;
  footer?: ReactNode;
}

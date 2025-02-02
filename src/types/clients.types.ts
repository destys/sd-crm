"use strict";

import { ImageProps } from "./global.types";

export interface ClientItemProps {
  id: number;
  documentId: string;
  title: string;
  email?: string;
  phone?: string;
  avatar?: ImageProps;
}

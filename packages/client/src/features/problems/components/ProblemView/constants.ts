import { LANGUAGE_LABELS } from "@/utils/user-preferences";

export const SUPPORTED_LANGUAGES = Object.entries(LANGUAGE_LABELS).map(
  (arr) => ({
    label: arr[1],
    value: arr[0],
  }),
);

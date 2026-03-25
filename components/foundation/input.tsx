import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

import { cn } from "@/lib/utils/cn";

const fieldClassName =
  "w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-primary)] shadow-[var(--shadow-sm)] outline-none transition-colors duration-[var(--transition-fast)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-strong)]";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldClassName, props.className)} {...props} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldClassName, "min-h-32", props.className)} {...props} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(fieldClassName, props.className)} {...props} />;
}

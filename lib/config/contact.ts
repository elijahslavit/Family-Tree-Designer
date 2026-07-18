import { isPlaceholderSupportEmail, productConfig } from "@/lib/config/product";

/**
 * Contact details for public pages. While NEXT_PUBLIC_SUPPORT_EMAIL is still the
 * placeholder, no address is printed and no dead mailto link is rendered — a
 * broken enquiry link costs more than a missing one.
 */
export function getContact() {
  const configured = !isPlaceholderSupportEmail();

  return {
    configured,
    email: configured ? productConfig.supportEmail : null,
    /** Null while unconfigured, so callers can fall back to an internal page. */
    mailto: (subject: string) =>
      configured
        ? `mailto:${productConfig.supportEmail}?subject=${encodeURIComponent(subject)}`
        : null,
  };
}

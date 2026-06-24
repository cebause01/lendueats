const MERCHANT_QR_PREFIX = "lendueats:";

export function merchantQrPayload(merchantId: string): string {
  return `${MERCHANT_QR_PREFIX}${merchantId}`;
}

export function parseMerchantQr(text: string): string | null {
  const trimmed = text.trim();
  if (trimmed.toLowerCase().startsWith(MERCHANT_QR_PREFIX)) {
    const id = trimmed.slice(MERCHANT_QR_PREFIX.length);
    return id || null;
  }
  return null;
}

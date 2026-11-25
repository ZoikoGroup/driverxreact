/**
 * IMEI validation.
 *
 * A real IMEI is exactly 15 digits, and the last digit is a Luhn check digit
 * calculated from the first 14. A typo or made-up number almost always fails
 * this check, so we can reject it before calling any compatibility service.
 * (Dial *#06# on the phone to see its IMEI.)
 */

/** Luhn checksum over a string of digits. */
function passesLuhn(digits: string): boolean {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

/** Strip spaces, dashes and slashes people often paste with an IMEI. */
export function cleanImei(raw: string): string {
  return raw.replace(/[\s\-/]/g, "").trim();
}

/**
 * Returns an error message if the IMEI is not valid, or null if it is.
 * Pass the already-cleaned value (see cleanImei).
 */
export function getImeiError(imei: string): string | null {
  if (!imei) return "Please enter your IMEI number.";
  if (!/^\d+$/.test(imei)) return "An IMEI number contains digits only.";
  if (imei.length !== 15) {
    return `An IMEI number is 15 digits — you entered ${imei.length}. Dial *#06# on your phone to see it.`;
  }
  if (/^(\d)\1{14}$/.test(imei) || !passesLuhn(imei)) {
    return "This is not a valid IMEI number. Please check it and try again (dial *#06# on your phone to see it).";
  }
  return null;
}

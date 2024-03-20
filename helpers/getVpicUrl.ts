import { VPIC_URL_PARAMS, VPIC_URL } from "../constants/urls.js";

export function getVpicUrl(vin: string) {
  return `${VPIC_URL}${vin}${VPIC_URL_PARAMS}`;
}

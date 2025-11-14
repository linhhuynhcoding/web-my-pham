import envConfig from "../config";
import { getAuthHeaders, handleResponse } from "./cart";
import { LoadCheckoutPageRequest, LoadCheckoutPageResponse } from "./types";

export const loadCheckoutPage = async (
  request: LoadCheckoutPageRequest
): Promise<LoadCheckoutPageResponse> => {
  const baseUrl = envConfig.VITE_API_BASE_URL;
  const response = await fetch(`${baseUrl}/api/checkout/load`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(request),
  });
  return handleResponse(response);
};
import envConfig from "../config";
import { getAuthHeaders, handleResponse } from "./cart";
import { GetOrderResponse, LoadCheckoutPageRequest, LoadCheckoutPageResponse, PlaceOrderRequest, PlaceOrderResponse } from "./types";

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

export const getOrder = async (orderId: string): Promise<GetOrderResponse> => {
  const baseUrl = envConfig.VITE_API_BASE_URL;
  const response = await fetch(`${baseUrl}/api/orders/${orderId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};


export const placeOrder = async (
  request: PlaceOrderRequest
): Promise<PlaceOrderResponse> => {
  const baseUrl = envConfig.VITE_API_BASE_URL;
  const response = await fetch(`${baseUrl}/api/orders`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(request),
  });
  return handleResponse(response);
};

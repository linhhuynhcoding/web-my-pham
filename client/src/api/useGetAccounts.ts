import { useQuery } from "@tanstack/react-query";
import { getAccounts } from "@/api/admin";
import { LoadAccountsRequest, LoadAccountsResponse } from "./types";

export const GET_ACCOUNTS_QUERY_KEY = "accounts";

/**
 * Custom hook to fetch user accounts with pagination.
 * @param params - The request parameters, including pagination.
 * @returns The result of the react-query useQuery hook.
 */
export const useGetAccounts = (params: LoadAccountsRequest) => {
  return useQuery<LoadAccountsResponse, Error>({
    queryKey: [GET_ACCOUNTS_QUERY_KEY, params],
    queryFn: () => getAccounts(params),
  });
};
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { login, register, LoginRequest, LoginResponse } from '../api/auth';
import { RegisterRequest, RegisterResponse } from '../api/types'; 

export const useLogin = (
  options?: UseMutationOptions<LoginResponse, Error, LoginRequest>
) => {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: login,
    ...options,
  });
};

export const useRegister = (
  options?: UseMutationOptions<RegisterResponse, Error, RegisterRequest>
) => {
  return useMutation<RegisterResponse, Error, RegisterRequest>({
    mutationFn: register,
    ...options,
  });
};
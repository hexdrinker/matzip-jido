import {UseMutationOptions, UseQueryOptions} from '@tanstack/react-query';
import {AxiosError} from 'axios';

type ResponseType = AxiosError<{
  statusCode: string;
  message: string;
  error: string;
}>;

type UseMutationCustomOptions<TData = unknown, TVariables = unknown> = Omit<
  UseMutationOptions<TData, Error, TVariables, unknown>,
  'mutationFn'
>;

type UseQueryCustomOptions<TQueryFnData = unknown, TData = TQueryFnData> = Omit<
  UseQueryOptions<TQueryFnData, Error, TData, TQueryKey>,
  'queryKey'
>;

export type {ResponseType, UseMutationCustomOptions, UseQueryCustomOptions};

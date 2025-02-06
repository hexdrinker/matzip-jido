import {useMutation, useQuery} from '@tanstack/react-query';
import {useEffect} from 'react';
import {
  getAccessToken,
  getProfile,
  logout,
  postLogin,
  postSignup,
} from '~/api/auth';
import queryClient from '~/api/queryClient';
import {numbers, queryKeys, storageKeys} from '~/constants';
import {UseMutationCustomOptions, UseQueryCustomOptions} from '~/types/common';
import {
  removeEncryptStorage,
  removeHeader,
  setEncryptStorage,
  setHeader,
} from '~/utils';

function useSignup(mutationOptions?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: postSignup,
    ...mutationOptions,
  });
}

function useLogin(mutationOptions?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: postLogin,
    onSuccess: ({accessToken, refreshToken}) => {
      setHeader('Authorization', `Bearer ${accessToken}`);
      setEncryptStorage(storageKeys.REFRESH_TOKEN, refreshToken);
    },
    onSettled: () => {
      queryClient.refetchQueries({
        queryKey: [queryKeys.AUTH, queryKeys.GET_ACCESS_TOKEN],
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.AUTH, queryKeys.GET_PROFILE],
      });
    },
    ...mutationOptions,
  });
}

function useGetRefreshToken() {
  const {data, isSuccess, isError} = useQuery({
    queryKey: [queryKeys.AUTH, queryKeys.GET_ACCESS_TOKEN],
    queryFn: getAccessToken,
    staleTime: numbers.ACCESS_TOKEN_REFRESH_TIME,
    refetchInterval: numbers.ACCESS_TOKEN_REFRESH_TIME,
    refetchOnReconnect: true,
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (isSuccess) {
      setEncryptStorage(storageKeys.REFRESH_TOKEN, data.refreshToken);
      setHeader('Authorization', `Bearer ${data.accessToken}`);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      removeEncryptStorage(storageKeys.REFRESH_TOKEN);
      removeHeader('Authorization');
    }
  }, [isError]);

  return {isSuccess, isError};
}

function useGetProfile(queryOptions?: UseQueryCustomOptions) {
  return useQuery({
    queryFn: getProfile,
    queryKey: [queryKeys.AUTH, queryKeys.GET_PROFILE],
    ...queryOptions,
  });
}

function useLogout(mutationOptions?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      removeEncryptStorage(storageKeys.REFRESH_TOKEN);
      removeHeader('Authorization');
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: [queryKeys.AUTH]});
    },
    ...mutationOptions,
  });
}

function useAuth() {
  const signupMutation = useSignup();
  const refreshTokenQuery = useGetRefreshToken();
  const getProfileQuery = useGetProfile({
    enabled: refreshTokenQuery.isSuccess,
  });
  const isLogin = getProfileQuery.isSuccess;
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  return {
    signupMutation,
    loginMutation,
    isLogin,
    getProfileQuery,
    logoutMutation,
  };
}

export default useAuth;

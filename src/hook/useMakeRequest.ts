/* eslint-disable @typescript-eslint/no-explicit-any */

import { type KeyValueObj } from "../types/others";
import { useAxiosAuth } from "./useAxiosAuth";
import useLogout from "./useLogout";
import { toast } from "sonner";

interface IRequestOptions {
  successMessageTitle?: string;
  dontNotifyonFail?: boolean;
  dontNotifyOnSucess?: boolean;
  useToast?: boolean;
}

export function useMakeRequest() {
  const axiosAuth = useAxiosAuth();
  const logout = useLogout();

  return async (
    url: string,
    method: string,
    formData: KeyValueObj,
    onSuccess: (
      data?: any,
      metadata?: any,
      pagination?: any,
      headers?: any
    ) => void,
    onFail: (error?: any) => void,
    onFinally: () => void,
    options?: IRequestOptions
  ) => {
    const dontNotifyOnSucess = options?.dontNotifyOnSucess;
    const dontNotifyonFail = options?.dontNotifyonFail;

    try {
      const response = await axiosAuth[method.toLowerCase()](url, formData);
      if (response.data.status) {
        const { message, data, metadata, pagination } = response.data;
        const responseHeader = response?.config?.headers;

        if (!dontNotifyOnSucess) {
          if (typeof message === "string" && message?.length > 0) {
            toast.success(message);
          } else if (Array.isArray(message)) {
            message?.map((mess: string) => toast.success(mess));
          } else {
            toast.success("Operation successful");
          }
        }

        onSuccess(data, metadata, pagination, responseHeader);
        return data;
      } else {
        const message = response?.data?.message;
        if (message) {
          if (typeof message === "string" && message.length > 0) {
            toast.error(message);
          } else if (typeof message === "object") {
            message?.map((mess: string) => toast.error(mess));
          } else {
            toast.error("Something went wrong, please try again.");
          }
        } else {
          toast.error("Something went wrong, please try again.");
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err?.response?.request?.status === 401) {
        return logout(true);
      }
      if (!dontNotifyonFail) {
        const message = err?.response?.data?.message;
        if (message) {
          if (typeof message === "string" && message.length > 0) {
            toast.error(message);
          } else if (typeof message === "object") {
            message?.map((mess: string) => toast.error(mess));
          } else {
            toast.error("Something went wrong, please try again");
          }
        } else {
          toast.error("Something went wrong, please try again");
        }
      }

      onFail(err);
    } finally {
      onFinally();
    }
  };
}

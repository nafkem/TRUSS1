import { useEffect } from "react";
import { axiosAuth } from "../axios/axios";

export function useAxiosAuth() {
  const token = localStorage.getItem("_dl_token") || "";

  useEffect(() => {
    const requestIntercept = axiosAuth.interceptors.request.use(
      (config) => {
        if (!config?.headers?.["authorization"]) {
          //config.headers["Authorization"] = auth.authToken;
          config.headers!["authorization"] = "Bearer " + token;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosAuth.interceptors.response.use(
      (response) => response
    );

    return () => {
      axiosAuth.interceptors.request.eject(requestIntercept);
      axiosAuth.interceptors.response.eject(responseIntercept);
    };
  }, []);

  return axiosAuth as any;
}

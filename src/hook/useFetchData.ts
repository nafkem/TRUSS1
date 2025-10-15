/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useAxiosAuth } from "./useAxiosAuth";
import useLogout from "./useLogout";
import { toast } from "sonner";

interface IPagination {
  current_page: number | null;
  next_page: number | null;
  prev_page: number | null;
  total_count: number | null;
  total_pages: number | null;
}

export const useFetchData = <T>(url: string) => {
  const [response, setResponse] = useState<T | null>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState<any>({});

  const [pagination, setPagination] = useState<IPagination>({
    current_page: 0,
    next_page: null,
    prev_page: null,
    total_count: 0,
    total_pages: 0,
  });
  const [requestUrl, setrequestUrl] = useState("");
  const logout = useLogout();

  const axiosAuth = useAxiosAuth();
  useEffect(() => {
    axiosCall(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  async function axiosCall(url: string) {
    setrequestUrl(url);
    setLoading(true);
    try {
      const res = await axiosAuth.get(url);
      if (res.data.status || res.data.success) {
        setMeta(res?.data?.metadata);
        setPagination(res?.data?.pagination);
        setResponse(res?.data?.data);
        setError("");
      } else {
        setError("Something went wrong");
      }
    } catch (err: any) {
      if (err?.response?.status === 401 || err?.status === 401) {
        toast.info("Unauthorized, kindly login to continue");
        return logout(true);
      }
      setError(err);
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  function refetch(url?: string) {
    axiosCall(url || requestUrl);
  }

  return { data: response, error, loading, meta, refetch, pagination };
};

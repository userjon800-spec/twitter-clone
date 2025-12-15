// import fetcher from "@/lib/fetcher";
import useSWR from "swr";
const fetcher = (url: string) => fetch(url).then(res => res.json());
const useNotifications = (id: string) => {
  let { data, error, mutate } = useSWR(`/api/notifications/${id}`, fetcher);
  return { data: data || [], isLoading: !error && !data,isError: error, mutate };
};

export default useNotifications;

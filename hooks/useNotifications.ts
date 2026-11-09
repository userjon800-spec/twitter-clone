import useSWR from "swr";
const fetcher = (url: string) => fetch(url).then((res) => res.json());
const useNotifications = (id: string) => {
  let { data, error, mutate } = useSWR(
    id ? `/api/notifications/${id}` : null,
    fetcher,
  );
  return {
    data: data || [],
    isLoading: Boolean(id) && !error && !data,
    isError: error,
    mutate,
  };
};
export default useNotifications;

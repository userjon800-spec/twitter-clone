import fetcher from "@/lib/fetcher";
import useSWR from "swr";
let useUsers = (limit: number) => {
  let { data, error, isLoading, mutate } = useSWR(
    `api/users?limit=${limit}`,
    fetcher
  );
  return {
    users: data,
    isLoading,
    isError: error,
    mutate,
  };
};
export { useUsers };

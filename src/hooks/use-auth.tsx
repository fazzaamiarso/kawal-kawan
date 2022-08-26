import { trpc } from "@/utils/trpc";

export function useAuth() {
  const { data: user, isLoading } = trpc.useQuery(["user.user"], { refetchOnWindowFocus: false });

  return {
    user: user?.user,
    isLoading,
  };
}

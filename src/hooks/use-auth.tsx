import { trpc } from "@/utils/trpc";

export function useAuth() {
  const { data: user, isLoading } = trpc.useQuery(["user.user"]);

  return {
    user,
    isLoading,
  };
}

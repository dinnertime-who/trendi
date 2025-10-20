"use client";

import { wait } from "@shared/utils";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";

export const TestComponent = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["test"],
    queryFn: async () => {
      await wait(1000);
      return "message";
    },
  });

  if (isLoading) return <Spinner />;

  if (isError) return <div>Error</div>;

  return <div>{data}</div>;
};

"use client";

import { wait } from "@shared/utils";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import { publicEnv } from "@/lib/env";

export const TestComponent = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["test"],
    queryFn: async () => {
      await wait(1000);
      const result = await fetch(publicEnv.NEXT_PUBLIC_API_URL).then((res) =>
        res.text(),
      );
      return result;
    },
  });

  if (isLoading) return <Spinner />;

  if (isError) return <div>Error</div>;

  return <div>{data}</div>;
};

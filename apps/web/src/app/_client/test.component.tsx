"use client";

import { wait } from "@shared/utils";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import { testRpc } from "@/lib/rpc/test.rpc";

export const TestComponent = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["test"],
    queryFn: async () => {
      await wait(1000);
      const result = await testRpc.index
        .$get({ query: { title: "test", body: "test" } })
        .then((res) => res.json());
      return result.message;
    },
  });

  if (isLoading) return <Spinner />;

  if (isError) return <div>Error</div>;

  return <div>{data}</div>;
};

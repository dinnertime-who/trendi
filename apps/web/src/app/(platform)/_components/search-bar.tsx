"use client";

import { SearchIcon } from "lucide-react";
import Form from "next/form";
import { useRouter } from "next/navigation";
import z from "zod";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useSearchByQ } from "@/hooks/use-search-by-q";
import { cn } from "@/lib/utils";

const schema = z.object({
  q: z.string(),
});

export const SearchBar = () => {
  const router = useRouter();
  const { q } = useSearchByQ();

  const handleSearch = (formData: FormData) => {
    const { q } = schema.parse({ q: formData.get("q") });
    router.push(`/search?q=${q}`);
  };

  return (
    <Form className="w-full" action={handleSearch}>
      <InputGroup className="bg-background">
        <InputGroupInput
          className="w-full"
          placeholder="배우고 싶은 것을 검색해보세요"
          defaultValue={q}
          name="q"
        />
        <InputGroupAddon align="inline-end">
          <button className={cn()} type="submit">
            <SearchIcon className="size-5 mx-1 opacity-50 cursor-pointer" />
          </button>
        </InputGroupAddon>
      </InputGroup>
    </Form>
  );
};

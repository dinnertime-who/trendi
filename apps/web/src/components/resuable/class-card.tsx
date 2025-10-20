import { Heart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ClassNameProps } from "@/type/classname-props.type";
import { Badge } from "../ui/badge";

type Props = ClassNameProps & {
  href: React.ComponentProps<typeof Link>["href"];
  category: string;
  title: string;
  tutor: string;
  originalPrice: number;
  salePrice: number;
  discountRate: number;
  reviewCount: number;
  reviewRating: number;
  thumbnailUrl: string;
};

export const ClassCard = ({
  className,
  href,
  category,
  title,
  tutor,
  originalPrice,
  salePrice,
  discountRate,
  reviewCount,
  reviewRating,
  thumbnailUrl,
}: Props) => {
  return (
    <div
      className={cn(
        "relative hover:-translate-y-1 transition-all duration-300 ease-out ",
        className,
      )}
    >
      <div className="absolute right-3 top-3 z-20 flex cursor-pointer">
        <div className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black/30">
          <Heart className="h-4 w-4 text-white" />
        </div>
      </div>

      <Link href={href} className="flex flex-col">
        <Image
          className="aspect-video object-cover object-center relative overflow-hidden rounded-lg w-full"
          src={thumbnailUrl}
          alt={title}
          width={640}
          height={360}
        />

        <Badge variant={"secondary"} className="rounded-full my-2">
          {category}
        </Badge>

        <h3 className="text-[0.93rem] font-semibold line-clamp-1">{title}</h3>

        <div className="text-sm text-muted-foreground flex items-center gap-0.5">
          <span className="flex items-center gap-0.5">
            <Star className="h-3 w-3 fill-current text-yellow-500" />
            {reviewRating}
          </span>
          <span>({reviewCount.toLocaleString()})</span>
          <span className="inline-block mx-0.5">·</span>
          <p>{tutor}</p>
        </div>

        <div>
          <span className="text-xs text-muted-foreground/80 line-through">
            {originalPrice.toLocaleString()}원
          </span>

          <div className="flex items-center gap-1 text-base">
            <span className="text-rose-500 font-semibold">{discountRate}%</span>
            <span className="font-bold">{salePrice.toLocaleString()}원</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

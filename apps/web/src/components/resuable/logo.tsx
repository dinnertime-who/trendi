import Link from "next/link";
import { cn } from "@/lib/utils";
import { ClassNameProps } from "@/type/classname-props.type";

type Props = ClassNameProps;

export const Logo = ({ className }: Props) => {
  return (
    <Link href="/" className={cn("flex items-center space-x-2", className)}>
      {/* TODO: 실제 로고로 변경하기 */}
      <div className="text-2xl font-bold text-primary">TRENDI</div>
    </Link>
  );
};

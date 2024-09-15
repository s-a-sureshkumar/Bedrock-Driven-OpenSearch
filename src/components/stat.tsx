import { Divider } from "@/components/divider";
import formatPrice from "@/util/format-price";

export default function Stat({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div>
      <Divider />
      <div className="mt-6 text-lg/6 font-medium sm:text-sm/6">{title}</div>
      <div className="mt-3 text-3xl/8 font-semibold sm:text-2xl/8">
        {formatPrice(value)}
      </div>
    </div>
  );
}

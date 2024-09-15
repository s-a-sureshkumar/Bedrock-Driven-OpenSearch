export default function formatPrice(price: number) {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 5,
  }).format(price);
  return (
    <>
      {formattedPrice} <span className="text-zinc-500">ETH</span>
    </>
  );
}

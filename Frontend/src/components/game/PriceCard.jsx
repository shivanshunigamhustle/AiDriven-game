export default function PriceCard({ price }) {
  return (
    <div className="text-green-400 text-xl font-bold">
      ₹{price}
    </div>
  );
}
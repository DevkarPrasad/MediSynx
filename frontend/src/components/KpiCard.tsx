interface KpiCardProps {
  title: string;
  value: string | number;
}

export default function KpiCard({ title, value }: KpiCardProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md flex flex-col items-center text-center">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-2xl font-bold text-blue-600">{value}</p>
    </div>
  );
}

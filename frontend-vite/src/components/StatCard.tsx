import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: "up" | "down";
  trendValue?: string;
  icon?: LucideIcon;
  color?: string;
  highlighted?: boolean;
}

export function StatCard({
  title,
  value,
  trend,
  trendValue,
  icon: Icon,
  highlighted = false,
}: StatCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-6
      bg-white
      border border-gray-100
      transition-all duration-300
      hover:shadow-xl hover:-translate-y-1
      ${highlighted ? "ring-2 ring-emerald-400" : ""}
      `}
    >
      {/* Background Icon */}
      {Icon && (
        <div className="absolute right-5 top-5 text-gray-100">
          <Icon size={60} />
        </div>
      )}

      <div className="relative z-10">
        {/* Title */}
        <p className="text-sm font-medium text-gray-500">
          {title}
        </p>

        {/* Value */}
        <h3 className="text-3xl font-bold text-gray-900 mt-2">
          {value}
        </h3>

        {/* Trend Badge */}
        {trend && trendValue && (
          <div className="mt-3">
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                trend === "up"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-rose-100 text-rose-700"
              }`}
            >
              {trend === "up" ? "↑" : "↓"} {trendValue}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
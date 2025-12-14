
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  change?: number;
  className?: string;
  loading?: boolean;
}

export const StatCard = ({
  title,
  value,
  icon,
  description,
  change,
  className,
  loading = false,
}: StatCardProps) => {
  return (
    <div
      className={cn(
        "bg-white rounded-lg border border-gray-100 shadow-sm p-6 relative overflow-hidden",
        className
      )}
    >
      {loading ? (
        <div className="animate-pulse">
          <div className="h-5 w-1/3 bg-gray-200 rounded mb-2"></div>
          <div className="h-8 w-1/2 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">{title}</h3>
              <div className="mt-1 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{value}</p>
              </div>
              {description && <p className="mt-1 text-xs text-gray-600">{description}</p>}
            </div>
            {icon && <div className="text-brand-purple">{icon}</div>}
          </div>

          {typeof change !== "undefined" && (
            <div className="mt-4 flex items-center">
              <span
                className={cn(
                  "text-xs font-medium",
                  change >= 0 ? "text-green-600" : "text-red-600"
                )}
              >
                {change >= 0 ? "+" : ""}
                {change}%
              </span>
              <span className="ml-1 text-xs text-gray-500">vs. last period</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

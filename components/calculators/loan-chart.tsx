"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { formatVnd } from "@/lib/utils";

type LoanChartProps = { data: Array<{ year: number; balance: number }> };

export default function LoanChart({ data }: LoanChartProps) {
  return (
    <div className="h-48" aria-label="Biểu đồ dư nợ tham khảo">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="loan-balance-chart" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1687ff" stopOpacity={0.5} />
              <stop offset="1" stopColor="#1687ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="year" stroke="#718198" fontSize={10} />
          <Tooltip formatter={(value) => formatVnd(Number(value))} contentStyle={{ background: "#071a30", border: "1px solid #1687ff55", fontSize: 11 }} />
          <Area type="monotone" dataKey="balance" stroke="#54c4ff" fill="url(#loan-balance-chart)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

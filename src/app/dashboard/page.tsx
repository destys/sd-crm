import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { month: "Январь", income: 1860000, outcome: 80000 },
  { month: "Февраль", income: 0, outcome: 0 },
  { month: "Март", income: 0, outcome: 0 },
  { month: "Апрель", income: 0, outcome: 0 },
  { month: "Май", income: 0, outcome: 0 },
  { month: "Июнь", income: 0, outcome: 0 },
  { month: "Июль", income: 0, outcome: 0 },
  { month: "Август", income: 0, outcome: 0 },
  { month: "Сентябрь", income: 0, outcome: 0 },
  { month: "Октябрь", income: 0, outcome: 0 },
  { month: "Ноябрь", income: 0, outcome: 0 },
  { month: "Декабрь", income: 0, outcome: 0 },
]

const chartConfig = {
  income: {
    label: "Приход",
    color: "#2563eb",
  },
  outcome: {
    label: "Расход",
    color: "#60a5fa",
  },
} satisfies ChartConfig


export const DashboardPage = () => {
  return (
    <div className="grid grid-cols-2">
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="income" fill="var(--color-income)" radius={4} />
          <Bar dataKey="outcome" fill="var(--color-outcome)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}

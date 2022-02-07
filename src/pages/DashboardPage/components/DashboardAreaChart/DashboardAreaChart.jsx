import React from 'react';
import './DashboardAreaChart.scss';
import {
  AreaChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Area
} from 'recharts';

const chartData = [
  {
    name: "Fri",
    Emmited: 3000
  },
  {
    name: 'Sat',
    Emmited:3000
  },
  {
    name: "Sun",
    Emmited: 4000
  },

  {
    name: "Mon",
    Emmited: 4000
  },
  {
    name: 'Tue',
    Emmited: 4000
  },
  {
    name: "Wed",
    Emmited: 5500
  },

  {
    name: "Thu",
    Emmited: 5500
  },
]

const DashboardAreaChart = () => {
  return(
    <div className="area-chart">
      <ResponsiveContainer  width="100%" height={330}>
      <AreaChart
        data = {chartData}
        margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
      >
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EB8A1F" stopOpacity={0.24} />
            <stop offset="100%" stopColor="#EB8A1F" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip
          contentStyle={{
            background: '#101115',
            border: 'none',
            borderRadius: "5px"
          }}
          cursor={{ strokeWidth: .5 }}
        />
        <Area type="monotone" dataKey="Emmited" stroke="#D06D25" strokeWidth={1.7} fillOpacity={1} fill="url(#chartGradient)" />
      </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default DashboardAreaChart;
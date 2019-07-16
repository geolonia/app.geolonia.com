import React from "react";
import { LineChart, CartesianGrid, Line, ResponsiveContainer } from "recharts";
import { __ } from "@wordpress/i18n";

const data = [
  { uv: 4000, pv: 2400 },
  { uv: 3000, pv: 1398 },
  { uv: 2000, pv: 3908 },
  { uv: 2780, pv: 9800 },
  { uv: 1890, pv: 4800 },
  { uv: 2390, pv: 3800 },
  { uv: 3490, pv: 4300 }
];

export const DummyChart = () => {
  return (
    <div style={{ position: "relative", padding: 40 }}>
      <ResponsiveContainer height={300} width="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey="pv"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey="uv"
            stroke="#82ca9d"
          />
        </LineChart>
      </ResponsiveContainer>
      <div
        style={{
          top: 0,
          left: 0,
          position: "absolute",
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,.2)",
          color: "black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <span>{__("comming soon", "geolonia-dashboard")}</span>
      </div>
    </div>
  );
};

export default DummyChart;

// import "./styles.css";
"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList
} from "recharts";
import dayjs from 'dayjs'; // 确保已经安装dayjs: npm install dayjs

const CustomizedLabel: React.FC<any> = (props) => {
  const { x, y, stroke, value } = props;
  const formattedValue = typeof value === 'number' ? value.toFixed(2) : value; // 如果 value 是数字，则保留两位小数，否则保持不变
  return (
    <text x={x} y={y} dy={-4} fill={stroke} fontSize={10} textAnchor="middle">
      {formattedValue}
    </text>
  );
};



export type PowerDate = {
  date: string;
  power: number;
};

export type Stats = {
  highest: PowerDate;
  lowest: PowerDate;
  last30DaysData: PowerDate[];
  maxPower: number; // 新增最大值字段
};

const LabelLineChart: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/LabelLineChart');
        if (!response.ok) {
          throw new Error('获取数据失败');
        }
        const data: Stats = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (!stats) {
    return <div>Loading...</div>;
  }

  const formatDate = (date: string) => {
    return dayjs(date).format('MM-DD');
  };

  const calculateInterval = (dataLength: number) => {
    const maxLabels = 10; // 假设最多显示10个标签
    return Math.floor(dataLength / maxLabels);
  };

  return (
    <div className="flex flex-col items-center">

      <div className="flex justify-center">
        <div className="mx-8 text-sm">
          最高算力：{formatDate(stats.highest.date)} 算力值：{stats.highest.power}
        </div>
        <div className="mx-8 text-sm">
          最低算力：{formatDate(stats.lowest.date)} 算力值：{stats.lowest.power}
        </div>
        {/* 添加以下代码以显示最大值 */}
      </div>

      <LineChart
        width={1000}
        height={300}
        data={stats.last30DaysData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          interval={calculateInterval(stats.last30DaysData.length)}
        />
        <YAxis />
        <Tooltip labelFormatter={formatDate} />
        <Legend />
        <Line type="monotone" dataKey="power" stroke="#8884d8">
          {/* <LabelList content={<CustomizedLabel />} /> */}
        </Line>
        {/* 添加新曲线的代码用下方注释 */}
        {/* 参考代码网址：
        https://codesandbox.io/p/sandbox/line-chart-with-customized-label-hs5b7?file=%2Fsrc%2FApp.tsx%3A109%2C7-109%2C61 */}

        {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
      </LineChart>
    </div>
  );
};

export default LabelLineChart;

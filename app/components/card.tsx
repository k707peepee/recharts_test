'use client';

import { Card } from '../ui/cards';
import React, { useState, useEffect } from 'react';

export default function CardPage() {
  const [summaryData, setSummaryData] = useState<null | { node_id: string; power: number; power_change_7_days: number; power_change_10_days: number }>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/card', { method: 'GET' });
        if (!response.ok) {
          throw new Error('获取数据失败');
        }
        const summary: { node_id: string; power: number; power_change_7_days: number; power_change_10_days: number } = await response.json();

        setSummaryData(summary);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('获取数据失败，请重试');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  return (
    <main>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {summaryData && summaryData.map((data) => (
          <div key={data.node_id}>
            <Card title="节点号" value={data.node_id} type="collected" />
            <Card title="最新算力（P）" value={data.power} type="pending" />
            <Card title="7天差值（P）" value={data.power_change_7_days} type="invoices" />
            <Card title="10天差值（P）" value={data.power_change_10_days} type="customers" />
          </div>
        ))}
      </div>
    </main>
  );
}
"use client";

import { ButtonLoading } from "@/components/ui/Loading";
import axios from "../axios";
import { useEffect, useState } from "react";
import { Bar, BarChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function UsersChart() {

  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/users/getUsersByMonth')
        setChartData(res.data)
      } catch (err) {
        console.log(err);
      }finally{
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  if (loading) return <ButtonLoading />

  if (chartData.length === 0) return <div>No Users yet</div>;

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="users" fill="#2563eb" radius={4} />

        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

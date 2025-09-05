"use client";

import { ButtonLoading } from "@/components/ui/Loading";
import axios from "../axios";
import { useEffect, useState } from "react";
import { Bar, BarChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function PostsChart(){

    const [chartData, setChartData] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
      setLoading(true)
      const fetchPosts = async () => {
        try {
          const res = await axios.get('/post/getPostsByMonth')
          setChartData(res.data)
        } catch (err) {
          console.log(err);
        }finally{
          setLoading(false)
        }
      }
      fetchPosts()
    }, [])
  
    if (chartData.length === 0) return <div>No Post yet</div>;

    if(loading){
      return(
        <ButtonLoading />
      )
    }

  return (
    <div className="w-full h-64">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="posts" fill="#2563eb" radius={4} />

      </BarChart>
    </ResponsiveContainer>
  </div>
  )
}

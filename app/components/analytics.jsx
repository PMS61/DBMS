import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function Analytics({ analytics, hashtagAnalytics }) {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const postAnalyticsData = analytics.map((item) => ({
    name: item.post_type,
    value: item.avg_likes + item.avg_comments + item.avg_shares,
  }));

  const hashtagAnalyticsData = hashtagAnalytics.map((item) => ({
    name: item.hashtag,
    value: item.avg_likes + item.avg_comments + item.avg_shares,
  }));

  return (
    <div className="bg-blue-400 p-6 shadow-md rounded-lg text-gray-900">
      <h2 className="text-2xl font-semibold mb-4">Analytics</h2>

      {/* Post Analytics Table */}
      <h3 className="text-xl font-semibold mb-2">Post Analytics</h3>
      <table className="w-full text-left border border-blue-300 rounded-lg mb-6 text-gray-900">
        <thead>
          <tr>
            <th className="border border-blue-300 p-2">Post Type</th>
            <th className="border border-blue-300 p-2">Avg Likes</th>
            <th className="border border-blue-300 p-2">Avg Comments</th>
            <th className="border border-blue-300 p-2">Avg Shares</th>
          </tr>
        </thead>
        <tbody>
          {analytics.map((item) => (
            <tr key={item.post_type}>
              <td className="border border-blue-300 p-2">{item.post_type}</td>
              <td className="border border-blue-300 p-2">{item.avg_likes.toFixed(2)}</td>
              <td className="border border-blue-300 p-2">{item.avg_comments.toFixed(2)}</td>
              <td className="border border-blue-300 p-2">{item.avg_shares.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <PieChart width={400} height={300}>
        <Pie data={postAnalyticsData} cx={200} cy={150} outerRadius={100} fill="#8884d8" dataKey="value">
          {postAnalyticsData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>

      {/* Hashtag Analytics Table */}
      <h3 className="text-xl font-semibold mb-2">Hashtag Analytics</h3>
      <table className="w-full text-left border border-blue-300 rounded-lg text-gray-900">
        <thead>
          <tr>
            <th className="border border-blue-300 p-2">Hashtag</th>
            <th className="border border-blue-300 p-2">Avg Likes</th>
            <th className="border border-blue-300 p-2">Avg Comments</th>
            <th className="border border-blue-300 p-2">Avg Shares</th>
          </tr>
        </thead>
        <tbody>
          {hashtagAnalytics.map((item) => (
            <tr key={item.hashtag}>
              <td className="border border-blue-300 p-2">{item.hashtag}</td>
              <td className="border border-blue-300 p-2">{item.avg_likes.toFixed(2)}</td>
              <td className="border border-blue-300 p-2">{item.avg_comments.toFixed(2)}</td>
              <td className="border border-blue-300 p-2">{item.avg_shares.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <PieChart width={400} height={300}>
        <Pie data={hashtagAnalyticsData} cx={200} cy={150} outerRadius={100} fill="#82ca9d" dataKey="value">
          {hashtagAnalyticsData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}

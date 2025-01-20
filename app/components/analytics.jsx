// Analytics Component
export default function Analytics({ analytics, hashtagAnalytics }) {
    return (
      <div className="bg-blue-400 p-6 shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Analytics</h2>
  
        {/* Post Analytics Table */}
        <h3 className="text-xl font-semibold mb-2">Post Analytics</h3>
        <table className="w-full text-left border border-blue-300 rounded-lg mb-6">
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
  
        {/* Hashtag Analytics Table */}
        <h3 className="text-xl font-semibold mb-2">Hashtag Analytics</h3>
        <table className="w-full text-left border border-blue-300 rounded-lg">
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
      </div>
    );
  }
  
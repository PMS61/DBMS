"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Papa from "papaparse";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    post_type: "",
    date_posted: "",
    likes: "",
    shares: "",
    comments: "",
  });
  const [editingRow, setEditingRow] = useState(null);

  const fetchData = async () => {
    const { data: postsData } = await supabase.from("posts").select("*");
    const { data: analyticsData } = await supabase.from("analytics").select("*");
    setPosts(postsData || []);
    setAnalytics(analyticsData || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPosts = posts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(posts.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await supabase.from("posts").insert([formData]);
    setFormData({ post_type: "", date_posted: "", likes: "", shares: "", comments: "" });
    fetchData();
  };

  const handleEdit = (postid) => {
    setEditingRow(postid);
  };

  const handleSave = async (postid) => {
    const post = posts.find((p) => p.postid === postid);
    await supabase.from("posts").update(post).eq("postid", postid);
    setEditingRow(null);
    fetchData();
  };

  const handleDelete = async (postid) => {
    await supabase.from("posts").delete().eq("postid", postid);
    fetchData();
  };

  const handleInputChange = (postid, field, value) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.postid === postid ? { ...post, [field]: value } : post
      )
    );
  };

  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const parsedData = results.data.map((row) => ({
          post_type: row.post_type,
          date_posted: row.date_posted,
          likes: parseInt(row.likes, 10) || 0,
          shares: parseInt(row.shares, 10) || 0,
          comments: parseInt(row.comments, 10) || 0,
        }));

        await supabase.from("posts").insert(parsedData);
        fetchData();
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
      },
    });
  };

  return (
    <div className="min-h-screen bg-blue-500 p-6 text-blue-900">
      <h1 className="text-3xl font-bold mb-6">Social Analytics</h1>

      <div className="bg-blue-400 p-6 shadow-md rounded-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4">Upload CSV</h2>
        <input
          type="file"
          accept=".csv"
          onChange={handleCSVUpload}
          className="border border-blue-300 rounded-lg p-2 w-full"
        />
      </div>

      <div className="bg-blue-400 p-6 shadow-md rounded-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add Post</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Post Type"
            value={formData.post_type}
            onChange={(e) => setFormData({ ...formData, post_type: e.target.value })}
            className="border border-blue-300 rounded-lg p-2"
          />
          <input
            type="number"
            placeholder="Likes"
            value={formData.likes}
            onChange={(e) => setFormData({ ...formData, likes: e.target.value })}
            className="border border-blue-300 rounded-lg p-2"
          />
          <input
            type="number"
            placeholder="Shares"
            value={formData.shares}
            onChange={(e) => setFormData({ ...formData, shares: e.target.value })}
            className="border border-blue-300 rounded-lg p-2"
          />
          <input
            type="number"
            placeholder="Comments"
            value={formData.comments}
            onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
            className="border border-blue-300 rounded-lg p-2"
          />
          <button type="submit" className="bg-blue-600 text-white rounded-lg p-2">
            Add Post
          </button>
        </form>
      </div>

      <div className="bg-blue-400 p-6 shadow-md rounded-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4">Posts</h2>
        <table className="w-full text-left border border-blue-300 rounded-lg">
          <thead>
            <tr>
              <th className="border border-blue-300 p-2">Post Type</th>
              <th className="border border-blue-300 p-2">Likes</th>
              <th className="border border-blue-300 p-2">Shares</th>
              <th className="border border-blue-300 p-2">Comments</th>
              <th className="border border-blue-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPosts.map((post) => (
              <tr key={post.postid}>
                {editingRow === post.postid ? (
                  <>
                    <td className="border border-blue-300 p-2">
                      <input
                        type="text"
                        value={post.post_type}
                        onChange={(e) =>
                          handleInputChange(post.postid, "post_type", e.target.value)
                        }
                        className="border border-blue-300 rounded-lg p-1"
                      />
                    </td>
                    <td className="border border-blue-300 p-2">
                      <input
                        type="number"
                        value={post.likes}
                        onChange={(e) =>
                          handleInputChange(post.postid, "likes", e.target.value)
                        }
                        className="border border-blue-300 rounded-lg p-1"
                      />
                    </td>
                    <td className="border border-blue-300 p-2">
                      <input
                        type="number"
                        value={post.shares}
                        onChange={(e) =>
                          handleInputChange(post.postid, "shares", e.target.value)
                        }
                        className="border border-blue-300 rounded-lg p-1"
                      />
                    </td>
                    <td className="border border-blue-300 p-2">
                      <input
                        type="number"
                        value={post.comments}
                        onChange={(e) =>
                          handleInputChange(post.postid, "comments", e.target.value)
                        }
                        className="border border-blue-300 rounded-lg p-1"
                      />
                    </td>
                    <td className="border border-blue-300 p-2">
                      <button
                        onClick={() => handleSave(post.postid)}
                        className="bg-green-500 text-white rounded-lg px-2 py-1"
                      >
                        Save
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="border border-blue-300 p-2">{post.post_type}</td>
                    <td className="border border-blue-300 p-2">{post.likes}</td>
                    <td className="border border-blue-300 p-2">{post.shares}</td>
                    <td className="border border-blue-300 p-2">{post.comments}</td>
                    <td className="border border-blue-300 p-2">
                      <button
                        onClick={() => handleEdit(post.postid)}
                        className="bg-yellow-500 text-white rounded-lg px-2 py-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post.postid)}
                        className="bg-red-500 text-white rounded-lg px-2 py-1 ml-2"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, posts.length)} of {posts.length} entries
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-blue-600 text-white rounded-lg px-3 py-1 disabled:opacity-50"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === index + 1
                    ? "bg-blue-700 text-white"
                    : "bg-blue-600 text-white"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-blue-600 text-white rounded-lg px-3 py-1 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="bg-blue-400 p-6 shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Analytics</h2>
        <table className="w-full text-left border border-blue-300 rounded-lg">
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
      </div>
    </div>
  );
}
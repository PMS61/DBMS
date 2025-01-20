"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Analytics from "./components/analytics";
import PostsInput from "./components/postinput";
import PostsTable from "./components/poststable";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [hashtagAnalytics, setHashtagAnalytics] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchData = async () => {
    const { data: postsData } = await supabase
      .from("posts")
      .select("*, post_hashtags(hashtag_id, hashtags(hashtag))");
    const { data: analyticsData } = await supabase.from("analytics").select("*");
    const { data: hashtagAnalyticsData } = await supabase
      .from("hashtag_analytics")
      .select("*");
    
    setPosts(
      postsData.map((post) => ({
        ...post,
        isEditing: false,
        hashtags: post.post_hashtags.map((ph) => ph.hashtags.hashtag).join(", "),
      })) || []
    );
    setAnalytics(analyticsData || []);
    setHashtagAnalytics(hashtagAnalyticsData || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFormSubmit = async (formData) => {
    await supabase.from("posts").insert([formData]);
    fetchData();
  };

  const handleCSVUpload = async (data) => {
    const parsedData = data.map((row) => ({
      post_type: row.post_type,
      date_posted: row.date_posted,
      likes: parseInt(row.likes, 10) || 0,
      shares: parseInt(row.shares, 10) || 0,
      comments: parseInt(row.comments, 10) || 0,
    }));
    await supabase.from("posts").insert(parsedData);
    fetchData();
  };

  const handleEdit = (postid) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.postid === postid ? { ...post, isEditing: true } : post
      )
    );
  };

  const handleSave = async (postid) => {
    const post = posts.find((p) => p.postid === postid);
    await supabase.from("posts").update(post).eq("postid", postid);
    setPosts((prev) =>
      prev.map((post) =>
        post.postid === postid ? { ...post, isEditing: false } : post
      )
    );
    fetchData();
  };

  const handleDelete = async (postid) => {
    await supabase.from("posts").delete().eq("postid", postid);
    fetchData();
  };

  const handleInputChange = (postid, field, value) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.postid === postid ? { ...post, [field]: value } : post
      )
    );
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-blue-500 p-6 text-blue-900">
      <h1 className="text-3xl font-bold mb-6">Social Analytics</h1>
      <PostsInput onFormSubmit={handleFormSubmit} onCSVUpload={handleCSVUpload} />
      <PostsTable
        posts={posts}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSave={handleSave}
        onInputChange={handleInputChange}
        onPaginate={paginate}
      />
      <Analytics
        analytics={analytics}
        hashtagAnalytics={hashtagAnalytics}
      />
    </div>
  );
}


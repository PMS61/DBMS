"use client";
import { useState } from "react";
import Papa from "papaparse";

export default function PostsInput({ onFormSubmit, onCSVUpload }) {
  const [formData, setFormData] = useState({
    post_type: "",
    likes: "",
    shares: "",
    comments: "",
    hashtags: [], // This will store hashtag names
  });

  // Predefined hashtags
  const hashtagsOptions = [
    "#Fitness",
    "#Tech",
    "#AI",
    "#Photography",
    "#Health",
    "#Innovation",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onFormSubmit) {
      onFormSubmit(formData);
    }
    // Reset the form
    setFormData({
      post_type: "",
      likes: "",
      shares: "",
      comments: "",
      hashtags: [],
    });
  };

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (onCSVUpload) {
          onCSVUpload(results.data);
        }
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
      },
    });
  };

  const handleHashtagChange = (hashtag) => {
    const updatedHashtags = formData.hashtags.includes(hashtag)
      ? formData.hashtags.filter((tag) => tag !== hashtag) // Remove if already selected
      : [...formData.hashtags, hashtag]; // Add if not selected
    setFormData({ ...formData, hashtags: updatedHashtags });
  };

  return (
    <div className="bg-blue-400 p-6 shadow-md rounded-lg mb-8">
      <h2 className="text-2xl font-semibold mb-4">Add Post</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Post Type"
          value={formData.post_type}
          onChange={(e) =>
            setFormData({ ...formData, post_type: e.target.value })
          }
          className="border border-blue-300 rounded-lg p-2"
        />
        <input
          type="number"
          placeholder="Likes"
          value={formData.likes}
          onChange={(e) =>
            setFormData({ ...formData, likes: e.target.value })
          }
          className="border border-blue-300 rounded-lg p-2"
        />
        <input
          type="number"
          placeholder="Shares"
          value={formData.shares}
          onChange={(e) =>
            setFormData({ ...formData, shares: e.target.value })
          }
          className="border border-blue-300 rounded-lg p-2"
        />
        <input
          type="number"
          placeholder="Comments"
          value={formData.comments}
          onChange={(e) =>
            setFormData({ ...formData, comments: e.target.value })
          }
          className="border border-blue-300 rounded-lg p-2"
        />

        <div className="bg-white p-4 border border-blue-300 rounded-lg">
          <p className="text-lg font-medium mb-2">Select Hashtags:</p>
          <div className="flex flex-wrap gap-2">
            {hashtagsOptions.map((hashtag, index) => (
              <label
                key={index}
                className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-lg cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={hashtag}
                  checked={formData.hashtags.includes(hashtag)}
                  onChange={() => handleHashtagChange(hashtag)}
                  className="cursor-pointer"
                />
                {hashtag}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white rounded-lg p-2"
        >
          Add Post
        </button>
      </form>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Upload CSV</h2>
      <input
        type="file"
        accept=".csv"
        onChange={handleCSVUpload}
        className="border border-blue-300 rounded-lg p-2 w-full"
      />
    </div>
  );
}

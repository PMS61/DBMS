import { useState } from "react";

export default function PostsTable({
  posts,
  currentPage,
  itemsPerPage,
  onEdit,
  onDelete,
  onSave,
  onInputChange,
  onPaginate,
}) {
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    postType: "",
    hashtag: "",
    sortBy: "",
    sortOrder: "asc",
  });

  const toggleFilterModal = () => setShowFilter(!showFilter);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredPosts = posts
    .filter((post) =>
      filters.postType ? post.post_type.includes(filters.postType) : true
    )
    .filter((post) =>
      filters.hashtag ? post.hashtags.includes(filters.hashtag) : true
    )
    .sort((a, b) => {
      if (!filters.sortBy) return 0;
      return filters.sortOrder === "asc"
        ? a[filters.sortBy] - b[filters.sortBy]
        : b[filters.sortBy] - a[filters.sortBy];
    });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

  return (
    <div className="bg-blue-400 p-6 shadow-md rounded-lg mb-8">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-semibold">Posts</h2>
        <button
          onClick={toggleFilterModal}
          className="bg-gray-700 text-white px-4 py-2 rounded-lg"
        >
          Filter
        </button>
      </div>
      {showFilter && (
        <div className="bg-white p-4 shadow-md rounded-lg mb-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="postType"
              placeholder="Filter by Post Type"
              value={filters.postType}
              onChange={handleFilterChange}
              className="border p-2 rounded-lg"
            />
            <input
              type="text"
              name="hashtag"
              placeholder="Filter by Hashtag"
              value={filters.hashtag}
              onChange={handleFilterChange}
              className="border p-2 rounded-lg"
            />
            <select
              name="sortBy"
              value={filters.sortBy}
              onChange={handleFilterChange}
              className="border p-2 rounded-lg"
            >
              <option value="">Sort By</option>
              <option value="likes">Likes</option>
              <option value="shares">Shares</option>
              <option value="comments">Comments</option>
            </select>
            <select
              name="sortOrder"
              value={filters.sortOrder}
              onChange={handleFilterChange}
              className="border p-2 rounded-lg"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      )}
      <table className="w-full text-left border border-blue-300 rounded-lg">
        <thead>
          <tr>
            <th className="border border-blue-300 p-2">Post Type</th>
            <th className="border border-blue-300 p-2">Likes</th>
            <th className="border border-blue-300 p-2">Shares</th>
            <th className="border border-blue-300 p-2">Comments</th>
            <th className="border border-blue-300 p-2">Hashtags</th>
            <th className="border border-blue-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.map((post) => (
            <tr key={post.postid}>
              <td className="border border-blue-300 p-2">{post.post_type}</td>
              <td className="border border-blue-300 p-2">{post.likes}</td>
              <td className="border border-blue-300 p-2">{post.shares}</td>
              <td className="border border-blue-300 p-2">{post.comments}</td>
              <td className="border border-blue-300 p-2">{post.hashtags}</td>
              <td className="border border-blue-300 p-2">
                <button
                  onClick={() => onEdit(post.postid)}
                  className="bg-yellow-500 text-white rounded-lg px-2 py-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(post.postid)}
                  className="bg-red-500 text-white rounded-lg px-2 py-1 ml-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredPosts.length)} of {filteredPosts.length} entries
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onPaginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-blue-600 text-white rounded-lg px-3 py-1 disabled:opacity-50"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => onPaginate(index + 1)}
              className={`px-3 py-1 rounded-lg ${currentPage === index + 1 ? "bg-blue-700 text-white" : "bg-blue-600 text-white"}`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => onPaginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-blue-600 text-white rounded-lg px-3 py-1 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

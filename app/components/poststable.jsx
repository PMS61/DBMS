// PostsTable Component
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
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPosts = posts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(posts.length / itemsPerPage);
  
    return (
      <div className="bg-blue-400 p-6 shadow-md rounded-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4">Posts</h2>
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
                {post.isEditing ? (
                  <>
                    <td className="border border-blue-300 p-2">
                      <input
                        type="text"
                        value={post.post_type}
                        onChange={(e) =>
                          onInputChange(post.postid, "post_type", e.target.value)
                        }
                        className="border border-blue-300 rounded-lg p-1"
                      />
                    </td>
                    <td className="border border-blue-300 p-2">
                      <input
                        type="number"
                        value={post.likes}
                        onChange={(e) =>
                          onInputChange(post.postid, "likes", e.target.value)
                        }
                        className="border border-blue-300 rounded-lg p-1"
                      />
                    </td>
                    <td className="border border-blue-300 p-2">
                      <input
                        type="number"
                        value={post.shares}
                        onChange={(e) =>
                          onInputChange(post.postid, "shares", e.target.value)
                        }
                        className="border border-blue-300 rounded-lg p-1"
                      />
                    </td>
                    <td className="border border-blue-300 p-2">
                      <input
                        type="number"
                        value={post.comments}
                        onChange={(e) =>
                          onInputChange(post.postid, "comments", e.target.value)
                        }
                        className="border border-blue-300 rounded-lg p-1"
                      />
                    </td>
                    <td className="border border-blue-300 p-2">{post.hashtags}</td>
                    <td className="border border-blue-300 p-2">
                      <button
                        onClick={() => onSave(post.postid)}
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
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
  
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, posts.length)} of{" "}
            {posts.length} entries
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
  
import { Fragment, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { ArrowPathIcon, UserGroupIcon,PencilIcon,TrashIcon  } from "@heroicons/react/24/outline";
import { Dialog } from "@headlessui/react";
import { useState } from "react";

const UserManagement = ({ theme }) => {
  const [users, setUsers] = useState([]);
  const [filterCity, setFilterCity] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const { data } = await axiosInstance.get("/admin/users"); // Assuming an admin endpoint for all users
      setUsers(data);
    } catch (err) {
      setError("Failed to fetch user data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditingUser({ ...user });
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    try {
      await axiosInstance.put(`/admin/users/${editingUser._id}`, editingUser);
      setIsEditing(false);
      fetchUsers();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axiosInstance.delete(`/admin/users/${userId}`);
      setConfirmDeleteId(null);
      fetchUsers();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.city?.toLowerCase().includes(filterCity.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex justify-center items-center py-10">
        <ArrowPathIcon className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  if (error)
    return (
      <div
        className={`text-center py-10 ${
          theme === "dark" ? "text-red-400" : "text-red-600"
        }`}
      >
        {error}
      </div>
    );

  return (
    <>
      {/* City Filter */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by City"
          value={filterCity}
          onChange={(e) => setFilterCity(e.target.value)}
          className={`w-full md:w-1/3 p-2 border rounded-md ${
            theme === "dark"
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-white border-gray-300"
          }`}
        />
      </div>

      {/* Users Table */}
      <div className="hidden lg:block overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={theme === "dark" ? "bg-gray-700" : "bg-gray-50"}>
            <tr>
              {["Name", "Email", "Blood Group", "City", "Role", "Actions"].map(
                (header) => (
                  <th
                    key={header}
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      theme === "dark" ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredUsers.map((user) => (
              <tr
                key={user._id}
                className={`${
                  theme === "dark"
                    ? "bg-gray-800 hover:bg-gray-700/70"
                    : "bg-white hover:bg-gray-50"
                } transition-colors`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <UserGroupIcon
                      className={`h-8 w-8 mr-3 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <div>
                      <div
                        className={`text-sm font-medium ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {user.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {user.email}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {user.bloodGroup}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {user.city}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.isAdmin
                        ? theme === "dark"
                          ? "bg-purple-800/50 text-purple-300"
                          : "bg-purple-100 text-purple-800"
                        : theme === "dark"
                        ? "bg-blue-800/50 text-blue-300"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.isAdmin ? "Admin" : "Donor"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleEdit(user)}
                    title="Edit"
                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(user._id)}
                    title="Delete"
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Users Cards for mobile */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredUsers.map((user) => (
          <div key={user._id} className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-md`}>
            <div className="flex items-center mb-4">
              <UserGroupIcon className={`h-8 w-8 mr-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
              <div>
                <div className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{user.name}</div>
                <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{user.email}</div>
              </div>
            </div>
            <div className="text-sm space-y-2">
              <div><strong>Blood Group:</strong> {user.bloodGroup}</div>
              <div><strong>City:</strong> {user.city}</div>
              <div>
                <strong>Role:</strong>
                <span
                  className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.isAdmin
                      ? theme === 'dark'
                        ? 'bg-purple-800/50 text-purple-300'
                        : 'bg-purple-100 text-purple-800'
                      : theme === 'dark'
                      ? 'bg-blue-800/50 text-blue-300'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {user.isAdmin ? 'Admin' : 'Donor'}
                </span>
              </div>
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => handleEdit(user)}
                title="Edit"
                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                <PencilIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setConfirmDeleteId(user._id)}
                title="Delete"
                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <Dialog
          open={isEditing}
          onClose={() => setIsEditing(false)}
          as={Fragment}
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div
              className={`${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } p-6 rounded-lg shadow-lg w-full max-w-md`}
            >
              <h2
                className={`text-lg font-bold mb-4 ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                Edit User
              </h2>
              <input
                type="text"
                className={`w-full mb-3 p-2 rounded-md border ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-300"
                }`}
                placeholder="Name"
                value={editingUser.name}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, name: e.target.value })
                }
              />
              <input
                type="email"
                className={`w-full mb-3 p-2 rounded-md border ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-300"
                }`}
                placeholder="Email"
                value={editingUser.email}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, email: e.target.value })
                }
              />
              <label
                className={`block mb-3 text-sm ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Role:
                <select
                  className={`w-full p-2 rounded-md border ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-300"
                  }`}
                  value={editingUser.isAdmin ? "admin" : "donor"}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      isAdmin: e.target.value === "admin",
                    })
                  }
                >
                  <option value="donor">Donor</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
              <div className="flex justify-end mt-4 space-x-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className={`px-4 py-2 rounded-md ${
                    theme === "dark"
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-100"
                  } transition-colors`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      )}

      {/* Delete Confirmation */}
      {confirmDeleteId && (
        <Dialog
          open={!!confirmDeleteId}
          onClose={() => setConfirmDeleteId(null)}
          as={Fragment}
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div
              className={`${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } p-6 rounded-lg shadow-lg w-full max-w-sm text-center`}
            >
              <h3
                className={`text-lg font-semibold mb-4 ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                Delete this user?
              </h3>
              <p
                className={`text-sm mb-4 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-500"
                }`}
              >
                This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className={`px-4 py-2 rounded-md ${
                    theme === "dark"
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-100"
                  } transition-colors`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDeleteId)}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
};

export default UserManagement;
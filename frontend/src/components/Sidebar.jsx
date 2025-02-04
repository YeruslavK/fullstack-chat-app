import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();

  const { onlineUsers, authUser } = useAuthStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [showAddUserPopup, setShowAddUserPopup] = useState(false);
  const [newUserId, setNewUserId] = useState("");
  const [contactsArr, setContactsArr] = useState(authUser?.contacts || []);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Filter contacts based on online status if toggled
  const filteredContacts = contactsArr.filter((contact) =>
    showOnlineOnly ? onlineUsers.includes(contact._id) : true
  );

  const handleAddUser = () => {
    if (!newUserId) return;

    const userToAdd = users.find((user) => user.uniqueId === newUserId);

    if (userToAdd) {
      if (!contactsArr.some((contact) => contact.uniqueId === newUserId)) {
        setContactsArr([...contactsArr, userToAdd]); // Add to contacts
        console.log("User added to contacts:", userToAdd);
      } else {
        console.log("User is already in contacts.");
      }
    } else {
      console.log("User not found.");
    }

    setShowAddUserPopup(false);
    setNewUserId(""); // Reset input
  };

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>

          <span
            className="btn btn-sm gap-2 transition-colors"
            onClick={() => setShowAddUserPopup(true)}
          >
            Add user
          </span>
        </div>
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            (
            {
              filteredContacts.filter((user) => onlineUsers.includes(user._id))
                .length
            }{" "}
            online)
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredContacts.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredContacts.length === 0 && (
          <div className="text-center text-zinc-500 py-4">
            No contacts available
          </div>
        )}
      </div>

      {showAddUserPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center">
          <div className="bg-black p-5 rounded shadow-lg">
            <h2 className="text-lg font-medium mb-4">Add User</h2>
            <input
              type="text"
              value={newUserId}
              onChange={(e) => setNewUserId(e.target.value)}
              className="input input-bordered w-full mb-4"
              placeholder="#1234"
            />
            <div className="flex justify-end gap-2">
              <button
                className="btn btn-secondary"
                onClick={() => setShowAddUserPopup(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAddUser}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;

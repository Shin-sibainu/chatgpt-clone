import React from "react";
import { createChatRoomForUser } from "../utils/chatServices";
import { useAuth } from "../context/AuthContextProvider";
import { ChatRoom } from "../types/types";

type SidebarProps = {
  chatRooms: ChatRoom[] | null;
  setSelectedChatRoomId: React.Dispatch<React.SetStateAction<number | null>>;
  selectedChatRoomId: number | null;
  setChatRooms: React.Dispatch<React.SetStateAction<ChatRoom[] | null>>;
};

const Sidebar = ({
  chatRooms,
  setSelectedChatRoomId,
  selectedChatRoomId,
  setChatRooms,
}: SidebarProps) => {
  const { user } = useAuth();

  const handleRoomSelect = (roomId: number) => {
    setSelectedChatRoomId(roomId);
  };

  const handleCreateChatRoom = async () => {
    const chatRoomName = window.prompt("チャットルーム名を記入してください。");

    if (chatRoomName && user?.id) {
      try {
        const newRoom = await createChatRoomForUser(user.id, chatRoomName);
        setChatRooms((prevRooms) =>
          prevRooms ? [...prevRooms, newRoom] : [newRoom]
        );
        setSelectedChatRoomId(newRoom.id);
      } catch (error) {
        console.error("Failed to create chatRoom:", error);
        alert("チャットルーム作成に失敗しました。");
      }
    }
  };

  return (
    <div className="bg-zinc-900 h-full text-white p-4 flex flex-col gap-4">
      {/* create chat room button */}
      <div>
        <button
          onClick={handleCreateChatRoom}
          className="border px-4 py-2 rounded-lg border-slate-300 hover:bg-white hover:text-slate-900 duration-150"
        >
          + Create Room
        </button>
      </div>

      {/* chat room list */}
      <nav>
        <ul className="space-y-2">
          {chatRooms?.map((chatRoom) => (
            <li
              key={chatRoom.id}
              onClick={() => handleRoomSelect(chatRoom.id)}
              className={`hover:bg-slate-600 duration-150 cursor-pointer p-2 rounded-md ${
                selectedChatRoomId === chatRoom.id
                  ? "bg-slate-600"
                  : "bg-transparent"
              }`}
            >
              {chatRoom.name}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

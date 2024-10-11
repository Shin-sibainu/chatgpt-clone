import { useEffect, useState } from "react";
import ChatArea from "./components/ChatArea";
import Sidebar from "./components/Sidebar";
import { getChatRoomsForUser } from "./utils/chatServices";
import { ChatRoom } from "./types/types";
import AuthButton from "./components/AuthButton";
import { useAuth } from "./context/AuthContextProvider";

function App() {
  const { user } = useAuth();

  const [chatRooms, setChatRooms] = useState<ChatRoom[] | null>(null);
  const [selectedChatRoomId, setSelectedChatRoomId] = useState<number | null>(
    null
  );

  useEffect(() => {
    async function fetchChatRooms() {
      if (user?.id) {
        try {
          const rooms = await getChatRoomsForUser(user.id);
          setChatRooms(rooms);

          if (rooms.length > 0) {
            setSelectedChatRoomId(rooms[0].id);
          }
        } catch (error) {
          console.error("Failed to fetch chat rooms:", error);
        }
      }
    }

    fetchChatRooms();
  }, [user?.id]);

  return (
    <>
      {user ? (
        <>
          <main className="flex flex-col md:flex-row w-screen h-screen">
            {/* sidebar */}
            <div className="lg:w-1/6 md:w-1/3">
              <Sidebar
                chatRooms={chatRooms}
                selectedChatRoomId={selectedChatRoomId}
                setSelectedChatRoomId={setSelectedChatRoomId}
                setChatRooms={setChatRooms}
              />
            </div>

            {/* chatArea */}
            <div className="lg:w-5/6 md:w-2/3 flex-grow">
              <ChatArea selectedChatRoomId={selectedChatRoomId} />
            </div>
          </main>
        </>
      ) : (
        <>
          {/* login */}
          <div className="h-screen flex flex-col items-center justify-center bg-zinc-800">
            <AuthButton />
          </div>
        </>
      )}
    </>
  );
}

export default App;

import { useEffect, useState } from "react";
import ChatInput from "./ChatInput";
import { getMessagesForChatRoom } from "../utils/chatServices";
import { Message } from "../types/types";
import { useAuth } from "../context/AuthContextProvider";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

type ChatAreaProps = {
  selectedChatRoomId: number | null;
};

const ChatArea = ({ selectedChatRoomId }: ChatAreaProps) => {
  const { user, signOut } = useAuth();

  const [messages, setMessages] = useState<Message[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchMessages() {
      if (selectedChatRoomId) {
        try {
          const fetchedMessages = await getMessagesForChatRoom(
            selectedChatRoomId
          );
          setMessages(fetchedMessages);
        } catch (error) {
          console.error("Failed to fetch messages:", error);
        }
      }
    }

    fetchMessages();
  }, [selectedChatRoomId]);

  return (
    <div className="bg-zinc-800 h-full text-white flex flex-col">
      {/* chat area header */}
      <div className="flex justify-between items-center p-4">
        <h1 className="text-xl font-medium">GPT Clone</h1>

        <div
          onClick={() => {
            if (window.confirm("ログアウトしてもよろしいでしょうか？")) {
              signOut();
            }
          }}
        >
          <img
            src={user?.user_metadata.avatar_url}
            alt={user?.user_metadata.name}
            className="size-10 rounded-full cursor-pointer"
          />
        </div>
      </div>

      {/* chat area */}
      <div className="flex justify-center flex-grow overflow-y-scroll px-4 scrollbar-hide">
        <div className="max-w-3xl w-full">
          {/* right chat (me) */}
          {messages?.map((message) => (
            <div key={message.id}>
              {message.is_ai ? (
                <div className="mb-6 flex items-center gap-2">
                  <div className="flex-shrink-0 bg-zinc-900 rounded-full size-9 border border-zinc-200 flex items-center justify-center">
                    <span className="text-sm font-semibold">AI</span>
                  </div>
                  <div className="rounded-lg inline-block p-2">
                    {message.content}
                  </div>
                </div>
              ) : (
                <div className="text-right mb-6">
                  <div className="bg-zinc-700 rounded-lg inline-block p-2">
                    {message.content}
                  </div>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="mb-6 flex items-center gap-2">
              <div className="flex-shrink-0 bg-zinc-900 rounded-full size-9 border border-zinc-200 flex items-center justify-center">
                <span className="text-sm font-semibold">AI</span>
              </div>
              <div className="rounded-lg inline-block p-2">
                <AiOutlineLoading3Quarters className="animate-spin" size={20} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* chat input */}
      <div className="p-4">
        <div className="max-w-3xl mx-auto">
          <ChatInput
            selectedChatRoomId={selectedChatRoomId}
            setMessages={setMessages}
            setIsLoading={setIsLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatArea;

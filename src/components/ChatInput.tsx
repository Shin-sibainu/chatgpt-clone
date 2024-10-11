import { FormEvent, useState } from "react";
import { useAuth } from "../context/AuthContextProvider";
import { sendMessage, sendMessageFromGPT } from "../utils/chatServices";
import { Message } from "../types/types";

type ChatInputProps = {
  selectedChatRoomId: number | null;
  setMessages: React.Dispatch<React.SetStateAction<Message[] | null>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChatInput = ({
  selectedChatRoomId,
  setMessages,
  setIsLoading,
}: ChatInputProps) => {
  const { user } = useAuth();

  const [inputSendMessage, setInputSendMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedChatRoomId) {
      alert("ルーム作成または選択してください。");
      return;
    }

    if (!user) {
      alert("ログインしてください。");
      return;
    }

    try {
      const sentMessage = await sendMessage(
        user?.id,
        selectedChatRoomId,
        false,
        inputSendMessage
      );

      setMessages((prevMessage) =>
        prevMessage ? [...prevMessage, sentMessage] : [sentMessage]
      );

      setIsLoading(true);
      setInputSendMessage("");

      const messageFromGPT = await sendMessageFromGPT(inputSendMessage);

      const aiMessage = await sendMessage(
        undefined,
        selectedChatRoomId,
        true,
        messageFromGPT
      );

      setMessages((prevMessage) =>
        prevMessage ? [...prevMessage, aiMessage] : [aiMessage]
      );

      setIsLoading(false);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("メッセージ送信に失敗しました。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="relative" onSubmit={handleSubmit}>
      <input
        type="text"
        className="w-full bg-zinc-700 px-4 py-3 rounded-lg focus:outline-none"
        placeholder="ChatGPTにメッセージを送信する"
        onChange={(e) => setInputSendMessage(e.target.value)}
        value={inputSendMessage}
      />
      <button
        type="submit"
        className="absolute top-1/2 right-3 -translate-y-1/2 text-white bg-zinc-900 rounded-full size-7 hover:text-gray-300 duration-150"
      >
        ↑
      </button>
    </form>
  );
};

export default ChatInput;

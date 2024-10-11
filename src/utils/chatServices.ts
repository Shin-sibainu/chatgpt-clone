import OpenAI from "openai";
import { supabase } from "../lib/supabaseClient";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function getChatRoomsForUser(userId: string) {
  if (!userId) {
    throw new Error("userId is required");
  }

  try {
    const { data, error } = await supabase
      .from("chat_rooms")
      .select(
        `
     id,
     name,
     user_id,
     created_at
    `
      )
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching chat rooms:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in getChatRoomsForUser:", error);
    throw error;
  }
}

export async function getMessagesForChatRoom(chatRoomId: number | null) {
  if (!chatRoomId) {
    throw new Error("chatRoomId is required");
  }

  try {
    const { data, error } = await supabase
      .from("messages")
      .select(
        `
     id,
     content,
     user_id,
     is_ai,
     created_at
    `
      )
      .eq("chat_room_id", chatRoomId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in getMessagesForChatRoom:", error);
    throw error;
  }
}

export async function createChatRoomForUser(
  userId: string,
  chatRoomName: string
) {
  try {
    const { data, error } = await supabase
      .from("chat_rooms")
      .insert({ name: chatRoomName, user_id: userId })
      .select()
      .single();

    if (error) {
      console.error("Error create chatRoom:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Failed to create chatRoom:", error);
    throw error;
  }
}

export async function sendMessage(
  userId: string | undefined,
  chatRoomId: number,
  isAi: boolean,
  content: string | null
) {
  try {
    const { data, error } = await supabase
      .from("messages")
      .insert({
        chat_room_id: chatRoomId,
        user_id: userId,
        is_ai: isAi,
        content: content,
      })
      .select()
      .single();

    if (error) {
      console.error("Error sending message:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Failed to send message:", error);
    throw error;
  }
}

export async function sendMessageFromGPT(message: string) {
  try {
    const response = await fetch(`${import.meta.env.VITE_PROXY_API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();

    const messageFormGPT = data.choices[0].message.content;

    return messageFormGPT;
  } catch (error) {
    console.error("Error in sendMessageFromGPT:", error);
    throw error;
  }
}

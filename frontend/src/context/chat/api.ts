import { axiosClient } from "@/lib/axios";

const getChatRooms = async () => {
  const response = await axiosClient.get("/chat/rooms");
  return response.data;
};

const getChatHistory = async (chatId: string) => {
  const response = await axiosClient.get(`/chat/${chatId}/history`);
  return response.data;
};

const createNewChatRoom = async () => {
  const response = await axiosClient.post("/chat/create-room");
  return response.data;
};

const createNewQuestion = async (chatId: string, message: string) => {
  const data = { chatId, message };

  const response = await axiosClient.post("/chat/add-question", data);
  return response.status;
};

const updateChatRoomTopic = async (chatId: string, topic: string) => {
  const data = { topic };

  const response = await axiosClient.patch(
    `/chat/${chatId}/update-topic`,
    data
  );
  return response.data;
};

const deleteAllChat = async () => {
  const response = await axiosClient.delete("/chat/delete-all");
  return response.data;
};

const deleteChatOnId = async (chatId: string) => {
  const response = await axiosClient.delete(`/chat/${chatId}/delete`);
  return response.data;
};

export {
  getChatRooms,
  getChatHistory,
  createNewChatRoom,
  createNewQuestion,
  updateChatRoomTopic,
  deleteAllChat,
  deleteChatOnId
};

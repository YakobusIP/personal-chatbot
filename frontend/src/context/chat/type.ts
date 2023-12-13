import React from "react";

type Room = {
  id: string;
  topic: string;
};

export type ChatContext = {
  rooms: Array<Room>;
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;

  topic: string;
  setTopic: React.Dispatch<React.SetStateAction<string>>;
};

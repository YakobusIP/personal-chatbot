import Message from "@/types/message.type";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const addMessageToList = (
  prevMessages: Message[],
  id: string,
  author: string,
  content: string,
  conversationQuestionId: string | null,
  conversationAnswerId: string | null
) => {
  return [
    ...prevMessages,
    {
      id: id,
      author: author,
      content: content,
      conversationQuestionId: conversationQuestionId,
      conversationAnswerId: conversationAnswerId
    }
  ];
};

const updateQuestionId = (
  prevMessages: Message[],
  questionIndex: number,
  conversationQuestionId: string
) => {
  return [
    ...prevMessages.slice(0, questionIndex),
    {
      ...prevMessages[questionIndex],
      conversationQuestionId: conversationQuestionId
    },
    ...prevMessages.slice(questionIndex + 1)
  ];
};

const addAnswerToList = (
  prevMessages: Message[],
  content: string,
  conversationAnswerId: string
) => {
  return [
    ...prevMessages,
    {
      id: "",
      author: "CHATBOT",
      content: content,
      conversationQuestionId: null,
      conversationAnswerId: conversationAnswerId
    }
  ];
};

const appendAnswerChunk = (
  prevMessages: Message[],
  answerIndex: number,
  chunk: string
) => {
  return [
    ...prevMessages.slice(0, answerIndex),
    {
      ...prevMessages[answerIndex],
      content: prevMessages[answerIndex].content.concat(chunk)
    },
    ...prevMessages.slice(answerIndex + 1)
  ];
};

export {
  addMessageToList,
  updateQuestionId,
  addAnswerToList,
  appendAnswerChunk,
  sleep
};
export default interface Message {
  chatId: string;
  id: string;
  author: string;
  content: string;
  questionId: string | null;
}

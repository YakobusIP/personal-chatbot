export default interface Message {
  id: string;
  author: string;
  content: string;
  conversationQuestionId: string | null;
  conversationAnswerId: string | null;
}

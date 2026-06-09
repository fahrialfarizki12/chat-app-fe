export interface MessageInterface {
  content: string;
  createdAt: string;
  senderId: string;
  sender: Sender;
}

interface Sender {
  username: string;
  telepon: string;
  id: string;
}

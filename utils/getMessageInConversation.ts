import { db } from "@/config/firebase";
import { IMessage } from "@/types";
import { collection, DocumentData, orderBy, query, QueryDocumentSnapshot, Timestamp, where } from "firebase/firestore";

export const generateQueryGetMessage = (conversationId?: string) =>
  query(collection(db, 'messsages'), where('conversation_id', '==', conversationId), orderBy('sent_at', 'asc'))


export const transformMessage = (message: QueryDocumentSnapshot<DocumentData>) => ({
  // Spread out conversation_id, text, sent_at, user
  ...message.data(),
  id: message.id,
  sent_at: (message.data().sent_at ? convertFirestoreTimestampToString(message.data().sent_at as Timestamp) : null)
} as IMessage)

export const convertFirestoreTimestampToString = (timestamp: Timestamp) => {
  return new Date(timestamp.toDate().getTime()).toLocaleString()
}
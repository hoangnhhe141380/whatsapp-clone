import { auth, db } from "@/config/firebase"
import { AppUser, Conversation } from "@/types"
import { getRecipientEmail } from "@/utils/getRecipientEmail"
import { collection, query, where } from "firebase/firestore"
import { useAuthState } from "react-firebase-hooks/auth"
import { useCollection } from "react-firebase-hooks/firestore"

export const useRecipient = (conversationUser: Conversation["users"]) => {
  const [loggedInUser, _loading, _error] = useAuthState(auth)

  // Get recipient email
  const recipientEmail = getRecipientEmail(conversationUser, loggedInUser)

  // Get recipient avatar
  const queryGetRecipient = query(
    collection(db, "users"),
    where("email", "==", recipientEmail)
  )
  const [recipientsSnapshot, __loading, __error] =
    useCollection(queryGetRecipient)

  // If recipientSnapshot?.docs could be an empty array => docs[0] will be undefined
  // so we have to force "?" after docs[0] cuz there is no data
  const recipient = recipientsSnapshot?.docs[0]?.data() as AppUser | undefined

  return {
    recipientEmail,
    recipient
  }
}

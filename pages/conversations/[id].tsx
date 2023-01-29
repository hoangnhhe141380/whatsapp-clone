import ConversationScreen from "@/components/ConversationScreen"
import Sidebar from "@/components/Sidebar"
import { auth, db } from "@/config/firebase"
import { Conversation, IMessage } from "@/types"
import { generateQueryGetMessage, transformMessage } from "@/utils/getMessageInConversation"
import { getRecipientEmail } from "@/utils/getRecipientEmail"
import { doc, getDoc, getDocs } from "firebase/firestore"
import { GetServerSideProps } from "next"
import Head from "next/head"
import { useAuthState } from "react-firebase-hooks/auth"
import styled from "styled-components"

const StyledContainer = styled.div`
  display: flex;
`

const StyledConversationContainer = styled.div`
  flex-grow: 1;
  overflow: scroll;
  height: 100vh;
  /* Hide scrollbar for Chrome, Safari and Opera */
  ::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
`

interface ChatConversationProps {
  conversation: Conversation
  messages: IMessage[]
}

const ChatConversation = ({ conversation, messages }: ChatConversationProps) => {
  const [loggedInUser, _loading, _user] = useAuthState(auth)

  return (
    <StyledContainer>
      <Head>
        <title>Conversation with {getRecipientEmail(conversation.users, loggedInUser)}</title>
      </Head>
      <Sidebar />

      <StyledConversationContainer>
        <ConversationScreen conversation={conversation} messages={messages} />
      </StyledConversationContainer>

    </StyledContainer>
  )
}

export default ChatConversation

export const getServerSideProps: GetServerSideProps<ChatConversationProps, { id: string }> = async context => {
  const conversationId = context.params?.id

  // Get conversations to know who we chatting with
  const conversationRef = doc(db, 'conversations', conversationId as string)
  const conversationSnapshot = await getDoc(conversationRef)

  // Get all message between logged user and recipient in this conversation
  const queryMessages = generateQueryGetMessage(conversationId)

  const messagesSnapshot = await getDocs(queryMessages)

  const messages = messagesSnapshot.docs.map(messageDoc => transformMessage(messageDoc))

  return {
    props: {
      conversation: conversationSnapshot.data() as Conversation,
      messages
    }
  }

}
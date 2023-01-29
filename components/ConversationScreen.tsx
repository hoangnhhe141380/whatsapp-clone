import { useRecipient } from "@/hooks/useRecipient"
import { Conversation, IMessage } from "@/types"
import { convertFirestoreTimestampToString, generateQueryGetMessage, transformMessage } from "@/utils/getMessageInConversation"
import IconButton from "@mui/material/IconButton"
import AttachFileIcon from '@mui/icons-material/AttachFile'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import styled from "styled-components"
import RecipientAvatar from "./RecipientAvatar"
import { useRouter } from "next/router"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "@/config/firebase"
import { useCollection } from "react-firebase-hooks/firestore"
import Message from "./Message"
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon'
import SendIcon from '@mui/icons-material/Send'
import MicIcon from '@mui/icons-material/Mic'
import { useState, useRef, KeyboardEventHandler, MouseEventHandler } from 'react'
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore"

const StyledRecipentHeader = styled.div`
  position: sticky;
  background-color: white;
  z-index: 100;
  top: 0;
  display: flex;
  align-items: center;
  padding: 11px;
  height: 60px;
  border-bottom: 1px solid whitesmoke;
`

const StyledHeaderInfo = styled.div`
  margin-left: 15px;
  flex-grow: 1;
  
  > h3{
    margin-top: 0;
    margin-bottom: 3px;
  }

  > span{
    font-size: 14px;
    color: gray;
  }
`

const StyledH3 = styled.h3`
  word-break: break-all;
`

const StyledHeaderIcons = styled.div`
  display:flex;
`

const StyledMessageContainer = styled.div`
  padding: 30px;
  background-color: #e5ede8;
  min-height: 90vh;
`

const StyledInputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
`
const StyledInput = styled.input`
  flex-grow: 1;
  outline: none;
  border: none;
  border-radius: 10px;
  background-color: whitesmoke;
  padding: 15px;
  margin-left: 15px;
  margin-right: 15px;
  :focus{
    border: 1px solid gray;
  }
`

const EndOfMessagesForAutoScroll = styled.div`
    margin-bottom: 30px;
`

const ConversationScreen = ({ conversation, messages }: { conversation: Conversation, messages: IMessage[] }) => {
  const [newMessage, setNewMessage] = useState('')
  const endOfMessagesRef = useRef<HTMLDivElement>(null)
  const [loggedInUser, _loading, _error] = useAuthState(auth)

  const conversationUsers = conversation.users

  const { recipient, recipientEmail } = useRecipient(conversationUsers)

  const router = useRouter()
  const conversationId = router.query.id
  const queryGetMessages = generateQueryGetMessage(conversationId as string)
  const [messagesSnapshot, messagesLoading, __error] = useCollection(queryGetMessages)

  const handleShowMessage = () => {
    // If front-end is loading messsages behind the scenes, display messages from SSR (passed from [id].tsx)
    if (messagesLoading) {
      return messages.map(message => <Message key={message.id} message={message} />)
    }

    // If front-end has finished loading => have messages snapshot
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map(message => <Message key={message.id} message={transformMessage(message)} />)
    }

    return null
  }

  const addMessageOnDbAndUpdateLastSeen = async () => {
    //Update last seen in 'users' collection
    await setDoc(doc(db, 'users', loggedInUser?.email as string), {
      lastSeen: serverTimestamp()
    }, { merge: true })

    //Add new message to 'messages' collection
    await addDoc(collection(db, 'messages'), {
      conversation_id: conversationId,
      sent_at: serverTimestamp(),
      text: newMessage,
      user: loggedInUser?.email,
    })

    //And reset input field
    setNewMessage('')

    //And auto scroll
    scrollToBottom()
  }

  const handleSendMessageOnEnter: KeyboardEventHandler<HTMLInputElement> = event => {
    if (event.key === 'Enter') {
      event.preventDefault()
      if (!newMessage) return
      addMessageOnDbAndUpdateLastSeen()
    }
  }

  const handleSendMessageOnClick: MouseEventHandler<HTMLButtonElement> = event => {
    event.preventDefault()
    if (!newMessage) return
    addMessageOnDbAndUpdateLastSeen()
  }

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <>
      <StyledRecipentHeader>
        <RecipientAvatar
          recipient={recipient}
          recipientEmail={recipientEmail}
        />

        <StyledHeaderInfo>
          <StyledH3>
            {recipientEmail}
          </StyledH3>
          {
            recipient && <span>Last seen: {convertFirestoreTimestampToString(recipient.lastSeen)}</span>
          }
        </StyledHeaderInfo>

        <StyledHeaderIcons>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </StyledHeaderIcons>
      </StyledRecipentHeader>

      <StyledMessageContainer>
        {handleShowMessage()}
        {/* Auto scroll to the lastest message when send new message */}
        <EndOfMessagesForAutoScroll ref={endOfMessagesRef} />
      </StyledMessageContainer>

      <StyledInputContainer>
        <InsertEmoticonIcon />
        <StyledInput value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={handleSendMessageOnEnter} />
        <IconButton onClick={handleSendMessageOnClick} disabled={!newMessage}>
          <SendIcon />
        </IconButton>
        <IconButton>
          <MicIcon />
        </IconButton>
      </StyledInputContainer>
    </>
  )
}

export default ConversationScreen
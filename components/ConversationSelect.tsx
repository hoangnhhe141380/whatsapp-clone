import { useRecipient } from "@/hooks/useRecipient"
import { Conversation } from "@/types"
import { useRouter } from "next/router"
import React from "react"
import styled from "styled-components"
import RecipientAvatar from "./RecipientAvatar"

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  word-break: break-all;
  :hover {
    background-color: #e9eaeb;
  }
`

const StyledTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: flex-start;
  gap: 8px;
`
const StyledEmail = styled.span`
  font-weight: bold;
`

const StyledNewestMessage = styled.span`
`

const ConversationSelect = ({
  id,
  currentActive,
  conversationUsers,
  newestMessage
}: {
  id: string
  currentActive: string | string[] | undefined
  conversationUsers: Conversation["users"]
  newestMessage: Conversation['newestMessage']
}) => {
  const { recipient, recipientEmail } = useRecipient(conversationUsers)

  const router = useRouter()

  const handleSelectConversation = () => {
    router.push(`/conversations/${id}`)
  }

  const newestMes = newestMessage?.text ? newestMessage.user === recipientEmail ? newestMessage.text : `You: ${newestMessage.text}` : ``

  return (
    <StyledContainer
      onClick={handleSelectConversation}
      // bg={id === currentActive ? 'lightgray' : 'white'}
      style={{ backgroundColor: id === currentActive ? "lightgray" : "white" }}
    >
      <RecipientAvatar recipient={recipient} recipientEmail={recipientEmail} />
      <StyledTextContainer>
        <StyledEmail>{recipientEmail}</StyledEmail>
        <StyledNewestMessage>{`${newestMes}`}</StyledNewestMessage>
      </StyledTextContainer>
    </StyledContainer>
  )
}

export default ConversationSelect

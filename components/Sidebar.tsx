import { useState } from "react"
import { Avatar, IconButton, Tooltip, Button } from "@mui/material"
import ChatIcon from "@mui/icons-material/Chat"
import MoreVerticalIcon from "@mui/icons-material/MoreVert"
import LogoutIcon from "@mui/icons-material/Logout"
import SearchIcon from "@mui/icons-material/Search"
import styled from "styled-components"
import { signOut } from "firebase/auth"
import { auth, db } from "@/config/firebase"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import TextField from "@mui/material/TextField"
import DialogActions from "@mui/material/DialogActions"
import { useAuthState } from "react-firebase-hooks/auth"
import * as EmailValidator from "email-validator"
import { addDoc, collection, query, where } from "firebase/firestore"
import { useCollection } from "react-firebase-hooks/firestore"
import { Conversation } from "@/types"
import ConversationSelect from "./ConversationSelect"
import { useRouter } from "next/router"

const StyledContainer = styled.div`
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;
  border-right: 1px solid whitesmoke;
  /* Hide scrollbar for Chrome, Safari and Opera */
  ::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`

const StyledUserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px 0 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
`

const StyledSearch = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 2px;
`

const StyledSearchInput = styled.input`
  outline: none;
  border: none;
  flex: 1;
`

const StyledSidebarButton = styled(Button)`
  width: 100%;
  border-top: 1px solid whitesmoke;
  border-bottom: 1px solid whitesmoke;
  font-style: bold;
`

const Sidebar = () => {
  const [isOpenNewConversationDialog, setIsOpenNewConversationDialog] =
    useState(false)
  const [loggedInUser, _loading, _error] = useAuthState(auth)
  const [recipientEmail, setRecipientEmail] = useState("")

  const router = useRouter()
  const currentConversationSelectId = router.query.id

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/')
    } catch (error) {
      console.log(`Error logout ${error}`)
    }
  }

  const handleToggleNewConversationDialog = (isOpen: boolean) => {
    setIsOpenNewConversationDialog(isOpen)

    if (!isOpen) setRecipientEmail("")
  }

  const queryGetConversationsForCurrentUser = query(
    collection(db, "conversations"),
    where("users", "array-contains", loggedInUser?.email)
  )
  const [conversationsSnapshot, __loading, __error] = useCollection(
    queryGetConversationsForCurrentUser
  )

  const isConversationAlreadyExists = (recipientEmail: string) => {
    return conversationsSnapshot?.docs.find(conversation =>
      (conversation.data() as Conversation).users.includes(recipientEmail)
    )
  }

  const isSeftInviting = recipientEmail === loggedInUser?.email

  const handleCreateConversation = async () => {
    if (!recipientEmail) return

    if (
      EmailValidator.validate(recipientEmail) &&
      !isSeftInviting &&
      !isConversationAlreadyExists(recipientEmail)
    ) {
      await addDoc(collection(db, "conversations"), {
        users: [loggedInUser?.email, recipientEmail]
      })
    }

    handleToggleNewConversationDialog(false)
  }

  return (
    <StyledContainer>
      <StyledHeader>
        <Tooltip title={loggedInUser?.email as string} placement="right">
          <StyledUserAvatar src={loggedInUser?.photoURL || ""} />
        </Tooltip>
        <div>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVerticalIcon />
          </IconButton>
          <IconButton onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </div>
      </StyledHeader>
      <StyledSearch>
        <SearchIcon />
        <StyledSearchInput placeholder="Search in conversations" />
      </StyledSearch>

      <Dialog
        open={isOpenNewConversationDialog}
        onClose={() => handleToggleNewConversationDialog(false)}
      >
        <DialogTitle>New Conversation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a google email address for the user you wish to chat
            with
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={recipientEmail}
            onChange={e => setRecipientEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleToggleNewConversationDialog(false)}>
            Cancel
          </Button>
          <Button
            disabled={!recipientEmail}
            onClick={() => handleCreateConversation()}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <StyledSidebarButton
        onClick={() => handleToggleNewConversationDialog(true)}
      >
        Start a new conversation
      </StyledSidebarButton>

      {conversationsSnapshot?.docs.map(conversation => (
        <ConversationSelect
          key={conversation.id}
          id={conversation.id}
          currentActive={
            currentConversationSelectId as string | string[] | undefined
          }
          conversationUsers={(conversation.data() as Conversation).users}
          newestMessage={(conversation.data() as Conversation).newestMessage}
        />
      ))}
    </StyledContainer>
  )
}

export default Sidebar

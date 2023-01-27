import { Avatar, IconButton, Tooltip, Button } from '@mui/material'
import ChatIcon from '@mui/icons-material/Chat'
import MoreVerticalIcon from '@mui/icons-material/MoreVert'
import LogoutIcon from '@mui/icons-material/Logout'
import SearchIcon from '@mui/icons-material/Search'
import styled from 'styled-components'

const StyledContainer = styled.div`
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;
  border-right: 1px solid whitesmoke;
`

const StyledUserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover{
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
  return (
    <StyledContainer>
      <StyledHeader>
        <Tooltip title='User email' placement='right'>
          <StyledUserAvatar />
        </Tooltip>
        <div>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVerticalIcon />
          </IconButton>
          <IconButton>
            <LogoutIcon />
          </IconButton>
        </div>
      </StyledHeader>
      <StyledSearch>
        <SearchIcon />
        <StyledSearchInput placeholder='Search in conversations' />
      </StyledSearch>

      <StyledSidebarButton>Start a new conversation</StyledSidebarButton>
    </StyledContainer>
  )
}

export default Sidebar
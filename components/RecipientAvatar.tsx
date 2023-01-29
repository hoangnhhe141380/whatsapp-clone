import { Avatar } from '@mui/material'
import { useRecipient } from '@/hooks/useRecipient'
import { AppUser } from '@/types'
import styled from 'styled-components'

type RecipientAvatarProps = ReturnType<typeof useRecipient>

const StyledAvatar = styled(Avatar)`
  margin: 5px 15px 5px 5px
`

const RecipientAvatar = ({ recipient, recipientEmail }: RecipientAvatarProps) => {
  return (
    recipient?.photoURL ?
      <StyledAvatar src={recipient.photoURL} /> :
      <StyledAvatar>
        {recipientEmail && recipientEmail[0].toUpperCase()}
      </StyledAvatar>
  )
}

export default RecipientAvatar
import React from 'react'
import Image from 'next/image'
import styled from 'styled-components'
import { CircularProgress, Typography } from '@mui/material'
import WhatsAppLogo from '../assets/whatsapplogo.png'


const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`

const StyledImageWrapper = styled.div`
  margin-bottom: 50px;
`
const Error = () => {
  return (
    <StyledContainer>
      <StyledImageWrapper>
        <Image src={WhatsAppLogo} alt='Whatsapp Logo' height={200} width={200} />
      </StyledImageWrapper>
      <Typography variant="h6">
        Oops! Something went wrong!
      </Typography>

    </StyledContainer>
  )
}

export default Error
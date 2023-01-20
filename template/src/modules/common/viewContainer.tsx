import React from 'react'
import styled from 'styled-components'

interface ViewContainerProps {
  children: React.ReactNode
}

function ViewContainer({ children }: ViewContainerProps) {
  return (
    <Container>
      <Wrap>{children}</Wrap>
    </Container>
  )
}

const Container = styled.main`
  margin: auto;
  background: var(--main-bg-color);
  max-width: var(--max-width);
  height: 100%;
  width: 100%;
`

const Wrap = styled.section`
  height: 100%;
  padding: 0 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export default ViewContainer

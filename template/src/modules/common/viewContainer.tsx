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
  font-size: var(--text-M);
  max-width: var(--max-width);
  height: 100%;
  width: 80%;
`

const Wrap = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export default ViewContainer

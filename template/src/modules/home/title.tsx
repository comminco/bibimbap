import styled from 'styled-components'

function Title() {
  return (
    <TitleComp
      onClick={() =>
        window.open('https://github.com/comminco/bibimbap', '_blank')
      }
    >
      bibimbap
    </TitleComp>
  )
}

const TitleComp = styled.header`
  color: var(--key-color);
  font-size: var(--text-XL);
  font-weight: bold;
  margin-top: 1rem;
  cursor: pointer;
`

export default Title

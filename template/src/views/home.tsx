import ViewContainer from '@/modules/common/viewContainer'
import Title from '@/modules/home/title'

function Home() {
  return (
    <ViewContainer>
      <Title />
      <p>
        'bibimbap' is korean food put various vegetables with rice in a bowl and
        mixed it.
      </p>
      <p>Also 'bibimbap' is a template that put packages like react, vite</p>
      <p>
        It provides useful packages to develop and guides efficient folder
        constructure.
      </p>
      <p>
        Now you don't have to install packages one by one or create folders.
      </p>
    </ViewContainer>
  )
}

export default Home

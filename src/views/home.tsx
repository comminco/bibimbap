import ViewContainer from '@/modules/common/viewContainer'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <ViewContainer>
      <div
        style={{
          position: 'absolute',
          top: '130px',
          textAlign: 'center',
        }}
      >
        <p>flatto is lovely service sharing your taste of media.</p>
        <p>
          let me know <span className="highlight">fucking cool media</span> that
          moved your heart.
        </p>
      </div>
      {/* <LogoBanner /> */}
      <Title />

      <Input leftText={'I'} rightText={'D'} />
      <Input type="password" leftText={'PS'} rightText={'WD'} />

      <Link to={'/me'}>
        <Button text={'IN'} />
      </Link>

      <Link to={'/new'}>
        <Button text={'NEW'} />
      </Link>
    </ViewContainer>
  )
}

export default Home

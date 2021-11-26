import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import GlobalStyle from '../../global-styles';
import { Hatch } from '../../components/Hatch';

const AppContainer = styled.div`
 width: 100vw;
 min-width: 220px;
 height: 100vh;
 position: absolute;
`;

const ContainerWrap = styled.div`
    z-index: 1;
    position:absolute;
    left: 0;
    bottom: 3vh;
    right: 0;
    height: 75vh;
    min-width: 200px;
    overflow: scroll;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    
`
const Heading = styled.div`
    position:absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 20vh;
    display: flex;
    align-items: center;
    justify-content: center;
`;


const H1 = styled.h1`
  color: #ff0000;
  font-size: clamp(3rem, 1.6765rem + 2.3529vw, 6rem);
  text-shadow: 2px 2px 2px #000;
  user-select:none;
`;

export interface HatchData {
  id: string;
  day: number;
  url: string;
  open: boolean;
}

export interface HatchObject {
  hatches: HatchData[]
}

const App: React.FC = () => {

  const [hatches, setHatches] = useState<HatchData[]>([]);

  useEffect(() => {
    //Fetch the Hatches;
    async function fetchData() {
      const response = await fetch('/hatches.json');
      const jsonData = await response.json();
      setHatches(((jsonData as any) as HatchObject).hatches);
    }
    fetchData();
  }, []);

  const toggleOpen = (id?: string) => {
    const newHatches = hatches.map(h => {
      if (id && h.id === id) {
        return { ...h, open: !h.open }
      } else {
        return { ...h, open: false }
      }
    });
    setHatches(newHatches)
  }


  return (
    <React.Fragment>
      <AppContainer>
        <Heading>
          <H1>Adventkalender</H1>
        </Heading>
        <ContainerWrap>
          {hatches.map((h) =>
            (<Hatch key={h.id} hatch={h} toggleOpen={toggleOpen} />)
          )}
        </ContainerWrap>
      </AppContainer >

      <GlobalStyle />
    </React.Fragment >
  )
}

export default App;
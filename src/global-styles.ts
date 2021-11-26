import { createGlobalStyle } from 'styled-components';
import { normalize } from 'styled-normalize';

/*
WARNING: DO NOT USE @import in createGlobalStyles
see: https://github.com/styled-components/styled-components/issues/2911#issuecomment-592012166
*/

const GlobalStyle = createGlobalStyle`
${normalize}


  html,
  body {
    height: 100vh;
    width: 100vw;
    min-width: 220px;
    overflow:hidden;
    background-color: burlywood;
    background: url("calendar-bkg.jpg"); 
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
  }

  *,
  ::before,
  ::after {
    box-sizing: unset;
  }

`;

export default GlobalStyle;

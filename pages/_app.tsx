import { createGlobalStyle } from "styled-components";
const GlobalStyles = createGlobalStyle`
  *, *:before, *:after {
    box-sizing: border-box;
    position: relative;
  }

  body, html {
    margin: 0;
    padding: 0;
  }

  * {
    font-family: 'Muli', sans-serif;
  }
`;

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      {/* TODO: should put these in the <head> but getting weird error */}
      <link
        href="https://fonts.googleapis.com/css2?family=Muli:ital,wght@0,400;0,700;1,400&display=swap"
        rel="stylesheet"
      />
      <GlobalStyles />
      <Component {...pageProps} />
    </>
  );
}

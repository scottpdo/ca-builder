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

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  }
`;

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <GlobalStyles />
      <Component {...pageProps} />
    </>
  );
}

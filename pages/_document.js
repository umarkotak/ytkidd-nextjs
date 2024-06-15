import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" data-theme="light">
      <head>
        <script
          src="https://code.jquery.com/jquery-3.7.1.min.js"
          integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo="
          crossOrigin="anonymous"
        ></script>
        <link
          href='https://fonts.googleapis.com/css?family=Muli'
          rel='stylesheet'
        />
      </head>

      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

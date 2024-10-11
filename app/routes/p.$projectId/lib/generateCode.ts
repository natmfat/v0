export function generateCode(code: string) {
  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>v0</title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossorigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&family=IBM+Plex+Sans:wght@400;500;600&display=swap"
      />
      <script src="https://cdn.tailwindcss.com"></script>

      <style>
        html, body {
          background-color: #f3f4f6;
        }

        #root {
          margin: 0 auto;
          width: fit-content;
        }
      </style>
    </head>
    <body>
      <div id="root"></div>
      <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
      <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
      <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
      <script type="text/babel">
        Object.assign(window, React);

        ${code}

        ReactDOM.render(<App />, document.querySelector("#root"));
      </script>
    </body>
  </html>`;
}

export const FAKE_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>v0</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link
      rel="preconnect"
      href="https://fonts.gstatic.com"
      crossorigin="anonymous"
    />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&family=IBM+Plex+Sans:wght@400;500;600&display=swap"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;

import { renderToReadableStream } from "react-dom/server";
import type { ComponentType } from "react";

interface FrameworkProps {
  title: string;
  dev?: boolean;
  [key: string]: unknown;
}

interface ComponentProps {
  [key: string]: unknown;
}

function Page(
  { frameworkProps, page }: {
    frameworkProps: FrameworkProps;
    page: JSX.Element;
  },
) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href="/static/favicon.ico" />
        <title>{frameworkProps.title}</title>
      </head>
      <body>
        <script src="/app.js"></script>
        <link rel="stylesheet" href="/app.css"></link>
        {page}
      </body>
    </html>
  );
}

export async function getStream(
  props: ComponentProps,
  frameworkProps: FrameworkProps,
  Pagetsx: ComponentType<any>,
) {
  return await renderToReadableStream(
    <Page
      frameworkProps={frameworkProps}
      page={
        <div id="page">
          <Pagetsx {...props} />
          <script>
            {`document.addEventListener(\`DOMContentLoaded\`, function (event) {
              startHydrate(\`${Pagetsx.name}\`, \`#page\`, JSON.parse(atob(\`${
              btoa(JSON.stringify(props))
            }\`)))});`}
          </script>
          {frameworkProps.dev
            ? (
              <script>
                {`document.addEventListener(\`DOMContentLoaded\`, function (event) {
                    starDevTools()
                });`}
              </script>
            )
            : <></>}
        </div>
      }
    />,
  );
}

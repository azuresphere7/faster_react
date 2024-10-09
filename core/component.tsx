import { renderToReadableStream } from "react-dom/server";

interface ComponentProps {
  [key: string]: unknown;
}

export async function getComponentStream(
  props: ComponentProps,
  Componentsx: any,
) {
  const id = "c" + crypto.randomUUID();

  return await renderToReadableStream(
    <div id={id} className={`react-component ${Componentsx.name}`}>
      <Componentsx {...props} />
      <script>
        {`startHydrate(\`${Componentsx.name}\`, \`#${id}\`, JSON.parse(atob(\`${
          btoa(JSON.stringify(props))
        }\`)));`}
      </script>
    </div>,
  );
}

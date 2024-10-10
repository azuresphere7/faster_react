/* Use only frontend libraries here.
You can organize your files into subdirectories here.
The .tsx extension is used here.
These components are rendered on the server and hydrated on the client.
Two routes are generated per file. One route for the file to be rendered as a component (to be inserted into an existing page) and one route for the file to be rendered as a page. For example, the file frontend/components/checkout/cart.tsx has the routes /pages/checkout/cart and /components/checkout/cart.
Initial route / is considered a page route and will point to frontend/components/index.tsx
You need to have a default export with the React Function/Component.
The props passed to the component includes
Form-submitted data (or JSON POST);
URL search parameters, such as /pages/myPage?a=1&b=2 will result in {a:1, b:2};
backend/components manipulations; */
import { Component } from "react";
import Counter from "./Counter.tsx";
import { greet } from "../files/general.ts";
import { getJSON, route } from "@helpers/frontend/route.ts";

export default class MyIndexPage extends Component {
  override render() {
    return (
      <div className="card-container">
        <h1>{"Route Examples"}</h1>
        <p className="greeting">{greet()} {"Dustin!"}</p>

        <div className="action-container">
          <button
            onClick={route({
              path: "/pages/index",
            })}
          >
            {"Navigate to index page"}
          </button>

          <button
            onClick={async () => {
              const res = await getJSON({
                path: "/example/json",
                content: {
                  "test": "testData",
                },
              });
              console.log(res);
              alert(JSON.stringify(res));
            }}
          >
            {"Get API JSON"}
          </button>
        </div>

        <Counter />
        <div id="myAnotherCounter"></div>

        <button
          className="add-counter-btn"
          onClick={route({
            path: "/components/Counter",
            elSelector: "#myAnotherCounter",
          })}
        >
          {"Add Another Counter"}
        </button>
      </div>
    );
  }
}

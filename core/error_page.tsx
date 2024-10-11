import { Component } from "react";

interface FrameworkErrorPageProps {
  msg: string;
  stack: string;
  [key: string]: unknown;
}

export default class FrameworkErrorPage
  extends Component<FrameworkErrorPageProps> {
  override render() {
    return (
      <>
        <h1>{"Error"}</h1>
        <ul>
          <li>
            <strong>{"Error:"}</strong>
            {this.props.msg}
          </li>
          <li>
            <strong>{"Stack:"}</strong>
            {this.props.stack}
          </li>
        </ul>
      </>
    );
  }
}

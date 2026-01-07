import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <h1>Hello</h1>
      <p>To get started, please visit any of the following links:</p>
      <ul>
        <li>
          <a href="/ai">AI</a>
        </li>
        <li>
          <a href="/get-cookies">Cookies</a>
        </li>
      </ul>
    </div>
  );
}

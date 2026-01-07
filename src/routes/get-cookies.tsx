import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader, setCookie } from "@tanstack/react-start/server";

const getCookieServerFn = createServerFn({ method: "GET" }).handler(() => {
  const header = getRequestHeader("cookie")
    ?.split("; ATK=")
    .pop()
    ?.split(";")
    .shift();

  return header;
});

const setCookieServerFn = createServerFn({ method: "POST" })
  .inputValidator((data: string) => data)
  .handler((ctx) => {
    setCookie("ATK", ctx.data);
  });

export const Route = createFileRoute("/get-cookies")({
  component: RouteComponent,
  beforeLoad: () => {
    return { token: getCookieServerFn() };
  },
});

function RouteComponent() {
  const { token } = Route.useRouteContext();

  return (
    <div>
      your token: {token}
      <form
        onSubmit={(e) => {
          e.preventDefault();

          const formValues = new FormData(e.currentTarget);
          const value = formValues.get("value");

          if (value) {
            setCookieServerFn({ data: value.toString() });
          }
        }}
      >
        <input type="text" name="value" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

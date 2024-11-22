import { json, redirect,LoaderFunctionArgs } from "@remix-run/node";
import { useEffect, useState } from "react";
import {
  Form,
  Link,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
  useSubmit
} from "@remix-run/react";
import { getTopics, createEmptyTopic } from "./data";
import type { LinksFunction } from "@remix-run/node";
import appStylesHref from "./app.css?url";

export const action = async () => {
  const topic = await createEmptyTopic();
 // return json({ topic });
 return redirect(`/topics/${topic.id}/edit`);
}
export const links: LinksFunction = () => [
  {
    rel: "stylesheet", href: appStylesHref
  }
];
export const loader = async ({
  request,
}: LoaderFunctionArgs ) => {
  const url = new URL (request.url);
  const q = url.searchParams.get('q')
  const topics = await getTopics(q);
  return json({ topics, q });
};
export default function App() {
  const { topics, q } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const searching = navigation.location && new URLSearchParams(navigation.location.search).has("q")
  const [query, setQuery] = useState(q || "");

  useEffect(() => {
    setQuery(q || "");
  }, [q]);

  useEffect(() => {
    const searchField = document.getElementById("q");
    if(searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);


  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="sidebar">
          <h1>Chemistry Topics</h1>
          <div>
            <Form 
               id="search-form" 
               role="search"
               onChange={(event) => {
                const isFirstSearch = q === null;
                submit(event.currentTarget, { replace: isFirstSearch})
               }}

               >
              <input
                id="q"
                aria-label="Search topics"
                className={searching ? "loading" : ""}
                defaultValue={q || "" }
                placeholder="Search topic"
                type="search"
                name="q"
                onChange={(event) => setQuery(event.currentTarget.value)}
                value={query}
              />
              <div id="search-spinner" aria-hidden hidden={!searching} />
            </Form>
          </div>
          <nav>
              {topics.length ? (
              <ul>
                {topics.map((topic) => (
                  <li key={topic.id}>
                     <NavLink 
                       className={({ isActive, isPending }) =>
                        isActive ? "active" : isPending ? "pending" : ""
                      }
                      to={`topics/${topic.id}`}>
                      {topic.title || topic.title ? (
                        <>
                          {topic.title}
                        </>
                      ) : (
                        <i>No Topic</i>
                      )}{" "}
                      {topic.content ? (
                        <span>★</span>
                      ) : null}
                    </NavLink> 
                  </li>
                ))}
              </ul> 
            ) : (
              <p>
                <i>No topics</i>
              </p>
            )} 
            
          </nav>
        </div>

        <ScrollRestoration />
        <Scripts />
        <div 
          className={
            navigation.state === "loading" && !searching  ? "loading" : ""
          }
          id="detail">
          <Outlet />
        </div>
      </body>
    </html>
  );
}

 import { Form, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { FunctionComponent } from "react";
import { getTopic } from "../data";
import type { LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import type { TopicRecord } from "../data";

export const loader = async ({
    params,
  }: LoaderFunctionArgs) => {
    invariant(params.topicId, "Missing topicId param");
    const topic = await getTopic(params.topicId);
    if(!topic) {
        throw new Response("Not Found", {status: 404});
    }
    return json({ topic });
  };
export default function topic() {
     const { topic } = useLoaderData<typeof loader>();
 
  return (
    <div id="topic">
      <div>
        <h1 key={topic.title}>
          {topic.title}
        </h1>
          
      </div>

      <div>
        <h5>
          {topic.content || topic.content ? (
            <>
              {topic.content}
            </>
          ) : (
            <i>No content under this topic</i>
          )}{" "}
        </h5>

        {topic.content ? (
          <p>
            {topic.description}
          </p>
        ) : null}

        {topic.content ? <p></p> : null}
      </div>
    </div>
  );
}


 

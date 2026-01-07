import React from "react";
import { chat, toServerSentEventsStream } from "@tanstack/ai";
import { createGeminiChat } from "@tanstack/ai-gemini";
import { fetchServerSentEvents, useChat } from "@tanstack/ai-react";
import { createFileRoute } from "@tanstack/react-router";

const chatAdapter = createGeminiChat(
  "gemini-2.5-flash-lite",
  "AIzaSyDkUH0p-l0zhghYvppiz7HBGuh9WIH4_5Q"
);

export const Route = createFileRoute("/ai")({
  component: RouteComponent,
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { messages } = await request.json();
          const stream = chat({ adapter: chatAdapter, messages });

          return new Response(toServerSentEventsStream(stream));
        } catch (error) {
          return new Response(
            JSON.stringify({
              error:
                error instanceof Error ? error.message : "An error occurred",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
});

function RouteComponent() {
  const [input, setInput] = React.useState("");
  const { messages, sendMessage, isLoading } = useChat({
    connection: fetchServerSentEvents("/"),
  });

  return (
    <div>
      <div>
        {messages.map((message) => (
          <div key={message.id}>
            <div>{message.role === "assistant" ? "Assistant" : "You"}</div>
            <div>
              {message.parts.map((part, idx) => {
                if (part.type === "thinking") {
                  return <div key={idx}>💭 Thinking: {part.content}</div>;
                }

                if (part.type === "text") {
                  return <div key={idx}>{part.content}</div>;
                }

                return null;
              })}
            </div>
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          sendMessage(input);
        }}
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <label htmlFor="chat">Enter message:</label>
        <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <textarea
            disabled={isLoading}
            id="chat"
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

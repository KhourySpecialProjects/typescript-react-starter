import { useState } from "react";
import { listMessages, type Message } from "./api/generated";

export const App = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string>();

  const load = async () => {
    const result = await listMessages();
    if (!result.data) {
      setError("Could not load messages");
      return;
    }
    setError(undefined);
    setMessages(result.data);
  };

  return (
    <main>
      <button type="button" onClick={load}>
        Load messages
      </button>
      {error && <p>{error}</p>}
      <ul>
        {messages.map((message) => (
          <li key={message.id}>{message.text}</li>
        ))}
      </ul>
    </main>
  );
};

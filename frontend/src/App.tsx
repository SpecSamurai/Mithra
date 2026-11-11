import { useState } from "react";
import NameForm from "./components/NameForm";
import Chat from "./components/Chat";

export default function App() {
  const [name, setName] = useState<string | null>(null);

  if (!name) {
    return <NameForm onSubmit={setName} />;
  }

  return <Chat name={name} />;
}

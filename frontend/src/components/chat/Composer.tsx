import { useState, type FormEvent } from "react";

type ComposerProps = {
  onSend: (text: string) => void;
  disabled?: boolean;
};

export default function Composer({ onSend, disabled = false }: ComposerProps) {
  const [draft, setDraft] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    onSend(text);
    setDraft("");
  }

  return (
    <form className="chat-composer" onSubmit={handleSubmit}>
      <input
        type="text"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="Type a message…"
        autoFocus
        disabled={disabled}
      />
      <button type="submit" disabled={disabled || !draft.trim()}>
        Send
      </button>
    </form>
  );
}

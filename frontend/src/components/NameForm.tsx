import { useState, type FormEvent } from "react";

type NameFormProps = {
  onSubmit: (name: string) => void;
};

export default function NameForm({ onSubmit }: NameFormProps) {
  const [value, setValue] = useState("");
  const trimmed = value.trim();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!trimmed) return;
    onSubmit(trimmed);
  }

  return (
    <div className="page page--center">
      <form className="name-form" onSubmit={handleSubmit}>
        <h1>Interviewer</h1>
        <p>Enter your full name to begin.</p>
        <label htmlFor="full-name">Full name</label>
        <input
          id="full-name"
          type="text"
          autoComplete="name"
          autoFocus
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Jane Doe"
        />
        <button type="submit" disabled={!trimmed}>
          Continue
        </button>
      </form>
    </div>
  );
}

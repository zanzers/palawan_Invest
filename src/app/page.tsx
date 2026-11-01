"use client";

import { AssistantReply } from "@/type/clientType";
import { useState } from "react";


export default function Home(){
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<AssistantReply | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function send() {
    const text = message.trim();
    if (!text || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
    const res = await fetch("/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 640, margin: "40px auto", padding: 16 }}>
      <h1>Real Estate Assistant</h1>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask something..."
        rows={4}
        style={{ width: "100%", marginTop: 16 }}
      />

      <button onClick={send} disabled={loading || !message.trim()}>
        {loading ? "Thinking..." : "Send"}
      </button>

      {error && <p style={{ color: "crimson" }}>Error: {error}</p>}

      {result && (
        <div style={{ marginTop: 16 }}>
          <p style={{ whiteSpace: "pre-wrap" }}>{result.reply}</p>
          <small>Answered by {result.model}</small>
        </div>
      )}
    </main>
  );
}


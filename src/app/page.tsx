"use client";


import { getAccessToken } from "@/lib/supabase/browser";
import { AssistantReply, DirectListing } from "@/type/clientType";
import { useState } from "react";

type Turn = { role: "user" | "assistant"; text: string; model?: string };

const UNAVAILABLE_STATUSES = [429, 502, 503];

export default function Home() {
  const [message, setMessage] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // fallback state
  const [unavailable, setUnavailable] = useState(false);
  const [location, setLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [direct, setDirect] = useState<DirectListing[] | null>(null);

  async function send() {
    const text = message.trim();
    if (!text || loading) return;

    setLoading(true);
    setError(null);

    try {
      const token = await getAccessToken();

      const res = await fetch("/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: text,
          conversation_id: conversationId ?? undefined,
        }),
      });
      const data = (await res.json()) as AssistantReply & { error?: string };

      if (!res.ok) {
        if (UNAVAILABLE_STATUSES.includes(res.status)) setUnavailable(true);
        throw new Error(data.error ?? "Request failed");
      }

      setUnavailable(false);
      setConversationId(data.conversation_id);
      setTurns((t) => [
        ...t,
        { role: "user", text },
        { role: "assistant", text: data.reply, model: data.model },
      ]);
      setMessage(""); // cleared only after success, so a failed request keeps your text
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function directSearch() {
    setError(null);

    const params = new URLSearchParams();
    if (location.trim()) params.set("location", location.trim());
    const cleanPrice = maxPrice.replace(/[^\d.]/g, "");
    if (cleanPrice) params.set("max_price", cleanPrice);

    try {
      const res = await fetch(`/listings?${params}`);
      if (!res.ok) throw new Error(`Search failed (${res.status})`);
      const data = await res.json();
      setDirect(data.listings);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    }
  }

  function newChat() {
    setTurns([]);
    setConversationId(null);
    setError(null);
    setUnavailable(false);
    setDirect(null);
  }

  return (
    <main style={{ maxWidth: 640, margin: "40px auto", padding: 16 }}>
      <h1>Real Estate Assistant</h1>

      {turns.map((t, i) => (
        <div key={i} style={{ marginTop: 12 }}>
          <strong>{t.role === "user" ? "You" : "Assistant"}:</strong>
          <p style={{ whiteSpace: "pre-wrap" }}>{t.text}</p>
          {t.model && <small>Answered by {t.model}</small>}
        </div>
      ))}

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
      <button onClick={newChat} disabled={loading} style={{ marginLeft: 8 }}>
        New chat
      </button>

      {error && <p style={{ color: "crimson" }}>Error: {error}</p>}

      {unavailable && (
        <section style={{ marginTop: 24 }}>
          <p>The assistant is unavailable right now. You can still search directly:</p>

          <input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <input
            placeholder="Max price (PHP)"
            inputMode="numeric"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          <button onClick={directSearch}>Search</button>

          {direct?.length === 0 && <p>No listings found.</p>}
          {direct?.map((l) => (
            <div key={l.code} style={{ marginTop: 12 }}>
              <strong>{l.title}</strong> ({l.code}) · {l.location}
              {l.developer && <> · {l.developer}</>}
              <ul>
                {l.units.map((u, i) => (
                  <li key={i}>
                    {u.unit_type}: ₱{u.price.toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
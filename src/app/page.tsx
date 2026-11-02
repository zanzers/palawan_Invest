"use client";

import { AssistantReply, DirectListing } from "@/type/clientType";
import { useState } from "react";


const UNAVAIL_STATE = [429, 502, 503];


export default function Home(){
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<AssistantReply | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  const [unavailable, setUnavailable] = useState(false);
  const [location, setLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [direct, setDirect] = useState<DirectListing[] | null>(null);

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

        if (!res.ok) {
          if(UNAVAIL_STATE.includes(res.status)) setUnavailable(true);
          throw new Error(data.error ?? "Request failed");
        }

        setUnavailable(false);
        setResult(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
  }

  async function directSearch(){
    setError(null);

    const params = new URLSearchParams();
    if (location.trim()) params.set("location", location.trim());
    if (maxPrice) params.set("max_price", maxPrice);

    try {
      const res = await fetch(`/listings?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Search failed");
      setDirect(data.listings);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
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


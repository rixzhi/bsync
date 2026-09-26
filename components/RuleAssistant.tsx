"use client";

import { useState, type FormEvent } from "react";
import { LoaderCircle, Send } from "lucide-react";
import { askRuleAssistant, type AssistantReply, type ChatRole } from "@/lib/ai-chat";

interface RuleAssistantProps {
  role: ChatRole;
  darkMode: boolean;
}

export default function RuleAssistant({ role, darkMode }: RuleAssistantProps) {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState<AssistantReply | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = message.trim();
    if (!question || isLoading) return;

    setIsLoading(true);
    setError("");
    setReply(null);

    try {
      setReply(await askRuleAssistant(role, question));
      setMessage("");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Could not reach the assistant. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section
      className={`rounded-2xl border p-6 shadow-sm ${
        darkMode
          ? "border-slate-800 bg-slate-900 text-slate-100"
          : "border-slate-200 bg-white text-slate-900"
      }`}
    >
      <div className="mb-4">
        <h3 className="font-bold">AI Rule Assistant</h3>
        <p className={`mt-1 text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
          Ask a general question about the zoning rules. Do not enter Aadhaar numbers or other private information.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          maxLength={2000}
          rows={3}
          required
          aria-label="Question about zoning rules"
          placeholder="For example: What setback is required for a residential building?"
          className={`w-full resize-y rounded-xl border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
            darkMode
              ? "border-slate-700 bg-slate-950 text-white placeholder:text-slate-500"
              : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400"
          }`}
        />
        <button
          type="submit"
          disabled={isLoading || !message.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {isLoading ? "Thinking…" : "Ask assistant"}
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-500">
          {error}
        </p>
      )}

      {reply && (
        <div aria-live="polite" className={`mt-4 rounded-xl border p-4 ${darkMode ? "border-slate-800 bg-slate-950/60" : "border-slate-200 bg-slate-50"}`}>
          <p className="whitespace-pre-wrap text-sm leading-6">{reply.answer}</p>
          {reply.cited_rules.length > 0 && (
            <p className={`mt-3 text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Rules referenced: {reply.cited_rules.join(", ")}
            </p>
          )}
        </div>
      )}
    </section>
  );
}

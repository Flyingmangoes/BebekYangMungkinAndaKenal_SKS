import {
  ArrowRight,
  Compass,
  Hand,
  Lock,
  MessageCircleHeart,
  Mic,
  Moon,
  NotebookPen,
  Phone,
  Send,
  ThumbsUp,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { Link } from "react-router-dom";

import {
  buildCompanionReply,
  COMPANION_INTRO,
  INITIAL_MESSAGES,
  QUICK_JOURNAL_TILES,
  QUICK_REPLIES,
  SLOW_ESSAY,
} from "@/app/refleksi/refleksiService";
import type { ChatMessage } from "@/app/refleksi/refleksiService";
import { Artwork } from "@/components/ui/Artwork";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { LinkButton } from "@/components/ui/LinkButton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/cn";

type ReflectionMode = "companion" | "mandiri";

function currentTimeLabel(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

export function RefleksiPage() {
  const [mode, setMode] = useState<ReflectionMode>("companion");
  const [messages, setMessages] =
    useState<readonly ChatMessage[]>(INITIAL_MESSAGES);
  const [draft, setDraft] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const replyTimeoutRef = useRef<number | undefined>(undefined);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      window.clearTimeout(replyTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages]);

  function sendMessage(text: string) {
    const trimmed = text.trim();

    if (trimmed.length === 0) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      author: "user",
      text: trimmed,
      timeLabel: currentTimeLabel(),
    };

    setMessages((previous) => [...previous, userMessage]);
    setDraft("");

    if (mode === "mandiri") {
      return;
    }

    setIsReplying(true);
    window.clearTimeout(replyTimeoutRef.current);
    replyTimeoutRef.current = window.setTimeout(() => {
      const reply: ChatMessage = {
        id: `c-${Date.now()}`,
        author: "companion",
        text: buildCompanionReply(trimmed),
        timeLabel: currentTimeLabel(),
      };
      setMessages((previous) => [...previous, reply]);
      setIsReplying(false);
    }, 900);
  }

  function handleDraftChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setDraft(event.target.value);
  }

  const visibleMessages =
    mode === "mandiri"
      ? messages.filter((message) => message.author === "user")
      : messages;

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        level="h1"
        eyebrow="Ruang dialog hati"
        title="Refleksi Hari Ini"
        action={
          <div
            role="tablist"
            aria-label="Mode refleksi"
            className="flex gap-1 rounded-xl bg-cream-200/70 p-1"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === "mandiri"}
              onClick={() => {
                setMode("mandiri");
              }}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors",
                mode === "mandiri"
                  ? "bg-white text-ink-900 shadow-sm"
                  : "text-ink-500 hover:text-ink-900",
              )}
            >
              <NotebookPen size={14} aria-hidden="true" />
              Jurnal Refleksi Mandiri
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "companion"}
              onClick={() => {
                setMode("companion");
              }}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors",
                mode === "companion"
                  ? "bg-pelan-700 text-white shadow-sm"
                  : "text-ink-500 hover:text-ink-900",
              )}
            >
              <MessageCircleHeart size={14} aria-hidden="true" />
              Bicara dengan Teman Refleksi
            </button>
          </div>
        }
      />

      <div className="grid items-start gap-5 lg:grid-cols-[1.8fr_1fr]">
        {/* Panel percakapan */}
        <Card className="flex flex-col gap-0 p-0 lg:p-0">
          <div className="flex items-start gap-3 rounded-t-2xl bg-cream-200/70 px-5 py-4">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-pelan-700">
              <MessageCircleHeart size={15} aria-hidden="true" />
            </span>
            <div className="flex flex-col gap-1">
              <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-ink-900">
                {COMPANION_INTRO.name}
                <span className="text-[11px] font-normal text-ink-500">
                  •{" "}
                  {mode === "companion"
                    ? COMPANION_INTRO.badge
                    : "Catatan pribadi"}
                </span>
              </p>
              <p className="text-xs leading-relaxed text-ink-500">
                {mode === "companion"
                  ? COMPANION_INTRO.description
                  : "Tulis apa saja untuk dirimu sendiri. Catatan ini tidak dibalas siapa pun."}
              </p>
            </div>
          </div>

          <div
            className="flex max-h-104 flex-col gap-4 overflow-y-auto px-5 py-5"
            aria-live="polite"
            aria-label="Riwayat percakapan"
          >
            <p className="mx-auto rounded-full bg-cream-200 px-3 py-1 text-[10px] text-ink-500">
              Sore ini, 15.42 WIB
            </p>

            {visibleMessages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex flex-col gap-1",
                  message.author === "user" ? "items-end" : "items-start",
                )}
              >
                <p
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    message.author === "user"
                      ? "bg-white text-ink-900 ring-1 ring-cream-300"
                      : "bg-cream-200/80 text-ink-900",
                  )}
                >
                  {message.text}
                </p>
                <span className="px-1 text-[10px] text-ink-400">
                  {message.timeLabel}
                </span>
              </div>
            ))}

            {isReplying ? (
              <p className="text-xs italic text-ink-500">
                Teman refleksi sedang menulis pelan-pelan…
              </p>
            ) : null}
            <div ref={endOfMessagesRef} />
          </div>

          <div className="flex flex-col gap-3 px-5 pb-5">
            <Eyebrow>Jika energimu terbatas, ketuk langsung</Eyebrow>
            <div className="flex flex-wrap gap-2">
              {QUICK_REPLIES.map((reply) => (
                <button
                  key={reply.id}
                  type="button"
                  onClick={() => {
                    sendMessage(reply.label);
                  }}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                    reply.isRest
                      ? "bg-clay-100 text-clay-600 hover:bg-clay-200"
                      : "bg-cream-200 text-ink-700 hover:bg-cream-300",
                  )}
                >
                  {reply.isRest ? <Moon size={12} aria-hidden="true" /> : null}
                  {reply.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 rounded-xl bg-cream-200/60 p-3 ring-1 ring-cream-300/60">
              <label htmlFor="refleksi-draft" className="sr-only">
                Tulis refleksimu
              </label>
              <textarea
                id="refleksi-draft"
                value={draft}
                onChange={handleDraftChange}
                rows={3}
                placeholder="Ketik apa saja dengan jujur... (Opsional, kamu boleh rehat kapan saja)"
                className="w-full resize-none bg-transparent text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none"
              />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3 text-[11px] text-ink-500">
                  <button
                    type="button"
                    aria-label="Rekam suara"
                    className="rounded-md p-1 transition-colors hover:bg-cream-300"
                  >
                    <Mic size={14} aria-hidden="true" />
                  </button>
                  <span className="inline-flex items-center gap-1">
                    <ThumbsUp size={12} aria-hidden="true" />
                    Jeda 1 Menit
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setDraft("");
                    }}
                  >
                    Simpan Saja
                  </Button>
                  <Button
                    size="sm"
                    iconRight={Send}
                    disabled={draft.trim().length === 0}
                    onClick={() => {
                      sendMessage(draft);
                    }}
                  >
                    {mode === "companion" ? "Kirim" : "Simpan"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Panel samping */}
        <div className="flex flex-col gap-4">
          <Card as="aside" className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <p className="flex items-center gap-2 font-serif text-lg font-medium text-ink-900">
                <NotebookPen
                  size={16}
                  className="text-pelan-700"
                  aria-hidden="true"
                />
                Jurnal Cepat
              </p>
              <span className="text-[11px] text-ink-500">Kamis Sore</span>
            </div>
            <p className="text-xs leading-relaxed text-ink-500">
              Jika mengetik terasa terlalu berat, pilih satu keadaan yang paling
              mewakili energimu sore ini
            </p>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_JOURNAL_TILES.map((tile) => {
                const Icon = tile.icon;

                return (
                  <button
                    key={tile.id}
                    type="button"
                    onClick={() => {
                      sendMessage(`${tile.label}: ${tile.hint}`);
                    }}
                    className="flex flex-col items-start gap-1 rounded-xl bg-cream-200/70 p-3 text-left transition-colors hover:bg-cream-200"
                  >
                    <Icon
                      size={14}
                      className="text-clay-500"
                      aria-hidden="true"
                    />
                    <span className="text-xs font-semibold text-ink-900">
                      {tile.label}
                    </span>
                    <span className="text-[10px] text-ink-500">
                      {tile.hint}
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card as="aside" className="overflow-hidden p-0 lg:p-0">
            <Artwork
              variant="journal"
              icon={Compass}
              className="min-h-32 rounded-none"
            >
              <span className="absolute bottom-2 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-ink-900">
                {SLOW_ESSAY.tag}
              </span>
            </Artwork>
            <div className="flex flex-col gap-2 p-5">
              <h3 className="font-serif text-lg font-medium text-ink-900">
                {SLOW_ESSAY.title}
              </h3>
              <p className="text-xs leading-relaxed text-ink-500">
                {SLOW_ESSAY.excerpt}
              </p>
              <Link
                to="/eksplorasi"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-900 hover:text-pelan-700"
              >
                {SLOW_ESSAY.linkLabel}
                <ArrowRight size={12} aria-hidden="true" />
              </Link>
            </div>
          </Card>

          <Card tone="muted" as="aside" className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-ink-700">
              <Lock size={15} aria-hidden="true" />
            </span>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-ink-900">
                Privat & Terenkripsi
              </p>
              <p className="text-xs leading-relaxed text-ink-500">
                Percakapan dan catatanmu hanya tersimpan di perangkatmu sendiri.
                Tidak digunakan untuk melatih model publik.
              </p>
            </div>
          </Card>

          <Card tone="blush" as="aside" className="flex flex-col gap-3">
            <p className="flex items-center gap-2 text-sm font-semibold text-clay-600">
              <Hand size={15} aria-hidden="true" />
              Dukungan Nyata
            </p>
            <p className="text-xs leading-relaxed text-ink-700">
              Jika beban terasa terlalu berat untuk ditanggung sendiri, kamu
              selalu bisa mengakses konseling profesional.
            </p>
            <LinkButton
              to="/bantuan"
              variant="outline"
              size="sm"
              icon={Phone}
              className="self-start"
            >
              Lihat Kontak Bantuan
            </LinkButton>
          </Card>
        </div>
      </div>
    </div>
  );
}

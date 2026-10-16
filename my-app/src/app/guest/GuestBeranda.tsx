import {
  ArrowRight,
  ArrowUpRight,
  Brain,
  Clock3,
  Compass,
  Frown,
  Hand,
  Heart,
  Leaf,
  School,
  Smartphone,
  Sprout,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/lib/useAuth";

type Category = "all" | "kuliah" | "karier" | "hubungan" | "kelelahan";

interface Topic {
  id: number;
  title: string;
  description: string;
  category: Exclude<Category, "all">;
  categoryLabel: string;
  readingTime: number;
  icon: string;
  accent: "primary" | "secondary" | "tertiary";
}

const categories: { id: Category; label: string }[] = [
  { id: "all", label: "Semua Topik" },
  { id: "kuliah", label: "Kuliah & Tugas" },
  { id: "karier", label: "Karier & Arah Hidup" },
  { id: "hubungan", label: "Hubungan & Batasan" },
  { id: "kelelahan", label: "Kelelahan Mental" },
];

const topics: Topic[] = [
  {
    id: 1,
    title: "Overthinking",
    description:
      "Ketika pikiran terus berjalan meskipun kamu ingin berhenti istirahat.",
    category: "kelelahan",
    categoryLabel: "Kelelahan Mental",
    readingTime: 3,
    icon: "mindfulness",
    accent: "primary",
  },
  {
    id: 2,
    title: "Academic & Work Pressure",
    description:
      "Ketika tugas, nilai, dan ekspektasi mulai terasa menumpuk di pundak.",
    category: "kuliah",
    categoryLabel: "Kuliah & Tugas",
    readingTime: 4,
    icon: "school",
    accent: "secondary",
  },
  {
    id: 3,
    title: "Digital Fatigue & FOMO",
    description:
      "Kenapa makin lama main HP malah makin capek dan hampa?",
    category: "kelelahan",
    categoryLabel: "Kelelahan Mental",
    readingTime: 3,
    icon: "phonelink_erase",
    accent: "tertiary",
  },
  {
    id: 4,
    title: "Boundaries & People Pleasing",
    description:
      'Seni bilang "nggak dulu ya" tanpa dihantui rasa bersalah.',
    category: "hubungan",
    categoryLabel: "Hubungan & Batasan",
    readingTime: 4,
    icon: "front_hand",
    accent: "primary",
  },
  {
    id: 5,
    title: "Future Uncertainty",
    description:
      "Teman-teman udah pada jauh, kok aku rasanya masih di sini-sini aja?",
    category: "karier",
    categoryLabel: "Karier & Arah Hidup",
    readingTime: 5,
    icon: "explore",
    accent: "secondary",
  },
  {
    id: 6,
    title: "Imposter & Self-Worth",
    description:
      "Takut ketahuan kalau sebenernya aku nggak sehebat ekspektasi mereka.",
    category: "karier",
    categoryLabel: "Karier & Arah Hidup",
    readingTime: 3,
    icon: "mood_bad",
    accent: "tertiary",
  },
];

const accentClasses = {
  primary: {
    icon: "text-primary",
    label: "text-primary",
  },
  secondary: {
    icon: "text-secondary",
    label: "text-secondary",
  },
  tertiary: {
    icon: "text-tertiary",
    label: "text-tertiary",
  },
};

function MaterialIcon({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  const icons = {
    arrow_forward: ArrowRight,
    arrow_outward: ArrowUpRight,
    eco: Leaf,
    explore: Compass,
    favorite: Heart,
    front_hand: Hand,
    mindfulness: Brain,
    mood_bad: Frown,
    phonelink_erase: Smartphone,
    psychology: Brain,
    schedule: Clock3,
    school: School,
    spa: Sprout,
  } as const;
  const Icon = icons[children as keyof typeof icons] ?? Leaf;

  return <Icon aria-hidden="true" className={className} />;
}

function App() {
  const [selectedCategory, setSelectedCategory] =
    useState<Category>("all");
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

  useEffect(() => {
    setIsAuthenticated(false);
  }, [setIsAuthenticated]);

  const filteredTopics =
    selectedCategory === "all"
      ? topics
      : topics.filter((topic) => topic.category === selectedCategory);

  const handleLogin = () => {
    setIsAuthenticated(true);
    void navigate("/");
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
          {/* Guest Brand Bar */}
          <header className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-gutter-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-container p-1.5 shadow-sm">
                <img
                  src="https://lh3.googleusercontent.com/aida/AEtjO1XFFt7e3VfrW3s6wD9RGlCpMRi3EQN6tiJl2JkxH_CKl_Iim3zrK2YI0MnWF2ZRJYYnh-Y3EiBcsjFFJIIjd6_nKUBfpPpjevBvR8x1sX_DP_WQwb7i-1FIjWYBiFSaNRtNgi0g5DYosphNIgUgP4JwLYo77vGNdG6QfOLozVeognaBhKkrJUcv79RZMJILUCKxXe3-WdScPXJhgYJQW19EAIu2D2bmCLmmC0oyC26NWwjSipjPV1enoriS"
                  alt="Kawan Santai Logo"
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="flex min-w-0 flex-col">
                <span className="truncate font-label-lg text-label-lg text-on-surface">
                  Kawan Santai
                </span>
                <span className="font-label-sm text-label-sm text-primary">
                  Ruang Teduh Pikiran
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogin}
              className="flex shrink-0 items-center gap-1 rounded-full bg-pelan-600 px-space-md py-space-xs font-label-md text-label-md text-white shadow-sm transition-colors hover:bg-pelan-700 active:scale-95"
            >
              <span>Masuk</span>
              <MaterialIcon className="text-[16px]">
                arrow_forward
              </MaterialIcon>
            </button>
          </header>

          {/* Hero */}
          <section className="relative space-y-4 overflow-hidden rounded-2xl bg-pelan-50 p-5 shadow-sm ring-1 ring-pelan-100 sm:p-6 lg:p-8">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-fixed px-3 py-1 font-label-sm text-label-sm text-on-primary-fixed">
              <MaterialIcon className="text-[14px]">eco</MaterialIcon>
              <span>Bebas & Terbuka untuk Siapa Saja 🍃</span>
            </div>

            <div className="space-y-space-xs">
              <h2 className="max-w-2xl font-headline-xl-mobile text-headline-xl-mobile tracking-tight text-ink-900 sm:text-4xl">
                Pahami apa yang sedang kamu rasakan.
              </h2>

              <p className="font-body-md text-body-md leading-relaxed text-on-surface-variant">
                Jelajahi berbagai topik yang sering dialami mahasiswa dan
                anak muda tanpa perlu login.
              </p>
            </div>

            <div className="flex items-center gap-space-sm pt-space-xs font-label-sm text-label-sm text-on-surface-variant">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              <span>
                Ruang baca terbuka • Tanpa riwayat tersimpan
              </span>
            </div>
          </section>

          {/* Category Filter */}
          <nav
            aria-label="Kategori Topik"
            className="no-scrollbar -mx-4 flex items-center gap-2 overflow-x-auto px-4 py-1 lg:mx-0 lg:px-0"
          >
            {categories.map((category) => {
              const isActive = selectedCategory === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`whitespace-nowrap rounded-full px-space-md py-1.5 font-label-md text-label-md shadow-sm transition-all ${
                    isActive
                      ? "bg-pelan-600 text-white"
                      : "bg-cream-200 text-ink-500 hover:bg-cream-300"
                  }`}
                >
                  {category.label}
                </button>
              );
            })}
          </nav>

          {/* Featured Topic */}
          <article
            className="cursor-pointer space-y-4 rounded-2xl bg-white p-5 shadow-[0_1px_2px_rgba(43,42,38,0.04)] ring-1 ring-cream-300/70 transition-all hover:shadow-md active:scale-[0.99] sm:p-6 lg:p-8"
            onClick={() => void navigate('/topic/guest')}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                void navigate('/topic/guest')
              }
            }}
            role="link"
            tabIndex={0}
          >
            <div className="flex items-center justify-between">
              <span className="rounded-md bg-secondary-fixed px-2.5 py-1 font-label-sm text-label-sm text-on-secondary-fixed">
                Paling Sering Dialami
              </span>

              <div className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
                <MaterialIcon className="text-[16px]">
                  schedule
                </MaterialIcon>
                <span>4 menit baca</span>
              </div>
            </div>

            <div className="relative flex h-36 w-full items-center justify-center overflow-hidden rounded-lg bg-surface-container">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUfsdekKF1aTmc2KcYl9uPLFyhJ2P1JuuW66YLIXcLL7D1bdhLbgxqv1ufi9hbnAvhr9E03WwHe9qF2lLhb-i_EYgGr5YSUSesZb8dFEIO5OIv08i2A97WClDlie74nQAxgWJeo9nqM7ACMVkUfWQJpj1j5oH9-1FGimqfnQyDfeiDl_IzSxBORVbvKoFpZTaenRTq_7lNzlEPwPaECMZJbfcQi9271Em3yK4he-vcJLfNTmY3xrJdAw"
                alt="Ilustrasi seseorang sedang beristirahat"
                className="h-full w-full object-cover"
              />

              <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-surface/90 px-2 py-0.5 font-label-sm text-label-sm text-on-surface backdrop-blur">
                <MaterialIcon className="text-[14px] text-tertiary">
                  spa
                </MaterialIcon>
                <span>Bacaan Pilihan</span>
              </div>
            </div>

            <div className="space-y-space-xs">
              <h3 className="font-headline-md text-headline-md leading-snug text-ink-900 sm:text-2xl">
                Burnout: Ketika capek bukan cuma soal kurang tidur.
              </h3>

              <p className="font-body-md text-body-md leading-relaxed text-on-surface-variant">
                Tubuh sudah rebahan tapi pikiran masih lari maraton. Kenali
                sinyal saat bateraimu beneran butuh diisi ulang dari akar.
              </p>
            </div>

            <div className="flex items-center justify-between pt-space-xs">
              <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
                <MaterialIcon className="text-[18px] text-primary">
                  psychology
                </MaterialIcon>
                <span>Kelelahan Mental</span>
              </div>

              <span className="inline-flex items-center gap-1 font-label-md text-label-md text-primary transition-colors hover:text-primary-container">
                <span>Baca ulasan santai</span>
                <MaterialIcon className="text-[18px]">
                  arrow_forward
                </MaterialIcon>
              </span>
            </div>
          </article>

          {/* Topic Header */}
          <div className="flex items-center justify-between pt-space-xs">
            <div className="space-y-0.5">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Topik Buatmu Hari Ini
              </h3>

              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Ditulis ramah, tanpa diagnosis kaku.
              </p>
            </div>

            <span className="rounded-full bg-primary-fixed px-2.5 py-1 font-label-sm text-label-sm text-primary">
              {filteredTopics.length} Topik
            </span>
          </div>

          {/* Topics */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredTopics.map((topic) => {
              const accent = accentClasses[topic.accent];

              return (
                <article
                  key={topic.id}
                  className="flex cursor-pointer flex-col space-y-3 rounded-2xl bg-white p-4 shadow-[0_1px_2px_rgba(43,42,38,0.04)] ring-1 ring-cream-300/70 transition-shadow hover:shadow-md sm:p-5"
                  onClick={() => void navigate('/topic/guest')}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      void navigate('/topic/guest')
                    }
                  }}
                  role="link"
                  tabIndex={0}
                >
                  <div className="flex items-start gap-space-md">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-container ${accent.icon}`}
                    >
                      <MaterialIcon className="text-[28px]">
                        {topic.icon}
                      </MaterialIcon>
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-space-xs">
                        <span
                          className={`rounded bg-surface-container px-2 py-0.5 font-label-sm text-label-sm ${accent.label}`}
                        >
                          {topic.categoryLabel}
                        </span>

                        <span className="flex shrink-0 items-center gap-0.5 font-label-sm text-label-sm text-on-surface-variant">
                          <MaterialIcon className="text-[14px]">
                            schedule
                          </MaterialIcon>
                          {topic.readingTime} mnt
                        </span>
                      </div>

                      <h4 className="font-headline-sm text-headline-sm text-on-surface">
                        {topic.title}
                      </h4>

                      <p className="font-body-md text-body-md leading-relaxed text-on-surface-variant">
                        {topic.description}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Reassurance */}
          <section className="space-y-3 rounded-2xl bg-pelan-100 p-5 text-center shadow-sm ring-1 ring-pelan-200/60 sm:p-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-fixed text-on-primary-fixed">
              <MaterialIcon className="text-[26px]">
                favorite
              </MaterialIcon>
            </div>

            <div className="mx-auto max-w-xs space-y-space-xs">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Ruang Aman Tanpa Tuntutan
              </h3>

              <p className="font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
                Baca dengan santai sesuai ritmemu. Gak ada tes wajib, gak ada
                tuntutan buat langsung sembuh.
              </p>
            </div>
          </section>

          {/* Footer */}
          <footer className="flex flex-col items-center justify-center gap-2 pb-space-sm pt-space-xs">
            <div className="flex items-center gap-1.5 font-body-md text-body-md text-on-surface-variant">
              <span>Punya akun lama?</span>

              <button
                type="button"
                onClick={handleLogin}
                className="inline-flex items-center gap-0.5 font-label-lg text-label-lg text-primary hover:underline"
              >
                <span>Masuk di sini</span>
                <MaterialIcon className="text-[16px]">
                  arrow_outward
                </MaterialIcon>
              </button>
            </div>

            <p className="font-label-sm text-label-sm text-outline">
              Kawan Santai © 2025 • Teman bertumbuh pelan-pelan
            </p>
          </footer>
    </div>
  );
}

export default App;
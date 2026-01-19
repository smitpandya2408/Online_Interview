import Link from "next/link";

import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Reveal } from "@/components/site/reveal";
import { buttonClasses } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-white to-slate-50 dark:from-zinc-950 dark:to-zinc-900">
      <SiteHeader className="sticky top-0 z-10 border-b border-transparent backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-zinc-950/40" />

      <main className="w-full px-4 pb-16 pt-10 sm:px-8 sm:pt-14 lg:px-10 2xl:px-16">
        <section className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="animate-fade-up inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:text-zinc-300 dark:ring-zinc-800">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-950 dark:bg-white" />
              Company-ready interview rooms
            </div>

            <h1 className="anim-delay-100 animate-fade-up mt-5 text-4xl font-semibold leading-[1.08] tracking-tight text-slate-950 dark:text-zinc-50 sm:text-5xl">
              Online interviews, built for real hiring workflows.
            </h1>
            <p className="anim-delay-200 animate-fade-up mt-4 max-w-xl text-base leading-7 text-slate-600 dark:text-zinc-400 sm:text-lg">
              Create secure interview rooms with video, collaborative coding, and structured notes.
              Designed for speed, consistency, and a professional candidate experience.
            </p>

            <div className="anim-delay-300 animate-fade-up mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/create"
                className={buttonClasses({ size: "lg" })}
                aria-label="Create interview room"
              >
                Create Interview Room
              </Link>
              <Link
                href="/join"
                className={buttonClasses({ variant: "secondary", size: "lg" })}
                aria-label="Join interview room"
              >
                Join Interview Room
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="hover-lift rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800">
                <div className="text-sm font-semibold text-slate-900 dark:text-zinc-50">
                  Live video + audio
                </div>
                <div className="mt-1 text-sm leading-6 text-slate-600 dark:text-zinc-400">
                  Stable calls, low friction, and a clean candidate view.
                </div>
              </div>
              <div className="hover-lift rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800">
                <div className="text-sm font-semibold text-slate-900 dark:text-zinc-50">
                  Collaborative coding
                </div>
                <div className="mt-1 text-sm leading-6 text-slate-600 dark:text-zinc-400">
                  A shared editor for real-time problem solving.
                </div>
              </div>
              <div className="hover-lift rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800">
                <div className="text-sm font-semibold text-slate-900 dark:text-zinc-50">
                  Structured evaluation
                </div>
                <div className="mt-1 text-sm leading-6 text-slate-600 dark:text-zinc-400">
                  Notes and scoring built around consistent rubrics.
                </div>
              </div>
              <div className="hover-lift rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800">
                <div className="text-sm font-semibold text-slate-900 dark:text-zinc-50">
                  Secure by default
                </div>
                <div className="mt-1 text-sm leading-6 text-slate-600 dark:text-zinc-400">
                  Room IDs, access control, and audit-friendly flows.
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-[28px] bg-gradient-to-br from-slate-200 via-white to-slate-100 blur-2xl dark:from-zinc-800 dark:via-zinc-950 dark:to-zinc-900" />
            <div className="animate-fade-in rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-zinc-50">
                    Interview Room Preview
                  </div>
                  <div className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
                    Video + editor + notes in one place.
                  </div>
                </div>
                <div className="shimmer rounded-full bg-slate-900/10 px-3 py-1 text-xs font-semibold text-slate-800 dark:bg-white/10 dark:text-zinc-200">
                  Prototype
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <video
                  className="hover-lift aspect-video w-full rounded-2xl bg-slate-100 object-cover ring-1 ring-slate-200 dark:bg-zinc-900 dark:ring-zinc-800"
                  controls
                  muted
                  playsInline
                  preload="metadata"
                  poster="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=60"
                >
                  <source src="https://cdn.coverr.co/videos/coverr-working-on-a-laptop-7860/1080p.mp4" type="video/mp4" />
                </video>
                <img
                  className="hover-lift aspect-video w-full rounded-2xl bg-slate-100 object-cover ring-1 ring-slate-200 dark:bg-zinc-900 dark:ring-zinc-800"
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=60"
                  alt="Team collaborating in an interview"
                  loading="lazy"
                />
              </div>

              <div className="mt-4 rounded-2xl bg-slate-100 p-4 ring-1 ring-slate-200 dark:bg-zinc-900 dark:ring-zinc-800">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                    Collaborative Editor
                  </div>
                  <div className="text-xs text-slate-500 dark:text-zinc-500">Monaco (next step)</div>
                </div>
                <div className="mt-3 h-24 rounded-xl bg-white/80 dark:bg-zinc-950/60" />
              </div>
            </div>
          </div>
        </section>
        <Reveal>
          <section className="mt-12 grid gap-4 lg:grid-cols-3">
            <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800 sm:p-7">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500">Product tour</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50">
                Designed for interviewer speed.
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-zinc-400">
                A focused room layout with controls that feel familiar—so interviewers can focus on evaluation instead of tooling.
              </p>
              <div className="mt-6 grid gap-3">
                {[
                  { t: "Fast room creation", d: "Create instantly or schedule ahead." },
                  { t: "Clear in-call controls", d: "Mic/camera/screen share in one bar." },
                  { t: "Structured outcomes", d: "Notes + rating + report for decisions." },
                ].map((x) => (
                  <div
                    key={x.t}
                    className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-zinc-900/40 dark:ring-zinc-800"
                  >
                    <div className="text-sm font-semibold text-slate-900 dark:text-zinc-50">{x.t}</div>
                    <div className="mt-1 text-sm text-slate-600 dark:text-zinc-400">{x.d}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Link href="/features" className={buttonClasses({ size: "lg" })}>
                  See all features
                </Link>
              </div>
            </div>

            <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800 sm:p-7">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500">Use cases</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50">Works across roles.</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-zinc-400">
                Built to support recruiting ops, hiring managers, and interview panels.
              </p>
              <div className="mt-6 grid gap-3">
                {[
                  { t: "Engineering interviews", d: "Coding + notes + structured scoring." },
                  { t: "System design", d: "Screen share + architecture discussion." },
                  { t: "Panel interviews", d: "Consistent experience across multiple interviewers." },
                  { t: "Hiring operations", d: "Dashboard tracking and report exports." },
                ].map((x) => (
                  <div
                    key={x.t}
                    className="flex gap-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-zinc-900/40 dark:ring-zinc-800"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-950 dark:bg-white" />
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-zinc-50">{x.t}</div>
                      <div className="mt-1 text-sm text-slate-600 dark:text-zinc-400">{x.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800 sm:p-7">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500">Security</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50">Built with secure defaults.</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-zinc-400">
                Access control, room isolation, and an audit-friendly model—ready for enterprise hardening.
              </p>
              <div className="mt-6 grid gap-3">
                {[
                  "Role-based dashboard access",
                  "Room-scoped events & collaboration",
                  "Structured notes + ratings",
                  "Enterprise extensions (SSO/audit logs)",
                ].map((t) => (
                  <div
                    key={t}
                    className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 ring-1 ring-slate-200 dark:bg-zinc-900/40 dark:text-zinc-300 dark:ring-zinc-800"
                  >
                    {t}
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Link href="/security" className={buttonClasses({ variant: "secondary", size: "lg" })}>
                  Security details
                </Link>
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="mt-12 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800 sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500">Pricing</div>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50">
                  Clear plans for every hiring stage.
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-zinc-400">
                  Start free for basic rooms, then upgrade for scheduling controls, reporting, and team workflows.
                </p>
              </div>
              <Link href="/pricing" className={buttonClasses({ variant: "secondary" })}>
                Full pricing
              </Link>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {[
                {
                  name: "Starter",
                  price: "Free",
                  desc: "For trying a focused interview room.",
                  points: ["Unlimited rooms", "Video + coding", "Notes + rating"],
                },
                {
                  name: "Team",
                  price: "$29 / interviewer",
                  desc: "For structured hiring across a team.",
                  points: ["Scheduling controls", "Exports", "Advanced dashboard"],
                  highlight: true,
                },
                {
                  name: "Enterprise",
                  price: "Custom",
                  desc: "For compliance and governance needs.",
                  points: ["SSO (coming)", "Audit logs (coming)", "Dedicated support"],
                },
              ].map((tier) => (
                <div
                  key={tier.name}
                  className={
                    tier.highlight
                      ? "relative rounded-[28px] bg-slate-950 p-6 text-white shadow-sm"
                      : "rounded-[28px] bg-slate-50 p-6 ring-1 ring-slate-200 dark:bg-zinc-900/40 dark:ring-zinc-800"
                  }
                >
                  {tier.highlight ? (
                    <div className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white ring-1 ring-white/15">
                      Popular
                    </div>
                  ) : null}
                  <div className={tier.highlight ? "text-white/80" : "text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500"}>
                    {tier.name}
                  </div>
                  <div className={tier.highlight ? "mt-3 text-3xl font-semibold tracking-tight" : "mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50"}>
                    {tier.price}
                  </div>
                  <div className={tier.highlight ? "mt-2 text-sm text-white/70" : "mt-2 text-sm text-slate-600 dark:text-zinc-400"}>
                    {tier.desc}
                  </div>
                  <div className="mt-5 grid gap-2">
                    {tier.points.map((p) => (
                      <div key={p} className={tier.highlight ? "flex gap-2 text-sm text-white/80" : "flex gap-2 text-sm text-slate-700 dark:text-zinc-300"}>
                        <span className={tier.highlight ? "mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white" : "mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-950 dark:bg-white"} />
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <Link
                      href={tier.name === "Enterprise" ? "/contact" : "/create"}
                      className={
                        tier.highlight
                          ? "inline-flex h-11 items-center justify-center rounded-2xl bg-white px-4 text-sm font-semibold text-slate-950"
                          : buttonClasses({ size: "md" })
                      }
                    >
                      {tier.name === "Enterprise" ? "Contact" : "Get started"}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="mt-12 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800 sm:p-8">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500">Comparison</div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50">
              Why teams move beyond generic video calls.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-zinc-400">
              InterviewOS is purpose-built for hiring: less friction, more structure, and better evidence for decisions.
            </p>

            <div className="mt-6 overflow-hidden rounded-2xl ring-1 ring-slate-200 dark:ring-zinc-800">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-zinc-900/40 dark:text-zinc-500">
                  <tr>
                    <th className="px-4 py-3">Capabilities</th>
                    <th className="px-4 py-3">Generic video call</th>
                    <th className="px-4 py-3">InterviewOS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
                  {[
                    ["Dedicated interview room", "Partial", "Yes"],
                    ["Coding + notes in one place", "No", "Yes"],
                    ["Consistent scoring workflow", "Manual", "Built-in"],
                    ["Room scheduling controls", "Limited", "Yes"],
                    ["Dashboard visibility", "No", "Yes"],
                  ].map(([cap, generic, ios]) => (
                    <tr key={cap}>
                      <td className="px-4 py-4 font-semibold text-slate-900 dark:text-zinc-50">{cap}</td>
                      <td className="px-4 py-4 text-slate-700 dark:text-zinc-300">{generic}</td>
                      <td className="px-4 py-4 text-slate-700 dark:text-zinc-300">{ios}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-12 grid gap-4 lg:grid-cols-3">
            <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800 sm:p-7">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500">Integrations</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50">Fits your stack.</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-zinc-400">
                Designed to work with the tools teams already use.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {["Google Calendar", "Slack", "ATS", "SSO", "PDF Export", "Webhooks"].map((i) => (
                  <div key={i} className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 dark:bg-zinc-900/40 dark:text-zinc-300 dark:ring-zinc-800">
                    {i}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800 sm:p-7">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500">Case study</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50">
                Faster hiring decisions.
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-zinc-400">
                A structured workflow reduces back-and-forth and improves interviewer calibration.
              </p>
              <div className="mt-6 grid gap-3">
                {[
                  { k: "-30%", v: "time spent coordinating tools" },
                  { k: "+2x", v: "consistency in scoring" },
                  { k: "1", v: "standard room layout across teams" },
                ].map((m) => (
                  <div key={m.k} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-zinc-900/40 dark:ring-zinc-800">
                    <div className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50">{m.k}</div>
                    <div className="mt-1 text-sm text-slate-600 dark:text-zinc-400">{m.v}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800 sm:p-7">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500">Governance</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50">Built for scale.</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-zinc-400">
                Keep hiring predictable with dashboards, reports, and secure access patterns.
              </p>
              <div className="mt-6 grid gap-3">
                {[
                  { t: "Status tracking", d: "Scheduled → Ongoing → Completed." },
                  { t: "Reporting", d: "Export interview outcomes for review." },
                  { t: "Security", d: "Admin-only views with session protection." },
                ].map((x) => (
                  <div key={x.t} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-zinc-900/40 dark:ring-zinc-800">
                    <div className="text-sm font-semibold text-slate-900 dark:text-zinc-50">{x.t}</div>
                    <div className="mt-1 text-sm text-slate-600 dark:text-zinc-400">{x.d}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-12 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800 sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500">FAQ</div>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50">Common questions</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-zinc-400">
                  Everything teams ask when moving from generic tools to a purpose-built interview platform.
                </p>
              </div>
              <Link href="/contact" className={buttonClasses({ variant: "secondary" })}>
                Contact
              </Link>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {[
                {
                  q: "Do candidates need accounts?",
                  a: "No. Candidates can join via a room link. Admin and interviewer access stays protected via server-side session checks.",
                },
                {
                  q: "Can we schedule rooms for future time windows?",
                  a: "Yes. Schedule rooms ahead of time to prevent early joins and keep the workflow predictable.",
                },
                {
                  q: "How do we share outcomes with hiring managers?",
                  a: "Use structured notes and ratings, then export reports for review and decision-making.",
                },
                {
                  q: "Does this support enterprise security?",
                  a: "The foundation supports secure defaults and can be extended with SSO, audit logs, retention policies, and admin governance.",
                },
                {
                  q: "What makes this better than a video call + docs?",
                  a: "A single room unifies tools and enforces a consistent evaluation workflow—reducing bias and increasing signal.",
                },
                {
                  q: "Can we customize rubrics?",
                  a: "Yes. Rubrics/templates are a natural extension. The UI is designed to add them without changing the room experience.",
                },
              ].map((item) => (
                <div key={item.q} className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200 dark:bg-zinc-900/40 dark:ring-zinc-800">
                  <div className="text-sm font-semibold text-slate-900 dark:text-zinc-50">{item.q}</div>
                  <div className="mt-2 text-sm leading-6 text-slate-600 dark:text-zinc-400">{item.a}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500">
                Setup time
              </div>
              <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50">
                &lt; 2 min
              </div>
              <div className="mt-1 text-sm text-slate-600 dark:text-zinc-400">Create a room and share a link.</div>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500">
                Built-in tools
              </div>
              <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50">
                3-in-1
              </div>
              <div className="mt-1 text-sm text-slate-600 dark:text-zinc-400">Video, editor, notes — unified.</div>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500">
                Scheduling
              </div>
              <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50">
                Future-ready
              </div>
              <div className="mt-1 text-sm text-slate-600 dark:text-zinc-400">Plan interviews and prevent early joins.</div>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500">
                Control
              </div>
              <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50">
                Admin view
              </div>
              <div className="mt-1 text-sm text-slate-600 dark:text-zinc-400">Manage rooms from a clean dashboard.</div>
            </div>
          </section>

          <section className="mt-12 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800 sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500">
                  Trusted by teams
                </div>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50">
                  Built for real hiring operations.
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-zinc-400">
                  A modern workflow that feels professional for candidates and consistent for interviewers.
                </p>
              </div>
              <Link href="/about" className={buttonClasses({ variant: "secondary" })}>
                Learn more
              </Link>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {["Acme", "Northwind", "Globex", "Initech", "Umbrella", "Stark", "Wayne", "Hooli"].map((name) => (
                <div
                  key={name}
                  className="grid h-14 place-items-center rounded-2xl bg-slate-50 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 dark:bg-zinc-900/40 dark:text-zinc-300 dark:ring-zinc-800"
                >
                  {name}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800 sm:p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500">
                  Workflow
                </div>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50">
                  A simple flow your team can standardize.
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-zinc-400">
                  From scheduling to evaluation — keep every interview consistent, auditable, and easy to run.
                </p>
              </div>
              <Link href="/dashboard" className={buttonClasses({ variant: "secondary" })}>
                Open Dashboard
              </Link>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200 dark:bg-zinc-900/40 dark:ring-zinc-800">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900/10 text-sm font-semibold text-slate-900 dark:bg-white/10 dark:text-zinc-200">
                  1
                </div>
                <div className="mt-3 text-base font-semibold text-slate-900 dark:text-zinc-50">Create or schedule</div>
                <div className="mt-1 text-sm leading-6 text-slate-600 dark:text-zinc-400">
                  Generate a room instantly or schedule it for later.
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200 dark:bg-zinc-900/40 dark:ring-zinc-800">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900/10 text-sm font-semibold text-slate-900 dark:bg-white/10 dark:text-zinc-200">
                  2
                </div>
                <div className="mt-3 text-base font-semibold text-slate-900 dark:text-zinc-50">Run the interview</div>
                <div className="mt-1 text-sm leading-6 text-slate-600 dark:text-zinc-400">
                  Video call, screen share, collaborate in the editor.
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200 dark:bg-zinc-900/40 dark:ring-zinc-800">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900/10 text-sm font-semibold text-slate-900 dark:bg-white/10 dark:text-zinc-200">
                  3
                </div>
                <div className="mt-3 text-base font-semibold text-slate-900 dark:text-zinc-50">Review & export</div>
                <div className="mt-1 text-sm leading-6 text-slate-600 dark:text-zinc-400">
                  Save notes, rating, and export reports for hiring decisions.
                </div>
              </div>
            </div>
          </section>

          <section className="mt-12">
            <div className="flex items-end justify-between gap-6">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500">
                  Testimonials
                </div>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50">
                  Designed for professional interviews.
                </h2>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800">
                <div className="text-sm leading-7 text-slate-700 dark:text-zinc-300">
                  “Everything we need is in one place — video, code, and notes. It keeps interviews consistent.”
                </div>
                <div className="mt-4 text-xs font-semibold text-slate-500 dark:text-zinc-500">Engineering Manager</div>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800">
                <div className="text-sm leading-7 text-slate-700 dark:text-zinc-300">
                  “Scheduling is clean and candidates can’t join too early. The experience feels polished.”
                </div>
                <div className="mt-4 text-xs font-semibold text-slate-500 dark:text-zinc-500">Recruiter</div>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800">
                <div className="text-sm leading-7 text-slate-700 dark:text-zinc-300">
                  “Google Meet-like screen sharing with a focused presenter view is exactly what we needed.”
                </div>
                <div className="mt-4 text-xs font-semibold text-slate-500 dark:text-zinc-500">Senior Interviewer</div>
              </div>
            </div>
          </section>

          <section className="mt-12 overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-white shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Ready to run your next interview?</h2>
                <p className="mt-2 max-w-2xl text-sm text-white/70">
                  Create a room in seconds, or schedule it for later — and manage everything from the dashboard.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/create" className="inline-flex h-12 items-center justify-center rounded-2xl bg-white px-5 text-sm font-semibold text-slate-950 shadow-sm">
                  Create Room
                </Link>
                <Link href="/join" className="inline-flex h-12 items-center justify-center rounded-2xl bg-white/10 px-5 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/15">
                  Join Room
                </Link>
              </div>
            </div>
          </section>
        </Reveal>
      </main>

      <SiteFooter className="mt-14" />
    </div>
  );
}

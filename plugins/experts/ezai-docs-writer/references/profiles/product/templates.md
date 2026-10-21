# Product profile — Navigation & page templates

Load this file when generating or auditing a page under the product profile.

## Navigation structure

```txt
docs/
├── index.md                 ← product overview, Get started link, popular tasks, where to get help
├── get-started.md           ← Get started
├── tasks/                   ← Tasks, one folder per feature area, in the order users meet them
│   ├── index.md
│   └── members/
│       └── invite-a-member.md
├── concepts/                ← Concepts the user needs to act
│   └── workspaces.md
├── reference/               ← settings.md, shortcuts.md, limits.md, glossary.md
├── troubleshooting.md       ← split into troubleshooting/<area>.md once it grows
├── faq.md
├── release-notes.md
└── admin/                   ← Admin zone — self-hosted or administrable products only
    ├── install.md
    ├── configure.md
    ├── administer/
    ├── upgrade.md
    └── monitor.md
```

Nav label aliases — pick one set, be consistent:

| Page type       | Primary         | Acceptable aliases       |
| :-------------- | :-------------- | :----------------------- |
| Get started     | Get started     | Quickstart, First steps  |
| Task            | Guides          | How-to, Using <product>  |
| Concept         | Concepts        | Understanding <product>  |
| Reference       | Reference       | Settings, Glossary       |
| Troubleshooting | Troubleshooting | Problems, Help           |
| FAQ             | FAQ             | Questions                |
| Release notes   | Release notes   | What's new               |
| Admin zone      | Administration  | Self-hosting, Operations |

---

## Page templates

### Get started

```markdown
# Get started with [Product]

One sentence: what the reader will have achieved at the end.

## 🔧 Prerequisites

- Account, plan or permission needed
- Supported platform or browser

## 📝 Steps

1. Sign up or install — link to the download or sign-up page.
2. [First action in UI wording, **Button** › **Menu**].
3. [Action that produces the first visible result].

## ✅ Result

What the reader now sees, in one or two sentences.

## ➡️ Next steps

- [Most common next task](tasks/...)
- [Second most common task](tasks/...)
```

### Task

```markdown
# [Verb] [object] — e.g. "Invite a member"

One sentence: when and why a user does this.

## 🔧 Prerequisites

- Role or permission required
- Anything that must exist first

## 📝 Steps

1. Go to **Settings** › **Members**.
2. Select **Invite**.
3. Enter the email address, then select **Send invitation**.

## ✅ Result

The visible outcome — e.g. "The member appears in the list with the status **Pending**."

If something goes wrong, see [Troubleshooting › Invitation not received](../troubleshooting.md#invitation-not-received).
```

### Concept

```markdown
# [Notion] — e.g. "Workspaces"

Two or three short paragraphs: what it is, what it contains, how it relates to the notions the user already knows.
No steps — link to the Tasks that use it.

## ➡️ Next steps

- [Task using this concept](../tasks/...)
```

### Reference

```markdown
# [Topic] — e.g. "Settings"

| Setting  | Values            | Default | Effect                          |
| :------- | :---------------- | :------ | :------------------------------ |
| Language | English, Français | English | Interface language for the user |
```

Settings, shortcuts, limits and glossary are tables or definition lists — no narrative.

### Troubleshooting

```markdown
# Troubleshooting

## Invitation not received

**Symptom** — The invited person does not receive the email after 10 minutes.

**Cause** — The email went to spam, or the address has a typo.

**Fix**

1. Ask the person to check their spam folder.
2. In **Settings** › **Members**, check the address, then select **Resend**.
```

One H2 per problem, titled with the symptom as the user would describe it.

### FAQ

```markdown
# FAQ

## Can I change my plan at any time?

Yes. The change applies immediately and the price is prorated.
```

One H2 per question, answer in one short paragraph. A longer answer becomes a Task page linked from here.

### Release notes

```markdown
# Release notes

## 2.4.0 — 2026-10-21

### New

- Invite several members at once from **Settings** › **Members**.

### Improved

- Search results appear as you type.

### Fixed

- Exports no longer drop accented characters.
```

User-visible changes only, newest version first. Breaking changes or required actions open the version section in a `warning` admonition.

### Admin task

Same template as Task, for administrators. Prerequisites name the access needed (server shell, admin role), and commands appear in code blocks because the reader types them.

### Homepage (`docs/index.md`)

```markdown
# Product name

**Product name** — one sentence on what it lets users do.

## 🚀 Quick start

Link to Get started, with the one-line promise of what it achieves.

## 📚 Documentation

Navigation table — one row per section (Guides, Concepts, Reference, Troubleshooting, FAQ, Release notes, Administration if present).

## ⚖️ License

One-line reference to the license or terms of use.
```

---

## Naming conventions

| Pattern          | Example                                            |
| :--------------- | :------------------------------------------------- |
| Get started file | `get-started.md`                                   |
| Task files       | verb + object — `tasks/members/invite-a-member.md` |
| Concept files    | the notion — `concepts/workspaces.md`              |
| Reference files  | the topic — `reference/settings.md`                |
| All headings     | Sentence case only                                 |

# Information architecture and navigation

Load this file when the finding is "I cannot find it", when the structure is in
question, or when a menu, search or URL scheme is under review.

IA is four distinct systems. Conflating them is why "reorganise the nav" rarely
fixes anything:

| System           | Answers                                 | Failure                                                  |
| :--------------- | :-------------------------------------- | :------------------------------------------------------- |
| **Organisation** | How things are grouped                  | Groups that mirror the company's org chart, not the task |
| **Labelling**    | What each group is called               | Internal vocabulary; "Solutions", "Resources", "More"    |
| **Navigation**   | How the user moves between groups       | Everything in one flat menu, or three levels of hover    |
| **Search**       | How the user jumps straight to a target | No search; or search that only matches exact titles      |

## The trunk test

Drop a user on any page, with no history. The page must answer, without
scrolling:

1. What site is this?
2. What page am I on?
3. What are the major sections?
4. What are my options here?
5. Where am I in the scheme of things?

A page that fails two or more of these is a `majeur` finding, regardless of how
good the global navigation is — because most arrivals are not through the home
page.

## Labelling

- **The user's words, not the system's.** Labels come from how people describe
  the task, which is an empirical question — card sorting and tree testing
  answer it (see `research-methods.md`). A label argued from taste is a guess.
- **Avoid empty containers**: "Resources", "Solutions", "More", "Other",
  "Misc". They are places where findability goes to die.
- **One name per concept** across nav, page titles, breadcrumbs and body copy.
- Front-load the distinguishing word: users scan the first two words of a link
  (layer-cake scanning, see `perception.md`).

## Depth versus breadth

- Broad and shallow beats narrow and deep for findability, up to the point where
  a level stops being scannable. Three clicks is a myth; *certainty* at each
  click is what matters, not the count.
- Every level the user must traverse is a decision point and a chance to be
  wrong. A level that only ever contains one child should not exist.

## Navigation patterns

| Pattern           | Fits                                          | Cost to weigh                                                             |
| :---------------- | :-------------------------------------------- | :------------------------------------------------------------------------ |
| Top bar           | ≤ 7 top-level sections, marketing and content | Runs out of room; collapses badly                                         |
| Sidebar           | Applications, documentation, deep hierarchy   | Takes horizontal space; needs a mobile answer                             |
| Bottom tab bar    | Mobile apps, 3–5 destinations                 | Hard limit of about 5; a "More" tab is an admission of defeat             |
| Hamburger         | Secondary destinations                        | Measurable discoverability cost — never the only home for primary actions |
| Mega menu         | Large catalogues                              | Needs real grouping and keyboard support, or it is a wall                 |
| Breadcrumbs       | Deep hierarchies                              | Must reflect the hierarchy, not the user's path                           |
| Faceted filtering | Large result sets                             | Needs counts, clear-all, and a visible record of what is applied          |

## Search

- **Search is navigation for people who already know the target.** A product of
  any size without it has a findability finding.
- **Zero results is a designed state**, not an apology: suggest corrections,
  relax a facet, offer the nearest matches, and keep the query visible and
  editable.
- Match on synonyms and the user's vocabulary, not only on titles.
- Preserve recent and saved searches; scope search when the corpus is large.
- Show what is applied: a filtered view that looks like an empty one is the most
  common search failure, and it is an interface-state problem as much as a
  search one (see `interface-states.md`).

## URLs, routes and state

- **The URL is part of the IA.** It should be readable, stable, and describe the
  resource.
- **Filters, tabs and pagination belong in the URL.** A view the user cannot
  link to or return to is a Nielsen 3 failure: there is no way back.
- **The back button must do what the platform promises.** Breaking it in a
  single-page app is a `bloquant` on the web.
- Deep links must survive a reload and an unauthenticated arrival — redirect to
  login, then back to the target, not to the home page.
- Focus moves to the new view's heading on client-side navigation; otherwise
  screen-reader users are left where the old page was (see `a11y/aria.md`).

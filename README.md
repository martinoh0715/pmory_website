# PMory Website

Product Management hub for Emory students.

## Run locally

```bash
python3 -m http.server 4317
```

## Design

- **Palette:** Cool indigo (`#4f46e5`) + teal accent (`#0d9488`) on a soft slate background — replaces the old warm cream theme
- **Dark mode:** Night Shift toggle in the nav (persists in localStorage)
- **Typography:** Fraunces (headings) + DM Sans (body)

## Homepage interactives

- Typing hero + AI demo bubble
- Bento grid navigation (4 tiles)
- Prioritization board
- Sticky-note brainstorm wall
- Product roadmap timeline
- Ship or Kill voting

## Pages

All pages share the same design system: Home, What is PM, Skillsets, AI Assistant, Job Alert, About, Admin.

## Job Alert

The Job Alert page loads openings from the backend `GET /api/jobs` endpoint (Greenhouse / Lever sync). If the API is unreachable, it falls back to the committed snapshot in `jobs/openings.json`.


# PMory Website

Product Management hub for Emory students — a single-page React app served as static HTML.

## Run locally

```bash
python3 -m http.server 4317
```

Open http://localhost:4317

## Homepage features

The homepage includes interactive PM learning tools:

- Typing hero with cursor spotlight and magnetic CTA buttons
- Mini AI demo bubble with preset questions
- Animated stat counters
- Bento grid navigation
- Drag-and-drop prioritization board
- RICE score calculator
- Sticky-note brainstorm wall
- Scroll-triggered product roadmap timeline
- Ship or Kill feature voting
- PM frameworks carousel
- Dark mode (Night Shift theme)
- Confetti celebration on primary CTA

## Structure

- `index.html` — full app (React via CDN + inline Babel)
- `homepage-styles.css` — homepage v2 design system (also inlined in index.html)
- `homepage-components.jsx` — homepage React components (reference copy; components are inlined in index.html)
- `images/` — site images
- `videos/` — hero background video

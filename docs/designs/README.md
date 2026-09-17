# Contact section redesign

Generated with Stitch from the supplied Arabic RTL HTML reference.

- Project: https://stitch.withgoogle.com/projects/12563668405056962452
- Screen: `7feae047a4204abc825cd6a9e53082c4`
- Original Stitch export: `contact-stitch.html`
- Integrated component: `src/components/ui/Footer.tsx`
- Translations: `messages/ar.json`, `messages/en.json`

The integrated component uses profile data passed through props, supports both themes and locales, handles clipboard failures, announces copy feedback, and respects reduced motion. The standalone Stitch export contains the sample contact values and social links from the reference.

Validation: ESLint, TypeScript, and isolated browser review of the Arabic component at desktop and 390px mobile widths. Copy success confirmed; no horizontal overflow at 390px. The initial isolated review used a temporary component preview which was removed afterward. The main preview now opens correctly after locale initialization/fallback changes and restarting the stale development server. The production build and HTTP checks passed for `/ar`, `/en`, `/`, and `/login`; unknown routes correctly return 404. The contact section was also reviewed on the actual Arabic home page.

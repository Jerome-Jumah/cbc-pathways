# School Slugs, URLs, and Analytics

## Canonical school URLs

School detail pages use `/schools/[slug]`. School slugs are read from the persisted `schools.slug` column; the UI does not derive them from a school name or ID. Cards, saved school links, share URLs, metadata, structured data, and the sitemap use that canonical slug. A missing or malformed slug raises a data-integrity error. `/school/[id]` remains a permanent redirect to the canonical page.

The backend allocates slugs using these rules, in order:

1. normalized school name;
2. name plus county when the name is already used;
3. name plus county and cluster when that is also used;
4. the same full candidate with `-2`, `-3`, and later numeric suffixes if necessary.

Ingestion takes a PostgreSQL transaction advisory lock around allocation and insertion. This serializes slug allocation across ingestion and retry processes, including processes on separate hosts. The unique database index remains the final integrity constraint. Existing slugs are preserved on subsequent ingestion.

## Database deployment

The checked-in Prisma migrations create the application schema, including the enrichment tables, and add a nullable `slug` column with a unique index. The final Prisma model declares `slug` required. The standalone backfill completes the transition by filling missing slugs, validating all rows, verifying completeness and uniqueness, and applying `NOT NULL`.

Pause ingestion and other school writers before starting the migration. Keep them paused until the new backend version is running. The backfill takes an exclusive lock on `schools` for the duration of one transaction; API queries that touch this table will wait while it runs.

From the backend checkout, deploy in this order:

1. Back up the database and stop ingestion/retry processes and other school writers.
2. Apply migrations: `npx prisma migrate deploy --schema prisma/schema.prisma`.
3. Copy the standalone script to the VPS outside the checkout (for example, `/tmp/backfill-school-slugs.mjs`). From the backend checkout, run it with `DATABASE_URL` already supplied to the process environment:

   ```sh
   node /tmp/backfill-school-slugs.mjs
   ```

4. Confirm the command reports equal `total`, `populated`, and `unique` counts and exits successfully.
5. Deploy the backend release containing the advisory-lock ingestion path, then deploy the UI, and resume ingestion.

For a fresh database, apply migrations, run the same backfill against its empty `schools` table, then start the application. The script is intentionally outside this repository and is not imported by the application.

The reviewed persistent local copy of the standalone script is `/Users/quing/cbc-pathways-operations/backfill-school-slugs.mjs`; keep it out of Git and copy it to the VPS before use. The backfill has not been run against the configured application database. No production row count or deployment state is asserted here.

## URL configuration

The UI requires these variables:

- `NEXT_PUBLIC_SITE_URL`: canonical site origin only, such as `https://site.example`; no path, query, or fragment.
- `NEXT_PUBLIC_API_BASE_URL`: absolute API base URL used by browser requests, including its API path, such as `https://api.example/api`.
- `API_BASE_URL`: absolute API base URL used by server requests and the sitemap.

The three values are validated; URL paths and query strings are not silently guessed. Trailing slashes are normalized. `NEXT_PUBLIC_*` values are embedded when `next build` runs, so set them for the target environment at build time. `API_BASE_URL` is server-only and never included in browser bundles; configure it wherever Next.js executes server requests, including build time for prerendered pages and runtime for dynamic requests. See [`ui/.env.example`](../ui/.env.example) for placeholders, not deployment values.

## Umami configuration and events

Umami is disabled when both `NEXT_PUBLIC_UMAMI_WEBSITE_ID` and `NEXT_PUBLIC_UMAMI_SCRIPT_URL` are empty. To enable it, set both: the website ID from Umami and the full tracker JavaScript URL (for example, the `/script.js` URL shown in the Umami tracking code). A partial, malformed, or non-HTTP(S) configuration fails validation during the UI build. Configuration is embedded at build time.

The root layout loads one Umami script with Next.js `afterInteractive`. Umami records page views and SPA route changes automatically. Custom events are sent through `window.umami.track(name, properties)`, matching the [official tracker function](https://docs.umami.is/docs/tracker-functions) and [event data](https://docs.umami.is/docs/event-data) documentation. If an interaction happens before the script is ready, up to 25 events wait for at most 10 seconds. A load failure is reported and disables Umami for that page; a slow-load timeout reports and drops only the stale queue, leaving the tracker able to become ready later. Vercel Analytics is called independently, so a failure from one provider does not block the other or user navigation.

The typed custom event contract is:

| Event | Properties |
| --- | --- |
| `school_search_started` | `county?`, `cluster?`, `gender?`, `accommodation?`, `subjectCount`, `page` |
| `school_search_completed` | `resultCount`, `page` |
| `school_result_opened` | `schoolSlug`, `county`, `cluster?`, `gender?`, `accommodation?` |
| `school_saved` | `schoolSlug`, `saved` |
| `combination_saved` | `combinationId`, `saved` |
| `recommendation_started` | none |
| `recommendation_step_completed` | `step` |
| `recommendation_completed` | `pathwayCount`, `schoolCount` |

The types constrain event names and property shapes. They cannot prove arbitrary string values contain no personal information; event call sites should continue to send only the listed product context.

## Verification scope

Unit and component tests use fixtures. The backend concurrent-ingestion integration check runs only with `SCHOOL_SLUG_TEST_DATABASE_URL`, requires a database name containing `test`, and refuses the configured `DATABASE_URL`. From the backend checkout, run it with `node --test --import tsx tests/school-ingestion.integration.test.mts` after setting `SCHOOL_SLUG_TEST_DATABASE_URL` to a disposable test database.

The standalone backfill integration check is at `/private/tmp/cbc-pathways-review/test-backfill-school-slugs.mjs`; run it from the backend checkout with `node /private/tmp/cbc-pathways-review/test-backfill-school-slugs.mjs` after setting `SCHOOL_SLUG_TEST_DATABASE_URL` to a separate disposable test database. Both checks refuse the configured `DATABASE_URL`. No test or backfill command should use the existing application database.

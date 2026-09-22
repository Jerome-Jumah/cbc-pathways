import assert from "node:assert/strict";
import { describe, it } from "node:test";

const baseUrl = process.env.TEST_API_BASE_URL ?? process.env.API_BASE_URL ?? "http://localhost:8080";

async function request(path: string, init?: RequestInit) {
  const res = await fetch(`${baseUrl}${path}`, {
    signal: AbortSignal.timeout(15_000),
    ...init,
  });
  const body = await res.json().catch(() => null);
  return { res, body };
}

async function verifiedHeaders() {
  const init = await request("/api/session/init", { method: "POST" });
  const cookie = init.res.headers.get("set-cookie")?.split(";")[0] ?? "";
  const verified = await request("/api/security/verify-human", {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({ token: "dev-turnstile-token" }),
  });
  const verifiedCookie = verified.res.headers.get("set-cookie")?.split(";")[0] ?? cookie;
  return { Cookie: verifiedCookie, "Content-Type": "application/json" };
}

function assertSafeError(body: unknown) {
  const text = JSON.stringify(body);
  assert.match(text, /error/i);
  assert.doesNotMatch(text, /at .*:\d+:\d+/);
  assert.doesNotMatch(text, /stack/i);
}

describe("health", () => {
  it("returns JSON health status", async () => {
    const { res, body } = await request("/health");
    assert.equal(res.status, 200);
    assert.match(res.headers.get("content-type") ?? "", /application\/json/);
    assert.equal(body.status, "ok");
  });
});

describe("track profiles", () => {
  it("lists tracks with profiles", async () => {
    const { res, body } = await request("/api/track-profiles");
    assert.equal(res.status, 200);
    assert.equal(body.success, true);
    assert.ok(Array.isArray(body.data));
    assert.ok(body.data.length >= 7);
    assert.ok(body.data.every((track: any) => "profile" in track));
  });

  it("returns one track and clean validation/not-found errors", async () => {
    const list = await request("/api/track-profiles");
    const track = list.body.data[0];
    const found = await request(`/api/track-profiles/${track.id}`);
    assert.equal(found.res.status, 200);
    assert.equal(found.body.data.id, track.id);

    const invalid = await request("/api/track-profiles/not-a-uuid");
    assert.equal(invalid.res.status, 400);
    assertSafeError(invalid.body);

    const missing = await request("/api/track-profiles/00000000-0000-4000-8000-000000000000");
    assert.equal(missing.res.status, 404);
    assertSafeError(missing.body);
  });
});

describe("schools", () => {
  it("supports pagination and filters without returning the whole dataset", async () => {
    for (const query of ["?page=1&limit=20", "?county=NAIROBI&page=1&limit=20", "?cluster=C2&page=1&limit=20", "?gender=BOYS&page=1&limit=20", "?search=alliance&page=1&limit=20"]) {
      const { res, body } = await request(`/api/schools${query}`);
      assert.equal(res.status, 200);
      assert.equal(body.success, true);
      assert.ok(Array.isArray(body.data.data));
      assert.ok(body.data.data.length <= 20);
      assert.equal(body.data.meta.page, 1);
      assert.equal(body.data.meta.limit, 20);
      assert.equal(typeof body.data.meta.total, "number");
      assert.equal(body.pagination.page, 1);
    }
  });

  it("ranks schools by recommendation context", async () => {
    const combinations = await request("/api/combinations?page=1&limit=1");
    const combo = combinations.body.data.data[0];
    const { res, body } = await request(`/api/schools?recommendedCombinationIds=${combo.id}&page=1&limit=20`);
    assert.equal(res.status, 200);
    assert.equal(body.success, true);
    assert.ok(body.data.data.length > 0);
    assert.ok(body.data.data[0].score >= 0);
    assert.ok(Array.isArray(body.data.data[0].matchReasons));
  });

  it("finds ranked schools from recommendation subjects and track context", async () => {
    const combinations = await request("/api/combinations?track=Pure%20Sciences&page=1&limit=5");
    const recommendedIds = combinations.body.data.data.map((combo: any) => combo.id).join(",");
    const { res, body } = await request(
      `/api/schools?subjects=CHEMISTRY,PHYSICS,MATHEMATICS&recommendedCombinationIds=${recommendedIds}&preferredTrack=Pure%20Sciences&page=1&limit=20`,
    );

    assert.equal(res.status, 200);
    assert.equal(body.success, true);
    assert.ok(Array.isArray(body.data.data));
    assert.ok(body.data.data.length > 0);
    assert.ok(body.data.data.length <= 20);
    assert.ok(body.data.data.every((school: any) => Array.isArray(school.matchReasons)));
  });

  it("combines recommendation context with explicit school filters", async () => {
    const combinations = await request("/api/combinations?track=Pure%20Sciences&page=1&limit=5");
    const recommendedIds = combinations.body.data.data.map((combo: any) => combo.id).join(",");
    const baseQuery = `/api/schools?subjects=CHEMISTRY,PHYSICS,MATHEMATICS&recommendedCombinationIds=${recommendedIds}&preferredTrack=Pure%20Sciences&page=1&limit=20`;
    const initial = await request(baseQuery);
    const referenceSchool = initial.body.data.data[0];
    const filtered = await request(`${baseQuery}&county=${encodeURIComponent(referenceSchool.county)}&gender=${encodeURIComponent(referenceSchool.gender)}`);

    assert.equal(filtered.res.status, 200);
    assert.ok(filtered.body.data.data.length > 0);
    assert.ok(filtered.body.data.data.every((school: any) => school.county.toLowerCase() === referenceSchool.county.toLowerCase()));
    assert.ok(filtered.body.data.data.every((school: any) => school.gender.toLowerCase() === referenceSchool.gender.toLowerCase()));
  });

  it("sorts schools with user-facing sort options", async () => {
    const combinations = await request("/api/combinations?track=Pure%20Sciences&page=1&limit=5");
    const recommendedIds = combinations.body.data.data.map((combo: any) => combo.id).join(",");
    const byCounty = await request(
      `/api/schools?subjects=CHEMISTRY,PHYSICS,MATHEMATICS&recommendedCombinationIds=${recommendedIds}&preferredTrack=Pure%20Sciences&sort=county&page=1&limit=20`,
    );
    const counties = byCounty.body.data.data.map((school: any) => school.county.toLowerCase());

    assert.equal(byCounty.res.status, 200);
    assert.deepEqual(counties, [...counties].sort((a, b) => a.localeCompare(b)));
  });

  it("returns school profile shape and clean errors", async () => {
    const list = await request("/api/schools?page=1&limit=1");
    assert.ok(list.body.data.data.length > 0);
    const school = list.body.data.data[0];

    const profile = await request(`/api/schools/${school.id}/profile`);
    assert.equal(profile.res.status, 200);
    assert.equal(profile.body.data.school.id, school.id);
    assert.ok("profile" in profile.body.data);
    assert.equal(typeof profile.body.data.school.combinationCount, "number");
    assert.ok(Array.isArray(profile.body.data.school.tracksOffered));

    const invalid = await request("/api/schools/not-a-uuid/profile");
    assert.equal(invalid.res.status, 400);
    assertSafeError(invalid.body);

    const missing = await request(`/api/schools/${"0".repeat(64)}/profile`);
    assert.equal(missing.res.status, 404);
    assertSafeError(missing.body);
  });

});

describe("combinations", () => {
  it("supports pagination and filters", async () => {
    for (const query of ["?page=1&limit=20", "?track=Pure%20Sciences&page=1&limit=20", "?subjects=Biology,Chemistry&page=1&limit=20"]) {
      const { res, body } = await request(`/api/combinations${query}`);
      assert.equal(res.status, 200);
      assert.equal(body.success, true);
      assert.ok(Array.isArray(body.data.data));
      assert.ok(body.data.data.length <= 20);
      assert.equal(body.data.meta.page, 1);
      assert.equal(body.data.meta.limit, 20);
    }
  });

  it("returns combination profiles and clean validation/not-found errors", async t => {
    const list = await request("/api/combinations?page=1&limit=20");
    assert.ok(list.body.data.data.length > 0);
    const first = list.body.data.data[0];

    const invalid = await request("/api/combinations/not-a-uuid/profile");
    assert.equal(invalid.res.status, 400);
    assertSafeError(invalid.body);

    const missing = await request("/api/combinations/00000000-0000-4000-8000-000000000000/profile");
    assert.equal(missing.res.status, 404);
    assertSafeError(missing.body);

    const profiled = list.body.data.data.find((combo: any) => combo.profile);
    if (!profiled) {
      t.skip("No stored combination profile is available in the local DB.");
      return;
    }

    const stored = await request(`/api/combinations/${profiled.id}/profile`);
    const generated = await request(`/api/combinations/${profiled.id}/profile?generate=true`, { headers: await verifiedHeaders() });
    assert.equal(stored.res.status, 200);
    assert.equal(generated.res.status, 200);
    assert.equal(stored.body.data.generated, false);
    assert.equal(generated.body.data.generated, false);

    const maybePending = await request(`/api/combinations/${first.id}/profile`);
    assert.ok([200, 404].includes(maybePending.res.status));
  });
});

describe("recommendations and debug", () => {
  it("initializes sessions and verifies humans", async () => {
    const init = await request("/api/session/init", { method: "POST" });
    assert.equal(init.res.status, 200);
    assert.equal(init.body.success, true);
    assert.match(init.res.headers.get("set-cookie") ?? "", /cbc_session=/);

    const cookie = init.res.headers.get("set-cookie")?.split(";")[0] ?? "";
    const verified = await request("/api/security/verify-human", {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify({ token: "dev-turnstile-token" }),
    });
    assert.equal(verified.res.status, 200);
    assert.equal(verified.body.data.verifiedHuman, true);
  });

  it("rejects expensive actions without human verification", async () => {
    const invalid = await request("/api/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subjects: ["Biology", "Chemistry"] }),
    });
    assert.equal(invalid.res.status, 403);
    assert.equal(invalid.body.code, "HUMAN_VERIFICATION_REQUIRED");
  });

  it("returns stable recommendation shape and validates empty input", async () => {
    const valid = await request("/api/recommendations", {
      method: "POST",
      headers: await verifiedHeaders(),
      body: JSON.stringify({ subjects: ["Biology", "Chemistry"], county: "NAIROBI", gender: "BOYS" }),
    });
    assert.equal(valid.res.status, 200);
    assert.equal(valid.body.status, "success");
    assert.ok(Array.isArray(valid.body.data.pathwayRecommendations));
    assert.ok(Array.isArray(valid.body.data.schoolOptions));

    const invalid = await request("/api/recommendations", {
      method: "POST",
      headers: await verifiedHeaders(),
      body: JSON.stringify({ subjects: [] }),
    });
    assert.equal(invalid.res.status, 400);
    assertSafeError(invalid.body);
  });

  it("does not expose raw stacks from debug validation", async () => {
    const { res, body } = await request("/api/debug/validation");
    assert.ok([200, 404].includes(res.status));
    if (res.status >= 400) assertSafeError(body);
  });
});

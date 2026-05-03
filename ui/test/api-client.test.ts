import { afterEach, describe, expect, it, vi } from "vitest";

import { apiGet, apiPost, buildQuery } from "@/lib/api-client";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("api client", () => {
  it("builds compact query strings and supports comma-separated arrays", () => {
    expect(buildQuery({ page: 1, limit: 20, county: "NAIROBI", empty: "", subjects: ["Biology", "Chemistry"] })).toBe(
      "?page=1&limit=20&county=NAIROBI&subjects=Biology%2CChemistry",
    );
  });

  it("returns JSON for successful requests", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json({ success: true, data: [1] })),
    );

    await expect(apiGet("/schools?page=1&limit=20")).resolves.toEqual({ success: true, data: [1] });
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/schools?page=1&limit=20"), expect.objectContaining({ method: "GET" }));
  });

  it("surfaces API error messages for non-2xx responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json({ error: { message: "Validation failed" } }, { status: 400 })),
    );

    await expect(apiPost("/recommendations", { subjects: [] })).rejects.toMatchObject({
      status: 400,
      message: "Validation failed",
    });
  });

  it("uses a safe network error message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("ECONNREFUSED localhost:8080");
      }),
    );

    await expect(apiGet("/schools")).rejects.toMatchObject({
      status: 0,
      message: "Network error - unable to reach the server.",
    });
  });
});

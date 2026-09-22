import { act, renderHook } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  HumanVerificationProvider,
  useHumanVerification,
} from "@/context/human-verification-context";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("HumanVerificationProvider & useHumanVerification", () => {
  it("initializes session verification state on mount via /session/init", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => {
        if (url.includes("/session/init")) {
          return Response.json({ success: true, data: { verifiedHuman: true } }, { status: 200 });
        }
        return Response.json({ success: true }, { status: 200 });
      }),
    );

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <HumanVerificationProvider>{children}</HumanVerificationProvider>
    );

    const { result } = renderHook(() => useHumanVerification(), { wrapper });

    // Allow session init promise to resolve
    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.isHumanVerified).toBe(true);
  });

  it("handles successful verifyHuman token verification", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => {
        if (url.includes("/session/init")) {
          return Response.json({ success: true, data: { verifiedHuman: false } }, { status: 200 });
        }
        if (url.includes("/security/verify-human")) {
          return Response.json({ success: true, data: { verifiedHuman: true } }, { status: 200 });
        }
        return Response.json({ success: true }, { status: 200 });
      }),
    );

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <HumanVerificationProvider>{children}</HumanVerificationProvider>
    );

    const { result } = renderHook(() => useHumanVerification(), { wrapper });

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.isHumanVerified).toBe(false);

    let success = false;
    await act(async () => {
      success = await result.current.verifyHuman("valid-token");
    });

    expect(success).toBe(true);
    expect(result.current.isHumanVerified).toBe(true);
    expect(result.current.verificationError).toBeNull();
  });

  it("handles verifyHuman failure and sets verificationError", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => {
        if (url.includes("/session/init")) {
          return Response.json({ success: true, data: { verifiedHuman: false } }, { status: 200 });
        }
        if (url.includes("/security/verify-human")) {
          return Response.json(
            { error: { message: "Invalid verification token" } },
            { status: 400 },
          );
        }
        return Response.json({ success: false }, { status: 400 });
      }),
    );

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <HumanVerificationProvider>{children}</HumanVerificationProvider>
    );

    const { result } = renderHook(() => useHumanVerification(), { wrapper });

    let success = true;
    await act(async () => {
      success = await result.current.verifyHuman("bad-token");
    });

    expect(success).toBe(false);
    expect(result.current.isHumanVerified).toBe(false);
    expect(result.current.verificationError).toBe("Invalid verification token");
  });

  it("executes onSuccess callback after verifying through prompt modal", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => {
        if (url.includes("/session/init")) {
          return Response.json({ success: true, data: { verifiedHuman: false } }, { status: 200 });
        }
        if (url.includes("/security/verify-human")) {
          return Response.json({ success: true, data: { verifiedHuman: true } }, { status: 200 });
        }
        return Response.json({ success: true }, { status: 200 });
      }),
    );

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <HumanVerificationProvider>{children}</HumanVerificationProvider>
    );

    const { result } = renderHook(() => useHumanVerification(), { wrapper });

    const onSuccessSpy = vi.fn();

    act(() => {
      result.current.openVerificationPrompt({
        title: "Verify to Generate",
        description: "Custom description",
        onSuccess: onSuccessSpy,
      });
    });

    expect(result.current.isPromptOpen).toBe(true);
    expect(result.current.promptTitle).toBe("Verify to Generate");
    expect(result.current.promptDescription).toBe("Custom description");

    await act(async () => {
      await result.current.verifyHuman("valid-token");
    });

    expect(result.current.isPromptOpen).toBe(false);
    expect(onSuccessSpy).toHaveBeenCalledTimes(1);
  });

  it("throws an error when useHumanVerification is used outside provider", () => {
    expect(() => {
      renderHook(() => useHumanVerification());
    }).toThrow("useHumanVerification must be used within a HumanVerificationProvider");
  });
});

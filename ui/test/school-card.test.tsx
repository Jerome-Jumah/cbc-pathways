import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SchoolCard } from "@/components/school-card";

describe("SchoolCard", () => {
  it("renders required fields and handles missing optional image/match data", () => {
    render(
      <SchoolCard
        school={{
          id: "00000000-0000-4000-8000-000000000001",
          rank: 1,
          name: "Nairobi Senior School",
          location: "NAIROBI",
          cluster: "C2 (Extra County)",
          gender: "BOYS",
          accommodation: "Boarding",
          subjects: ["Biology", "Chemistry", "Physics", "Mathematics", "Agriculture"],
        }}
      />,
    );

    expect(screen.getByRole("link")).toHaveAttribute("href", "/school/00000000-0000-4000-8000-000000000001");
    expect(screen.getByText("Nairobi Senior School")).toBeInTheDocument();
    expect(screen.getByText("NAIROBI")).toBeInTheDocument();
    expect(screen.getByText("C2")).toBeInTheDocument();
    expect(screen.getByText("BOYS")).toBeInTheDocument();
    expect(screen.getByText("Boarding")).toBeInTheDocument();
    expect(screen.getByText("+1")).toBeInTheDocument();
    expect(screen.queryByText("Match")).not.toBeInTheDocument();
  });

  it("shows match percentage when provided", () => {
    render(
      <SchoolCard
        school={{
          id: "00000000-0000-4000-8000-000000000002",
          rank: 2,
          name: "Coast Senior School",
          location: "MOMBASA",
          cluster: "C1 (National)",
          gender: "MIXED",
          accommodation: "Day",
          subjects: [],
          matchPercentage: 87,
        }}
      />,
    );

    expect(screen.getByText("87%")).toBeInTheDocument();
    expect(screen.getByText("Match")).toBeInTheDocument();
  });
});

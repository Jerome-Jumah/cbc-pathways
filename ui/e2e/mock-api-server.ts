import http, { type IncomingMessage, type ServerResponse } from "node:http";

const ids = {
  track: "00000000-0000-4000-8000-000000000101",
  school: "00000000-0000-4000-8000-000000000201",
  combo: "00000000-0000-4000-8000-000000000301",
};

export const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost:8080"}`);
  const pathname = url.pathname;

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const json = (data: unknown, status = 200) => {
    res.writeHead(status);
    res.end(JSON.stringify(data));
  };

  // Session init / verify-turnstile
  if (pathname.endsWith("/api/session/init") || pathname.endsWith("/api/session/verify-turnstile")) {
    return json({
      success: true,
      data: {
        verifiedHuman: true,
        csrfToken: "mock-csrf-token",
      },
    });
  }

  // Security verify-human
  if (pathname.endsWith("/api/security/verify-human")) {
    return json({
      success: true,
      data: {
        verifiedHuman: true,
      },
    });
  }

  // School profile
  if (/\/api\/schools\/[^/]+\/profile$/.test(pathname)) {
    return json({
      success: true,
      data: {
        school: {
          id: ids.school,
          name: "Nairobi Senior School",
          county: "NAIROBI",
          cluster: "C2",
          gender: "BOYS",
          category: "C2",
          accommodationType: "Boarding",
          combinationCount: 1,
          tracksOffered: ["Pure Sciences"],
        },
        profile: {
          overview: "Leading STEM secondary school in Nairobi.",
          highlights: ["Modern science laboratories", "Strong university placement"],
        },
      },
    });
  }

  // School combinations
  if (/\/api\/schools\/[^/]+\/combinations$/.test(pathname)) {
    return json({
      success: true,
      data: {
        schoolId: ids.school,
        schoolName: "Nairobi Senior School",
        totalCombinations: 1,
        byTrack: [
          {
            trackId: ids.track,
            trackName: "Pure Sciences",
            pathway: "STEM",
            combinations: [
              {
                id: ids.combo,
                code: "PCB",
                track: { id: ids.track, name: "Pure Sciences", pathway: "STEM" },
                Subjects: [{ name: "Biology" }, { name: "Chemistry" }],
                profile: null,
              },
            ],
          },
        ],
      },
    });
  }

  // Combination profile
  const comboProfileMatch = pathname.match(/\/api\/combinations\/([^/]+)\/profile$/);
  if (comboProfileMatch) {
    const requestedId = comboProfileMatch[1];
    if (requestedId === ids.combo) {
      return json({
        success: true,
        data: {
          found: true,
          generated: false,
          combination: {
            id: ids.combo,
            code: "PCB",
            subjects: ["Biology", "Chemistry"],
            track: "Pure Sciences",
            pathway: "STEM",
            schoolCount: 1,
          },
          profile: {
            id: "p1",
            combinationId: ids.combo,
            overview: "Health sciences pathway",
            bestFor: "Science learners",
            difficultyLevel: "Medium",
            careerPathways: ["Medicine"],
            keyBenefits: ["Strong science base"],
            subjectDetails: [],
            generatedBy: "test",
            promptVersion: "test",
            createdAt: "",
            updatedAt: "",
          },
        },
      });
    }

    if (requestedId === "00000000-0000-4000-8000-000000000302") {
      if (url.searchParams.get("generate") === "true") {
        return json({
          success: true,
          data: {
            found: true,
            generated: true,
            combination: {
              id: "00000000-0000-4000-8000-000000000302",
              code: "PCM",
              subjects: ["Physics", "Chemistry", "Mathematics"],
              track: "Pure Sciences",
              pathway: "STEM",
              schoolCount: 1,
            },
            profile: {
              id: "p2",
              combinationId: "00000000-0000-4000-8000-000000000302",
              overview: "Engineering and physical sciences pathway",
              bestFor: "Analytical minds",
              difficultyLevel: "High",
              careerPathways: ["Engineering", "Data Science"],
              keyBenefits: ["Broad technical foundation"],
              subjectDetails: [],
              generatedBy: "test",
              promptVersion: "test",
              createdAt: "",
              updatedAt: "",
            },
          },
        });
      }

      return json(
        {
          success: false,
          message: `No profile found for combination '${requestedId}'. Add ?generate=true to generate one.`,
        },
        404,
      );
    }

    return json(
      {
        success: false,
        message: `Combination with id '${requestedId}' not found.`,
      },
      404,
    );
  }

  // Single track profile
  if (/\/api\/track-profiles\/[^/]+$/.test(pathname)) {
    return json({
      success: true,
      data: {
        id: ids.track,
        name: "Pure Sciences",
        pathway: "STEM",
        profile: {
          shortDescription: "Science pathway",
          description: "Science pathway",
          highlights: ["Physics, Chemistry, Biology"],
          careerPathways: ["Medicine", "Engineering"],
          recommendedFor: ["STEM enthusiasts"],
        },
      },
    });
  }

  // All track profiles
  if (pathname.endsWith("/api/track-profiles")) {
    return json({
      success: true,
      data: [
        {
          id: ids.track,
          name: "Pure Sciences",
          pathway: "STEM",
          profile: {
            shortDescription: "Science pathway",
            description: "Science pathway",
            highlights: [],
            careerPathways: ["Medicine"],
            recommendedFor: [],
          },
        },
      ],
    });
  }

  // Combinations list
  if (pathname.endsWith("/api/combinations")) {
    return json({
      success: true,
      data: {
        meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
        data: [
          {
            id: ids.combo,
            code: "PCB",
            track: { id: ids.track, name: "Pure Sciences", pathway: "STEM" },
            Subjects: [{ name: "Biology" }, { name: "Chemistry" }],
            _count: { Schools: 1 },
            profile: {
              difficultyLevel: "Medium",
              careerPathways: ["Medicine"],
              overview: "Health sciences pathway",
            },
          },
        ],
      },
    });
  }

  // Schools list
  if (pathname.endsWith("/api/schools")) {
    return json({
      success: true,
      data: {
        meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
        data: [
          {
            id: ids.school,
            name: "Nairobi Senior School",
            county: "NAIROBI",
            cluster: "C2",
            gender: "BOYS",
            category: "C2",
            accommodationType: "Boarding",
            score: 95,
            matchReasons: ["Matches Biology and Chemistry"],
            Combinations: [
              {
                id: ids.combo,
                code: "PCB",
                Subjects: [{ name: "Biology" }, { name: "Chemistry" }],
              },
            ],
            tracksOffered: ["Pure Sciences"],
          },
        ],
      },
    });
  }

  // Recommendations
  if (pathname.endsWith("/api/recommendations")) {
    return json({
      status: "success",
      data: {
        pathwayRecommendations: [
          {
            id: ids.combo,
            code: "PCB",
            track: { name: "Pure Sciences" },
            Subjects: [{ name: "Biology" }, { name: "Chemistry" }],
            _count: { Schools: 1 },
            matchScore: 67,
            matchedSubjects: ["BIOLOGY"],
          },
        ],
        schoolMatches: [
          {
            id: ids.school,
            name: "Nairobi Senior School",
            county: "NAIROBI",
            cluster: "C2",
            gender: "BOYS",
            category: "C2",
            accommodationType: "Boarding",
            score: 90,
            matchReasons: ["Matches subject selection"],
            Combinations: [
              {
                id: ids.combo,
                code: "PCB",
                Subjects: [{ name: "Biology" }, { name: "Chemistry" }],
              },
            ],
            tracksOffered: ["Pure Sciences"],
          },
        ],
      },
    });
  }

  return json({ success: false, message: "Not found" }, 404);
});

const PORT = 8080;
server.listen(PORT, "127.0.0.1", () => {
  console.log(`Mock API Server running on http://127.0.0.1:${PORT}`);
});

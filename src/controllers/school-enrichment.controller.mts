import { NextFunction, Request, Response } from "express";
import {
  createSchoolEnrichmentJobParamsSchema,
  createSchoolEnrichmentJobBodySchema,
  listSchoolEnrichmentJobsQuerySchema,
  queueMissingProfilesBodySchema,
  addSchoolSourceCandidateBodySchema,
} from "../schemas/school-enrichment.schema.mjs";
import {
  createSchoolEnrichmentJobHandler,
  listSchoolEnrichmentJobsHandler,
  queueSchoolsMissingProfilesHandler,
  addSchoolSourceCandidateHandler,
  listSchoolSourceCandidatesHandler,
} from "../handlers/school-enrichment.handler.mjs";
import { httpErrorHandler, STATUS_CODES } from "../constants/index.mjs";

// ─── POST /schools/:schoolId/enrichment-job ───────────────────────────────────

export async function createSchoolEnrichmentJobController(req: Request, res: Response, next: NextFunction) {
  try {
    const { schoolId } = createSchoolEnrichmentJobParamsSchema.parse(req.params);
    const body = createSchoolEnrichmentJobBodySchema.parse(req.body);

    const result = await createSchoolEnrichmentJobHandler({ schoolId, priority: body.priority });

    if (!result) {
      httpErrorHandler(STATUS_CODES.NOT_FOUND, `School with id '${schoolId}' not found.`);
      return;
    }

    res.status(STATUS_CODES.CREATED).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

// ─── GET /school-enrichment/jobs ──────────────────────────────────────────────

export async function listSchoolEnrichmentJobsController(req: Request, res: Response, next: NextFunction) {
  try {
    const query = listSchoolEnrichmentJobsQuerySchema.parse(req.query);
    const jobs = await listSchoolEnrichmentJobsHandler(query);
    res.json({ success: true, data: jobs });
  } catch (error) {
    next(error);
  }
}

// ─── POST /school-enrichment/queue-missing ────────────────────────────────────

export async function queueMissingProfilesController(req: Request, res: Response, next: NextFunction) {
  try {
    const body = queueMissingProfilesBodySchema.parse(req.body);
    const result = await queueSchoolsMissingProfilesHandler(body);
    res.status(STATUS_CODES.CREATED).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

// ─── POST /schools/:schoolId/source-candidates ────────────────────────────────

export async function addSchoolSourceCandidateController(req: Request, res: Response, next: NextFunction) {
  try {
    const { schoolId } = createSchoolEnrichmentJobParamsSchema.parse(req.params);
    const body = addSchoolSourceCandidateBodySchema.parse(req.body);

    const candidate = await addSchoolSourceCandidateHandler({ schoolId, ...body });

    if (!candidate) {
      httpErrorHandler(STATUS_CODES.NOT_FOUND, `School with id '${schoolId}' not found.`);
      return;
    }

    res.status(STATUS_CODES.CREATED).json({ success: true, data: candidate });
  } catch (error) {
    next(error);
  }
}

// ─── GET /schools/:schoolId/source-candidates ─────────────────────────────────

export async function listSchoolSourceCandidatesController(req: Request, res: Response, next: NextFunction) {
  try {
    const { schoolId } = createSchoolEnrichmentJobParamsSchema.parse(req.params);
    const candidates = await listSchoolSourceCandidatesHandler(schoolId);

    if (!candidates) {
      httpErrorHandler(STATUS_CODES.NOT_FOUND, `School with id '${schoolId}' not found.`);
      return;
    }

    res.json({ success: true, data: candidates });
  } catch (error) {
    next(error);
  }
}

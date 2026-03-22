import type { Express, Request, Response } from "express";

import {
  getAuthenticatedUserFromRequest,
  supabase,
  type AuthenticatedUser,
} from "./supabase-auth";

type ComplaintRow = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  status: "open" | "in_review" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  submitted_date: string;
  created_at: string;
};

const validComplaintStatuses = new Set([
  "open",
  "in_review",
  "resolved",
  "closed",
] as const);

const validComplaintPriorities = new Set([
  "low",
  "medium",
  "high",
] as const);

type LicenseApplicationStatus =
  | "submitted"
  | "under_review"
  | "more_information_required"
  | "approved"
  | "rejected";

const validLicenseApplicationStatuses = new Set([
  "submitted",
  "under_review",
  "more_information_required",
  "approved",
  "rejected",
] as const);

const LICENSE_APPLICATION_BUCKET = "license-application-files";
const MAX_LICENSE_APPLICATION_ATTACHMENTS = 4;
const MAX_LICENSE_APPLICATION_ATTACHMENT_BYTES = 8 * 1024 * 1024;
const ALLOWED_LICENSE_APPLICATION_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

type ContactSubmissionRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: "new" | "read" | "responded";
  created_at: string;
};

type ConsultationRow = {
  id: string;
  title: string;
  end_date: string;
  status: "open" | "closed" | "archived";
};

type LicenseApplicationAttachment = {
  name: string;
  mime_type: string;
  size_bytes: number;
  storage_bucket: string;
  storage_path: string;
  signed_url?: string | null;
};

type LicenseApplicationRow = {
  id: string;
  user_id: string;
  application_type: string;
  organization_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  service_area: string;
  summary: string;
  status: LicenseApplicationStatus;
  review_notes: string | null;
  attachments: LicenseApplicationAttachment[] | null;
  submitted_at: string;
  created_at: string;
  updated_at: string;
};

type LicenseApplicationInputAttachment = {
  name?: unknown;
  type?: unknown;
  size?: unknown;
  dataBase64?: unknown;
};

type LicenseApplicationAdminRecord = LicenseApplicationRow & {
  requester_name: string;
  requester_email: string;
};

function sendUnauthorized(res: Response) {
  res.status(401).json({ error: "Unauthorized" });
}

function sendForbidden(res: Response) {
  res.status(403).json({ error: "Forbidden" });
}

async function requireUser(req: Request, res: Response) {
  const user = await getAuthenticatedUserFromRequest(req);

  if (!user) {
    sendUnauthorized(res);
    return null;
  }

  return user;
}

async function requireAdmin(req: Request, res: Response) {
  const user = await requireUser(req, res);

  if (!user) {
    return null;
  }

  if (user.role !== "admin") {
    sendForbidden(res);
    return null;
  }

  return user;
}

function buildComplaintSummary(complaints: ComplaintRow[]) {
  return complaints.reduce(
    (summary, complaint) => {
      summary.total += 1;
      summary[complaint.status] += 1;
      return summary;
    },
    {
      total: 0,
      open: 0,
      in_review: 0,
      resolved: 0,
      closed: 0,
    }
  );
}

function buildContactSummary(contactSubmissions: ContactSubmissionRow[]) {
  return contactSubmissions.reduce(
    (summary, submission) => {
      summary.total += 1;
      summary[submission.status] += 1;
      return summary;
    },
    {
      total: 0,
      new: 0,
      read: 0,
      responded: 0,
    }
  );
}

function buildLicenseApplicationSummary(
  applications: LicenseApplicationRow[] | LicenseApplicationAdminRecord[]
) {
  return applications.reduce(
    (summary, application) => {
      summary.total += 1;
      summary[application.status] += 1;
      return summary;
    },
    {
      total: 0,
      submitted: 0,
      under_review: 0,
      more_information_required: 0,
      approved: 0,
      rejected: 0,
    }
  );
}

function sanitizeFileName(value: string) {
  return value
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

function decodeAttachmentBase64(value: string) {
  const payload = value.includes(",") ? value.split(",").pop() ?? value : value;
  return Buffer.from(payload, "base64");
}

async function ensureLicenseApplicationBucket() {
  const { data: buckets, error } = await supabase.storage.listBuckets();

  if (error) {
    throw error;
  }

  const exists = (buckets ?? []).some(
    (bucket) => bucket.id === LICENSE_APPLICATION_BUCKET
  );

  if (exists) {
    return;
  }

  const { error: createError } = await supabase.storage.createBucket(
    LICENSE_APPLICATION_BUCKET,
    {
      public: false,
      fileSizeLimit: "8MB",
      allowedMimeTypes: [...ALLOWED_LICENSE_APPLICATION_MIME_TYPES],
    }
  );

  if (createError && !createError.message.toLowerCase().includes("already")) {
    throw createError;
  }
}

async function uploadLicenseApplicationAttachments(
  userId: string,
  attachments: unknown
) {
  const items = Array.isArray(attachments)
    ? (attachments as LicenseApplicationInputAttachment[])
    : [];

  if (items.length === 0) {
    return [] as LicenseApplicationAttachment[];
  }

  if (items.length > MAX_LICENSE_APPLICATION_ATTACHMENTS) {
    throw new Error(
      `Upload up to ${MAX_LICENSE_APPLICATION_ATTACHMENTS} supporting files.`
    );
  }

  await ensureLicenseApplicationBucket();

  const storedAttachments: LicenseApplicationAttachment[] = [];

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];

    if (!item) {
      continue;
    }

    const name =
      typeof item.name === "string" && item.name.trim()
        ? item.name.trim()
        : `attachment-${index + 1}`;
    const mimeType =
      typeof item.type === "string" && item.type.trim()
        ? item.type.trim()
        : "application/octet-stream";
    const dataBase64 =
      typeof item.dataBase64 === "string" ? item.dataBase64 : "";

    if (!ALLOWED_LICENSE_APPLICATION_MIME_TYPES.includes(mimeType as any)) {
      throw new Error(`Unsupported file type for ${name}.`);
    }

    if (!dataBase64) {
      throw new Error(`Missing file payload for ${name}.`);
    }

    const buffer = decodeAttachmentBase64(dataBase64);

    if (!buffer.length) {
      throw new Error(`Attachment ${name} is empty.`);
    }

    if (buffer.length > MAX_LICENSE_APPLICATION_ATTACHMENT_BYTES) {
      throw new Error(
        `${name} exceeds the ${Math.round(
          MAX_LICENSE_APPLICATION_ATTACHMENT_BYTES / 1024 / 1024
        )} MB limit.`
      );
    }

    const storagePath = `${userId}/${Date.now()}-${index}-${sanitizeFileName(name)}`;
    const { error } = await supabase.storage
      .from(LICENSE_APPLICATION_BUCKET)
      .upload(storagePath, buffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (error) {
      throw error;
    }

    storedAttachments.push({
      name,
      mime_type: mimeType,
      size_bytes: buffer.length,
      storage_bucket: LICENSE_APPLICATION_BUCKET,
      storage_path: storagePath,
    });
  }

  return storedAttachments;
}

async function signLicenseApplicationAttachments(
  attachments: LicenseApplicationAttachment[] | null
) {
  if (!attachments?.length) {
    return [];
  }

  return Promise.all(
    attachments.map(async (attachment) => {
      const { data, error } = await supabase.storage
        .from(attachment.storage_bucket || LICENSE_APPLICATION_BUCKET)
        .createSignedUrl(attachment.storage_path, 60 * 60);

      if (error) {
        console.error("Failed to sign attachment URL:", error);
        return {
          ...attachment,
          signed_url: null,
        };
      }

      return {
        ...attachment,
        signed_url: data?.signedUrl ?? null,
      };
    })
  );
}

async function fetchProfileMap(userIds: string[]) {
  if (userIds.length === 0) {
    return new Map<string, { email: string | null; full_name: string | null }>();
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("user_id, email, full_name")
    .in("user_id", userIds);

  if (error) {
    throw error;
  }

  return new Map(
    (data ?? []).map((profile) => [
      profile.user_id,
      {
        email: profile.email,
        full_name: profile.full_name,
      },
    ])
  );
}

function mapComplaintForAdmin(
  complaint: ComplaintRow,
  profiles: Map<string, { email: string | null; full_name: string | null }>
) {
  const profile = profiles.get(complaint.user_id);

  return {
    ...complaint,
    reporter_name: profile?.full_name || "Citizen",
    reporter_email: profile?.email || "",
  };
}

function mapLicenseApplicationForAdmin(
  application: LicenseApplicationRow,
  profiles: Map<string, { email: string | null; full_name: string | null }>
): LicenseApplicationAdminRecord {
  const profile = profiles.get(application.user_id);

  return {
    ...application,
    requester_name: profile?.full_name || application.contact_name || "Citizen",
    requester_email: profile?.email || application.contact_email || "",
  };
}

async function fetchPortalOverview(user: AuthenticatedUser) {
  const [complaintsResult, consultationsResult, licenseApplicationsResult] =
    await Promise.all([
    supabase
      .from("complaints")
      .select(
        "id, user_id, title, description, category, status, priority, submitted_date, created_at"
      )
      .eq("user_id", user.id)
      .order("submitted_date", { ascending: false })
      .limit(6),
    supabase
      .from("consultations")
      .select("id, title, end_date, status")
      .eq("status", "open")
      .order("end_date", { ascending: true })
      .limit(3),
    supabase
      .from("license_applications")
      .select(
        "id, user_id, application_type, organization_name, contact_name, contact_email, contact_phone, service_area, summary, status, review_notes, attachments, submitted_at, created_at, updated_at"
      )
      .eq("user_id", user.id)
      .order("submitted_at", { ascending: false })
      .limit(6),
    ]);

  if (complaintsResult.error) {
    throw complaintsResult.error;
  }

  if (consultationsResult.error) {
    throw consultationsResult.error;
  }

  if (licenseApplicationsResult.error) {
    throw licenseApplicationsResult.error;
  }

  const complaints = (complaintsResult.data ?? []) as ComplaintRow[];
  const consultations = (consultationsResult.data ?? []) as ConsultationRow[];
  const licenseApplications = await Promise.all(
    ((licenseApplicationsResult.data ?? []) as LicenseApplicationRow[]).map(
      async (application) => ({
        ...application,
        attachments: await signLicenseApplicationAttachments(
          application.attachments
        ),
      })
    )
  );

  return {
    complaints,
    complaintSummary: buildComplaintSummary(complaints),
    consultations,
    licenseApplications,
    licenseApplicationSummary: buildLicenseApplicationSummary(licenseApplications),
  };
}

async function fetchAdminOverview() {
  const [complaintsResult, contactResult, licenseApplicationsResult] =
    await Promise.all([
    supabase
      .from("complaints")
      .select(
        "id, user_id, title, description, category, status, priority, submitted_date, created_at"
      )
      .order("submitted_date", { ascending: false })
      .limit(8),
    supabase
      .from("contact_submissions")
      .select("id, name, email, phone, subject, message, status, created_at")
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("license_applications")
      .select(
        "id, user_id, application_type, organization_name, contact_name, contact_email, contact_phone, service_area, summary, status, review_notes, attachments, submitted_at, created_at, updated_at"
      )
      .order("submitted_at", { ascending: false })
      .limit(8),
    ]);

  if (complaintsResult.error) {
    throw complaintsResult.error;
  }

  if (contactResult.error) {
    throw contactResult.error;
  }

  if (licenseApplicationsResult.error) {
    throw licenseApplicationsResult.error;
  }

  const complaints = (complaintsResult.data ?? []) as ComplaintRow[];
  const contactSubmissions = (contactResult.data ?? []) as ContactSubmissionRow[];
  const licenseApplications = (licenseApplicationsResult.data ??
    []) as LicenseApplicationRow[];
  const reporterIds = Array.from(
    new Set([
      ...complaints.map((complaint) => complaint.user_id),
      ...licenseApplications.map((application) => application.user_id),
    ])
  );
  const profileMap = await fetchProfileMap(reporterIds);
  const signedLicenseApplications = await Promise.all(
    licenseApplications.map(async (application) =>
      mapLicenseApplicationForAdmin(
        {
          ...application,
          attachments: await signLicenseApplicationAttachments(
            application.attachments
          ),
        },
        profileMap
      )
    )
  );

  return {
    complaints: complaints.map((complaint) =>
      mapComplaintForAdmin(complaint, profileMap)
    ),
    complaintSummary: buildComplaintSummary(complaints),
    contactSubmissions,
    contactSummary: buildContactSummary(contactSubmissions),
    licenseApplications: signedLicenseApplications,
    licenseApplicationSummary: buildLicenseApplicationSummary(
      signedLicenseApplications
    ),
  };
}

export function registerDashboardRoutes(app: Express) {
  app.post("/api/portal/complaints", async (req: Request, res: Response) => {
    try {
      const user = await requireUser(req, res);

      if (!user) {
        return;
      }

      const title =
        typeof req.body?.title === "string" ? req.body.title.trim() : "";
      const description =
        typeof req.body?.description === "string"
          ? req.body.description.trim()
          : "";
      const category =
        typeof req.body?.category === "string" ? req.body.category.trim() : "";
      const priority =
        typeof req.body?.priority === "string" ? req.body.priority : "";

      if (!title || !description || !category) {
        res
          .status(400)
          .json({ error: "Title, category, and description are required." });
        return;
      }

      if (!validComplaintPriorities.has(priority as ComplaintRow["priority"])) {
        res.status(400).json({ error: "Invalid complaint priority." });
        return;
      }

      const { data, error } = await supabase
        .from("complaints")
        .insert({
          user_id: user.id,
          title,
          description,
          category,
          priority,
          status: "open",
        })
        .select(
          "id, user_id, title, description, category, status, priority, submitted_date, created_at"
        )
        .single();

      if (error) {
        throw error;
      }

      res.status(201).json(data);
    } catch (error) {
      console.error("Failed to create complaint:", error);
      res.status(500).json({ error: "Failed to create complaint" });
    }
  });

  app.post(
    "/api/portal/license-applications",
    async (req: Request, res: Response) => {
      try {
        const user = await requireUser(req, res);

        if (!user) {
          return;
        }

        const applicationType =
          typeof req.body?.applicationType === "string"
            ? req.body.applicationType.trim()
            : "";
        const organizationName =
          typeof req.body?.organizationName === "string"
            ? req.body.organizationName.trim()
            : "";
        const contactName =
          typeof req.body?.contactName === "string"
            ? req.body.contactName.trim()
            : user.name;
        const contactEmail =
          typeof req.body?.contactEmail === "string"
            ? req.body.contactEmail.trim()
            : user.email;
        const contactPhone =
          typeof req.body?.contactPhone === "string"
            ? req.body.contactPhone.trim()
            : "";
        const serviceArea =
          typeof req.body?.serviceArea === "string"
            ? req.body.serviceArea.trim()
            : "";
        const summary =
          typeof req.body?.summary === "string" ? req.body.summary.trim() : "";

        if (
          !applicationType ||
          !organizationName ||
          !contactName ||
          !contactEmail ||
          !serviceArea ||
          !summary
        ) {
          res.status(400).json({
            error:
              "Application type, organisation, contact details, service area, and summary are required.",
          });
          return;
        }

        const attachments = await uploadLicenseApplicationAttachments(
          user.id,
          req.body?.attachments
        );

        const { data, error } = await supabase
          .from("license_applications")
          .insert({
            user_id: user.id,
            application_type: applicationType,
            organization_name: organizationName,
            contact_name: contactName,
            contact_email: contactEmail,
            contact_phone: contactPhone || null,
            service_area: serviceArea,
            summary,
            attachments,
            status: "submitted",
          })
          .select(
            "id, user_id, application_type, organization_name, contact_name, contact_email, contact_phone, service_area, summary, status, review_notes, attachments, submitted_at, created_at, updated_at"
          )
          .single();

        if (error) {
          throw error;
        }

        res.status(201).json({
          ...(data as LicenseApplicationRow),
          attachments: await signLicenseApplicationAttachments(
            (data as LicenseApplicationRow).attachments
          ),
        });
      } catch (error) {
        console.error("Failed to create license application:", error);
        res.status(500).json({
          error:
            error instanceof Error
              ? error.message
              : "Failed to create license application",
        });
      }
    }
  );

  app.get("/api/portal/overview", async (req: Request, res: Response) => {
    try {
      const user = await requireUser(req, res);

      if (!user) {
        return;
      }

      const overview = await fetchPortalOverview(user);
      res.json(overview);
    } catch (error) {
      console.error("Failed to load portal overview:", error);
      res.status(500).json({ error: "Failed to load portal overview" });
    }
  });

  app.get("/api/admin/overview", async (req: Request, res: Response) => {
    try {
      const user = await requireAdmin(req, res);

      if (!user) {
        return;
      }

      const overview = await fetchAdminOverview();
      res.json(overview);
    } catch (error) {
      console.error("Failed to load admin overview:", error);
      res.status(500).json({ error: "Failed to load admin overview" });
    }
  });

  app.patch("/api/admin/complaints/:id", async (req: Request, res: Response) => {
    try {
      const user = await requireAdmin(req, res);

      if (!user) {
        return;
      }

      const complaintId = req.params.id;
      const status =
        typeof req.body?.status === "string" ? req.body.status : "";

      if (!complaintId) {
        res.status(400).json({ error: "Complaint id is required." });
        return;
      }

      if (!validComplaintStatuses.has(status as ComplaintRow["status"])) {
        res.status(400).json({ error: "Invalid complaint status." });
        return;
      }

      const { data, error } = await supabase
        .from("complaints")
        .update({ status })
        .eq("id", complaintId)
        .select(
          "id, user_id, title, description, category, status, priority, submitted_date, created_at"
        )
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        res.status(404).json({ error: "Complaint not found." });
        return;
      }

      const profiles = await fetchProfileMap([data.user_id]);
      res.json(mapComplaintForAdmin(data as ComplaintRow, profiles));
    } catch (error) {
      console.error("Failed to update complaint status:", error);
      res.status(500).json({ error: "Failed to update complaint status" });
    }
  });

  app.patch(
    "/api/admin/license-applications/:id",
    async (req: Request, res: Response) => {
      try {
        const user = await requireAdmin(req, res);

        if (!user) {
          return;
        }

        const applicationId = req.params.id;
        const status =
          typeof req.body?.status === "string" ? req.body.status : "";
        const reviewNotes =
          typeof req.body?.reviewNotes === "string"
            ? req.body.reviewNotes.trim()
            : null;

        if (!applicationId) {
          res.status(400).json({ error: "Application id is required." });
          return;
        }

        if (
          !validLicenseApplicationStatuses.has(
            status as LicenseApplicationStatus
          )
        ) {
          res.status(400).json({ error: "Invalid application status." });
          return;
        }

        const { data, error } = await supabase
          .from("license_applications")
          .update({
            status,
            review_notes: reviewNotes,
            updated_at: new Date().toISOString(),
          })
          .eq("id", applicationId)
          .select(
            "id, user_id, application_type, organization_name, contact_name, contact_email, contact_phone, service_area, summary, status, review_notes, attachments, submitted_at, created_at, updated_at"
          )
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (!data) {
          res.status(404).json({ error: "Application not found." });
          return;
        }

        const profiles = await fetchProfileMap([data.user_id]);
        res.json(
          mapLicenseApplicationForAdmin(
            {
              ...(data as LicenseApplicationRow),
              attachments: await signLicenseApplicationAttachments(
                (data as LicenseApplicationRow).attachments
              ),
            },
            profiles
          )
        );
      } catch (error) {
        console.error("Failed to update license application:", error);
        res.status(500).json({ error: "Failed to update license application" });
      }
    }
  );
}

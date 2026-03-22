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

async function fetchPortalOverview(user: AuthenticatedUser) {
  const [complaintsResult, consultationsResult] = await Promise.all([
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
  ]);

  if (complaintsResult.error) {
    throw complaintsResult.error;
  }

  if (consultationsResult.error) {
    throw consultationsResult.error;
  }

  const complaints = (complaintsResult.data ?? []) as ComplaintRow[];
  const consultations = (consultationsResult.data ?? []) as ConsultationRow[];

  return {
    complaints,
    complaintSummary: buildComplaintSummary(complaints),
    consultations,
  };
}

async function fetchAdminOverview() {
  const [complaintsResult, contactResult] = await Promise.all([
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
  ]);

  if (complaintsResult.error) {
    throw complaintsResult.error;
  }

  if (contactResult.error) {
    throw contactResult.error;
  }

  const complaints = (complaintsResult.data ?? []) as ComplaintRow[];
  const contactSubmissions = (contactResult.data ?? []) as ContactSubmissionRow[];
  const reporterIds = Array.from(
    new Set(complaints.map((complaint) => complaint.user_id))
  );
  const profileMap = await fetchProfileMap(reporterIds);

  return {
    complaints: complaints.map((complaint) =>
      mapComplaintForAdmin(complaint, profileMap)
    ),
    complaintSummary: buildComplaintSummary(complaints),
    contactSubmissions,
    contactSummary: buildContactSummary(contactSubmissions),
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
}

import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

dotenv.config({ path: path.join(rootDir, ".env.local") });
dotenv.config({ path: path.join(rootDir, ".env") });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey =
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Missing VITE_SUPABASE_URL and SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY"
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

const demoUsers = {
  admin: {
    email: process.env.DEMO_ADMIN_EMAIL || "admin.demo@bocra.org.bw",
    password: process.env.DEMO_ADMIN_PASSWORD || "BocraDemoAdmin123!",
    fullName: "BOCRA Demo Admin",
    role: "admin",
  },
  citizen: {
    email: process.env.DEMO_CITIZEN_EMAIL || "citizen.demo@bocra.org.bw",
    password: process.env.DEMO_CITIZEN_PASSWORD || "BocraDemoCitizen123!",
    fullName: "BOCRA Demo Citizen",
    role: "citizen",
  },
};

async function findUserByEmail(email) {
  let page = 1;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 200,
    });

    if (error) {
      throw error;
    }

    const user = data.users.find(
      (candidate) => candidate.email?.toLowerCase() === email.toLowerCase()
    );

    if (user) {
      return user;
    }

    if (data.users.length < 200) {
      return null;
    }

    page += 1;
  }
}

async function ensureUser({ email, password, fullName, role }) {
  let user = await findUserByEmail(email);

  if (!user) {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name: fullName,
      },
    });

    if (error) {
      throw error;
    }

    user = data.user;
  } else {
    const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
      password,
      email_confirm: true,
      user_metadata: {
        ...(user.user_metadata || {}),
        name: fullName,
      },
    });

    if (error) {
      throw error;
    }

    user = data.user;
  }

  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      user_id: user.id,
      email,
      full_name: fullName,
      role,
    },
    {
      onConflict: "user_id",
    }
  );

  if (profileError) {
    throw profileError;
  }

  return user;
}

function isoDaysAgo(daysAgo) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date.toISOString();
}

async function resetDemoComplaints(userId) {
  const { error } = await supabase.from("complaints").delete().eq("user_id", userId);

  if (error) {
    throw error;
  }
}

async function seedComplaints(userId) {
  const complaints = [
    {
      user_id: userId,
      title: "Intermittent mobile data outage in Gaborone West",
      description:
        "The subscriber reported repeated evening mobile data outages over the last week and requested escalation after provider support did not resolve the issue.",
      category: "Mobile data quality",
      status: "open",
      priority: "high",
      submitted_date: isoDaysAgo(1),
      created_at: isoDaysAgo(1),
    },
    {
      user_id: userId,
      title: "Delayed SIM registration correction",
      description:
        "The customer requested correction of SIM registration details and is waiting for a formal provider response.",
      category: "SIM registration",
      status: "in_review",
      priority: "medium",
      submitted_date: isoDaysAgo(4),
      created_at: isoDaysAgo(4),
    },
    {
      user_id: userId,
      title: "Unexpected broadband billing adjustment",
      description:
        "A billing dispute was raised after an unexplained adjustment appeared on the monthly broadband invoice.",
      category: "Billing dispute",
      status: "resolved",
      priority: "medium",
      submitted_date: isoDaysAgo(9),
      created_at: isoDaysAgo(9),
    },
    {
      user_id: userId,
      title: "Missed response on postal service complaint",
      description:
        "The user previously reported delayed delivery and the case is now closed after the operator provided a final response.",
      category: "Postal services",
      status: "closed",
      priority: "low",
      submitted_date: isoDaysAgo(16),
      created_at: isoDaysAgo(16),
    },
  ];

  const { error } = await supabase.from("complaints").insert(complaints);

  if (error) {
    throw error;
  }
}

async function resetDemoContactSubmissions(demoEmails) {
  const { error } = await supabase
    .from("contact_submissions")
    .delete()
    .in("email", demoEmails);

  if (error) {
    throw error;
  }
}

async function seedContactSubmissions(demoEmails) {
  const { error } = await supabase.from("contact_submissions").insert([
    {
      name: "Skills Ranker Judge Desk",
      email: demoEmails[0],
      phone: "+267 395 7755",
      subject: "Hackathon demo enquiry",
      message:
        "Please confirm the current queue state before the hackathon judging session.",
      status: "new",
      created_at: isoDaysAgo(2),
    },
    {
      name: "BOCRA Demo Operations",
      email: demoEmails[1],
      phone: "+267 395 7755",
      subject: "Follow-up on public contact workflow",
      message:
        "This seeded record keeps the admin contact queue populated during demos.",
      status: "read",
      created_at: isoDaysAgo(5),
    },
  ]);

  if (error) {
    throw error;
  }
}

async function main() {
  const adminUser = await ensureUser(demoUsers.admin);
  const citizenUser = await ensureUser(demoUsers.citizen);

  await resetDemoComplaints(citizenUser.id);
  await seedComplaints(citizenUser.id);

  const demoEmails = [demoUsers.admin.email, demoUsers.citizen.email];
  await resetDemoContactSubmissions(demoEmails);
  await seedContactSubmissions(demoEmails);

  console.log(
    JSON.stringify(
      {
        admin: {
          email: demoUsers.admin.email,
          password: demoUsers.admin.password,
          userId: adminUser.id,
        },
        citizen: {
          email: demoUsers.citizen.email,
          password: demoUsers.citizen.password,
          userId: citizenUser.id,
        },
        seededComplaints: 4,
        seededContactSubmissions: 2,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

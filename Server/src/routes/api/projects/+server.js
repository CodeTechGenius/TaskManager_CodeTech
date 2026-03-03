import { json } from "@sveltejs/kit";
import { pool } from "$lib/server/pgdb";

function isNonEmpty(v) {
  return typeof v === "string" && v.trim().length > 0;
}

export async function POST({ request }) {
  try {
    const body = await request.json();
    console.log('body is ..',body)

    // basic validation (server-side)
    if (!isNonEmpty(body.projectName)) return json({ error: 1, errorMsg: "projectName required" }, { status: 400 });
    if (!isNonEmpty(body.projectCode)) return json({ error: 1, errorMsg: "projectCode required" }, { status: 400 });
    if (!isNonEmpty(body.category)) return json({ error: 1, errorMsg: "category required" }, { status: 400 });
    if (!body.kickoffDate) return json({ error: 1, errorMsg: "kickoffDate required" }, { status: 400 });
    if (!body.startDate) return json({ error: 1, errorMsg: "startDate required" }, { status: 400 });
    if (!body.estimatedEndDate) return json({ error: 1, errorMsg: "estimatedEndDate required" }, { status: 400 });
    if (!isNonEmpty(body.clientName)) return json({ error: 1, errorMsg: "clientName required" }, { status: 400 });

    const milestones = Array.isArray(body.milestones) ? body.milestones : [];
    const assignedEmployees = Array.isArray(body.assignedEmployees) ? body.assignedEmployees : [];

    const frontend = Array.isArray(body.frontend) ? body.frontend : [];
    const backend = Array.isArray(body.backend) ? body.backend : [];
    const database = Array.isArray(body.database) ? body.database : [];
    const deployment = Array.isArray(body.deployment) ? body.deployment : [];
    const otherTools = Array.isArray(body.otherTools) ? body.otherTools : [];

    // Insert project
    const insertProjectQ = `
      INSERT INTO projects (
        project_name, project_code, description, category, priority, status,
        kickoff_date, start_date, estimated_end_date, actual_end_date,
        billing_type, total_budget, hourly_rate, currency, payment_terms,
        client_name, client_email,
        production_server, staging_server, domain, hosting, cicd, monitoring
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,
        $7,$8,$9,$10,
        $11,$12,$13,$14,$15,
        $16,$17,
        $18,$19,$20,$21,$22,$23
      )
      RETURNING id;
    `;

    const projectRes = await pool.query(insertProjectQ, [
      body.projectName.trim(),
      body.projectCode.trim().toUpperCase(),
      body.description || null,
      body.category,
      body.priority || "medium",
      body.status || "planning",

      body.kickoffDate,
      body.startDate,
      body.estimatedEndDate,
      body.actualEndDate || null,

      body.billingType || "fixed",
      body.totalBudget ? Number(body.totalBudget) : null,
      body.hourlyRate ? Number(body.hourlyRate) : null,
      body.currency || "INR",
      body.paymentTerms || null,

      body.clientName.trim(),
      body.clientEmail || null,

      body.productionServer || null,
      body.stagingServer || null,
      body.domain || null,
      body.hosting || null,
      body.cicd || null,
      body.monitoring || null,
    ]);

    const projectId = projectRes.rows[0].id;

    // milestones
    for (const m of milestones) {
      if (!m?.name || !m?.date) continue;
      await pool.query(
        `INSERT INTO project_milestones (project_id, name, milestone_date, description)
         VALUES ($1,$2,$3,$4)`,
        [projectId, String(m.name).trim(), m.date, m.description || null]
      );
    }

    // tech stack rows
    const techRows = [
      ...frontend.map((t) => ["frontend", t]),
      ...backend.map((t) => ["backend", t]),
      ...database.map((t) => ["database", t]),
      ...deployment.map((t) => ["deployment", t]),
      ...otherTools.map((t) => ["otherTools", t]),
    ];

    for (const [cat, tech] of techRows) {
      if (!tech) continue;
      await pool.query(
        `INSERT INTO project_tech (project_id, category, tech)
         VALUES ($1,$2,$3)
         ON CONFLICT DO NOTHING`,
        [projectId, cat, tech]
      );
    }

    // team assignment
    for (const empId of assignedEmployees) {
      await pool.query(
        `INSERT INTO project_team (project_id, project_manager_id, team_lead_id, employee_id)
         VALUES ($1,$2,$3,$4)
         ON CONFLICT DO NOTHING`,
        [projectId, body.projectManager ? Number(body.projectManager) : null, body.teamLead ? Number(body.teamLead) : null, Number(empId)]
      );
    }

    return json({ error: 0, id: projectId }, { status: 201 });
  } catch (err) {
    console.log('error in add project',err)
    const msg =
      (err && typeof err.message === "string" && err.message) ||
      "Server error";
    return json({ error: 1, errorMsg: msg }, { status: 500 });
  }
}

export async function GET({ url }) {
  try {
    const q = String(url.searchParams.get("q") || "").trim();
    const status = String(url.searchParams.get("status") || "all").trim(); // all|active|planning|on-hold|completed
    const sort = String(url.searchParams.get("sort") || "recent").trim();  // recent|progress|budget|deadline|name
    const limit = Math.min(Number(url.searchParams.get("limit") || 100), 200);
    const offset = Math.max(Number(url.searchParams.get("offset") || 0), 0);

    const where = [];
    const params = [];
    let i = 1;

    if (status && status !== "all") {
      params.push(status);
      where.push(`p.status = $${i}`);
      i++;
    }

    if (q) {
      params.push(`%${q}%`);
      where.push(`(
        p.project_name ILIKE $${i} OR
        p.project_code ILIKE $${i} OR
        COALESCE(p.client_name,'') ILIKE $${i} OR
        COALESCE(p.category,'') ILIKE $${i}
      )`);
      i++;
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    // sorting
    let orderBy = `p.created_at DESC`;
    if (sort === "name") orderBy = `p.project_name ASC`;
    if (sort === "budget") orderBy = `COALESCE(p.total_budget,0) DESC`;
    if (sort === "deadline") orderBy = `p.estimated_end_date ASC NULLS LAST`;
    if (sort === "recent") orderBy = `p.start_date DESC NULLS LAST`;
    // progress is derived (based on tasks table normally). Here fallback = 0; you can update later.
    if (sort === "progress") orderBy = `p.created_at DESC`;

    params.push(limit);
    params.push(offset);

    // Projects list + tech + team (aggregated)
    const listQ = `
      SELECT
        p.id,
        p.project_name,
        p.project_code,
        p.description,
        p.status,
        p.priority,
        p.category,
        p.start_date,
        p.estimated_end_date,
        p.total_budget,
        p.client_name,

        -- tech list
        COALESCE(
          (SELECT json_agg(t.tech ORDER BY t.tech)
           FROM project_tech t
           WHERE t.project_id = p.id),
          '[]'::json
        ) AS tech,

        -- team (join employees table)
        COALESCE(
          (SELECT json_agg(
            json_build_object(
              'id', e.id,
              'name', e.name,
              'avatar', COALESCE(e.avatar, substring(e.name,1,1)),
              'role', e.role
            )
            ORDER BY e.name
          )
          FROM project_team pt
          JOIN employees e ON e.id = pt.employee_id
          WHERE pt.project_id = p.id),
          '[]'::json
        ) AS team

      FROM projects p
      ${whereSql}
      ORDER BY ${orderBy}
      LIMIT $${i} OFFSET $${i + 1};
    `;

    const countQ = `
      SELECT COUNT(*)::bigint AS total
      FROM projects p
      ${whereSql};
    `;

    // Stats (global, not filtered) - you can change to filtered if you want
    const statsQ = `
      SELECT
        COUNT(*)::bigint AS total_projects,
        COUNT(*) FILTER (WHERE status = 'active')::bigint AS active_projects,
        COUNT(*) FILTER (WHERE status = 'completed')::bigint AS completed_projects,
        COALESCE(SUM(COALESCE(total_budget,0)),0)::numeric AS total_budget
      FROM projects;
    `;

    const [listRes, countRes, statsRes] = await Promise.all([
      pool.query(listQ, params),
      pool.query(countQ, params.slice(0, params.length - 2)),
      pool.query(statsQ, []),
    ]);

    const statsRow = statsRes.rows[0] || {};
    return json({
      error: 0,
      total: Number(countRes.rows[0]?.total || 0),
      limit,
      offset,
      stats: {
        totalProjects: Number(statsRow.total_projects || 0),
        activeProjects: Number(statsRow.active_projects || 0),
        completedProjects: Number(statsRow.completed_projects || 0),
        totalBudget: Number(statsRow.total_budget || 0),
        // until tasks table: keep averageProgress = 0 or compute from stored field if you add it later
        averageProgress: 0
      },
      data: listRes.rows
    });
  } catch (err) {
    return json({ error: 1, errorMsg: err?.message || "Server error" }, { status: 500 });
  }
}
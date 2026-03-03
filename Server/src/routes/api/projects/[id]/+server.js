import { pool } from "$lib/server/pgdb";
import { json } from "@sveltejs/kit";

export async function PUT({ params, request }) {
    const id = Number(params.id);
    if (!Number.isFinite(id)) return json({ error: 1, errorMsg: "Invalid id" }, { status: 400 });

    try {
        const body = await request.json();

        // update only main project fields here (keep it simple)
        await pool.query(
            `UPDATE projects
       SET project_name=$1, description=$2, category=$3, priority=$4, status=$5,
           kickoff_date=$6, start_date=$7, estimated_end_date=$8, actual_end_date=$9,
           billing_type=$10, total_budget=$11, hourly_rate=$12, currency=$13, payment_terms=$14,
           client_name=$15, client_email=$16,
           production_server=$17, staging_server=$18, domain=$19, hosting=$20, cicd=$21, monitoring=$22
       WHERE id=$23`,
            [
                body.projectName?.trim() || null,
                body.description || null,
                body.category || null,
                body.priority || "medium",
                body.status || "planning",
                body.kickoffDate || null,
                body.startDate || null,
                body.estimatedEndDate || null,
                body.actualEndDate || null,
                body.billingType || "fixed",
                body.totalBudget ? Number(body.totalBudget) : null,
                body.hourlyRate ? Number(body.hourlyRate) : null,
                body.currency || "INR",
                body.paymentTerms || null,
                body.clientName?.trim() || null,
                body.clientEmail || null,
                body.productionServer || null,
                body.stagingServer || null,
                body.domain || null,
                body.hosting || null,
                body.cicd || null,
                body.monitoring || null,
                id,
            ]
        );

        return json({ error: 0 }, { status: 200 });
    } catch (err) {
        return json({ error: 1, errorMsg: err?.message || "Server error" }, { status: 500 });
    }
}



export async function GET({ params }) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) return json({ error: 1, errorMsg: 'Invalid id' }, { status: 400 });

  const client = await pool.connect();
  try {
    const pRes = await client.query(
      `SELECT * FROM projects WHERE id = $1 LIMIT 1`,
      [id]
    );

    if (pRes.rowCount === 0) {
      return json({ error: 1, errorMsg: 'Project not found' }, { status: 404 });
    }

    const p = pRes.rows[0];

    // ✅ build response with SAFE fallbacks (no missing columns crash)
    const data = {
      id: p.id,
      name: p.project_name ?? p.name ?? '',
      description: p.description ?? '',
      status: p.status ?? 'planning',
      priority: p.priority ?? 'medium',
      progress: Number(p.progress ?? 0),
      startDate: p.start_date ?? p.startdate ?? null,
      dueDate: p.due_date ?? p.end_date ?? p.estimated_end_date ?? null,
      budget: Number(p.total_budget ?? p.budget ?? 0),
      spent: 0, // later compute from expenses/tasks table if you have one

      // optional fields (will be empty if not in table)
      category: p.category ?? '',
      icon: p.icon ?? '📁',
      tech: p.tech_stack ?? p.tech ?? [],
      client: p.client_name ?? p.client ?? '',

      // keep shape for UI even if DB doesn’t store it
      clientContact: {
        name: '',
        email: '',
        phone: ''
      },
      team: [],
      tasks: { total: 0, completed: 0, inProgress: 0, pending: 0, list: [] },
      milestones: [],
      timeline: [],
      files: [],
      metrics: { codeCommits: 0, pullRequests: 0, issuesResolved: 0, testCoverage: 0, performanceScore: 0 }
    };

    return json({ error: 0, data });
  } catch (e) {
    console.error(e);
    return json({ error: 1, errorMsg: e.message }, { status: 500 });
  } finally {
    client.release();
  }
}
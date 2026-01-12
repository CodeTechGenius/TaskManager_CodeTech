// import pkg from 'pg';
// import { DATABASE_URL } from '$env/static/private';

// const { Pool } = pkg;

// export const pool = new Pool({
//   connectionString: DATABASE_URL,
//   ssl: { rejectUnauthorized: false },

//   // 🔥 FORCE IPv4
//   family: 4
// });

///
// import pkg from 'pg';
// import { DATABASE_URL } from '$env/static/private';

// const { Pool } = pkg;

// export const pool = new Pool({
//   connectionString: DATABASE_URL,
//   ssl: { rejectUnauthorized: false }
// });

import pg from 'pg';
import { DATABASE_URL } from '$env/static/private';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  family: 4 // ✅ FORCE IPv4 (fixes ENETUNREACH)
});

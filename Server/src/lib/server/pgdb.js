
// src/lib/db.js
import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
    connectionString:'postgresql://taskuser:code11tech%402026@3.108.40.36:5432/taskdb',
});

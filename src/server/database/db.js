import { createPool } from "mysql2/promise";

export const pool = await createPool({
    user: 'root',
    password: 'Sanmartin3423!',
    host: 'localhost',
    database: 'aventura_gramatical'
})

import { query } from "../config/database";

export interface Context {
    context_id_no: number;
    context_desc: string | null;
}

export async function getAllContexts(): Promise<Context[]> {
    const sql = "SELECT context_id_no, context_desc FROM context";
    return query<Context[]>(sql);
}

export async function getContextById(id: number): Promise<Context | null> {
    const sql = "SELECT context_id_no, context_desc FROM context WHERE context_id_no = ?";
    const results = await query<Context[]>(sql, [id]);
    return results.length > 0 ? results[0] : null;
}

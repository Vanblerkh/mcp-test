import { query } from "../config/database";

export interface User {
    user_id: number;
    email: string;
    username: string;
    password_hash: string;
    first_name: string | null;
    last_name: string | null;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface CreateUserInput {
    email: string;
    username: string;
    password_hash: string;
    first_name?: string;
    last_name?: string;
}

export interface UpdateUserInput {
    email?: string;
    username?: string;
    password_hash?: string;
    first_name?: string;
    last_name?: string;
    is_active?: boolean;
}

export async function getAllUsers(): Promise<User[]> {
    const sql = "SELECT * FROM user";
    return query<User[]>(sql);
}

export async function getUserById(id: number): Promise<User | null> {
    const sql = "SELECT * FROM user WHERE user_id = ?";
    const results = await query<User[]>(sql, [id]);
    return results.length > 0 ? results[0] : null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
    const sql = "SELECT * FROM user WHERE email = ?";
    const results = await query<User[]>(sql, [email]);
    return results.length > 0 ? results[0] : null;
}

export async function getUserByUsername(username: string): Promise<User | null> {
    const sql = "SELECT * FROM user WHERE username = ?";
    const results = await query<User[]>(sql, [username]);
    return results.length > 0 ? results[0] : null;
}

export async function createUser(input: CreateUserInput): Promise<number> {
    const sql = `
        INSERT INTO user (email, username, password_hash, first_name, last_name)
        VALUES (?, ?, ?, ?, ?)
    `;
    const result = await query<any>(sql, [
        input.email,
        input.username,
        input.password_hash,
        input.first_name || null,
        input.last_name || null
    ]);
    return result.insertId;
}

export async function updateUser(id: number, input: UpdateUserInput): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];

    if (input.email !== undefined) {
        fields.push("email = ?");
        values.push(input.email);
    }
    if (input.username !== undefined) {
        fields.push("username = ?");
        values.push(input.username);
    }
    if (input.password_hash !== undefined) {
        fields.push("password_hash = ?");
        values.push(input.password_hash);
    }
    if (input.first_name !== undefined) {
        fields.push("first_name = ?");
        values.push(input.first_name);
    }
    if (input.last_name !== undefined) {
        fields.push("last_name = ?");
        values.push(input.last_name);
    }
    if (input.is_active !== undefined) {
        fields.push("is_active = ?");
        values.push(input.is_active ? 1 : 0);
    }

    if (fields.length === 0) {
        return false;
    }

    values.push(id);
    const sql = `UPDATE user SET ${fields.join(", ")} WHERE user_id = ?`;
    const result = await query<any>(sql, values);
    return result.affectedRows > 0;
}

export async function deleteUser(id: number): Promise<boolean> {
    const sql = "DELETE FROM user WHERE user_id = ?";
    const result = await query<any>(sql, [id]);
    return result.affectedRows > 0;
}

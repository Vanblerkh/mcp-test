import { query } from "../config/database";

export interface Product {
    product_id: number;
    name: string;
    description: string | null;
    price: number;
    stock_quantity: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface CreateProductInput {
    name: string;
    description?: string;
    price: number;
    stock_quantity?: number;
}

export interface UpdateProductInput {
    name?: string;
    description?: string;
    price?: number;
    stock_quantity?: number;
    is_active?: boolean;
}

export async function getAllProducts(): Promise<Product[]> {
    const sql = "SELECT * FROM product";
    return query<Product[]>(sql);
}

export async function getActiveProducts(): Promise<Product[]> {
    const sql = "SELECT * FROM product WHERE is_active = 1";
    return query<Product[]>(sql);
}

export async function getProductById(id: number): Promise<Product | null> {
    const sql = "SELECT * FROM product WHERE product_id = ?";
    const results = await query<Product[]>(sql, [id]);
    return results.length > 0 ? results[0] : null;
}

export async function createProduct(input: CreateProductInput): Promise<number> {
    const sql = `
        INSERT INTO product (name, description, price, stock_quantity)
        VALUES (?, ?, ?, ?)
    `;
    const result = await query<any>(sql, [
        input.name,
        input.description || null,
        input.price,
        input.stock_quantity || 0
    ]);
    return result.insertId;
}

export async function updateProduct(id: number, input: UpdateProductInput): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];

    if (input.name !== undefined) {
        fields.push("name = ?");
        values.push(input.name);
    }
    if (input.description !== undefined) {
        fields.push("description = ?");
        values.push(input.description);
    }
    if (input.price !== undefined) {
        fields.push("price = ?");
        values.push(input.price);
    }
    if (input.stock_quantity !== undefined) {
        fields.push("stock_quantity = ?");
        values.push(input.stock_quantity);
    }
    if (input.is_active !== undefined) {
        fields.push("is_active = ?");
        values.push(input.is_active ? 1 : 0);
    }

    if (fields.length === 0) {
        return false;
    }

    values.push(id);
    const sql = `UPDATE product SET ${fields.join(", ")} WHERE product_id = ?`;
    const result = await query<any>(sql, values);
    return result.affectedRows > 0;
}

export async function deleteProduct(id: number): Promise<boolean> {
    const sql = "DELETE FROM product WHERE product_id = ?";
    const result = await query<any>(sql, [id]);
    return result.affectedRows > 0;
}

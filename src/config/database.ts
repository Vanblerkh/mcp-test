import mysql from "mysql2";
import yaml from "js-yaml";
import fs from "fs";
import path from "path";

export interface DatabaseConfig {
    host: string;
    user: string;
    password: string;
    database: string;
    connectionLimit?: number;
}

function loadDbConfig(): DatabaseConfig {
    const secretsPath = process.env.DB_SECRETS_PATH;
    
    if (secretsPath) {
        const configFilePath = path.join(secretsPath, "db-config.yaml");
        if (fs.existsSync(configFilePath)) {
            const configFile = fs.readFileSync(configFilePath, "utf8");
            const fileConfig = yaml.load(configFile) as Partial<DatabaseConfig>;
            return {
                host: fileConfig.host || "localhost",
                user: fileConfig.user || "root",
                password: fileConfig.password || "",
                database: fileConfig.database || "mcp_test",
                connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || "10", 10)
            };
        }
    }
    
    // Fallback to env vars
    return {
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "mcp_test",
        connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || "10", 10)
    };
}

const dbConfig = loadDbConfig();

const pool = mysql.createPool(dbConfig);

export function query<T>(sql: string, values?: any[]): Promise<T> {
    return new Promise((resolve, reject) => {
        pool.query(sql, values, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results as T);
            }
        });
    });
}

export function closePool(): Promise<void> {
    return new Promise((resolve, reject) => {
        pool.end((err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

export default pool;

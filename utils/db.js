import mysql from "mysql2";

export const mysqlPool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "", 
    database: "lms_app_1",
});
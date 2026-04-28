import mysql from "mysql2";

export const mysqlPool = mysql.createPool({// export mean u can use mysqlPool in other file
    host: "localhost",
    user: "root",
    password: "", 
    database: "lms_app_1",
});
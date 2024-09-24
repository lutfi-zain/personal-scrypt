const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

// Database connection configuration
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'mssql',
});

async function downloadAllStoredProcedures() {
    try {
        // Authenticate with the database
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Get the database name
        const databaseName = sequelize.getDatabaseName();

        // Ensure the folder named after the database exists
        const folderPath = path.join(__dirname, databaseName);
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }

        // Query to get all stored procedures in the dbo schema
        const [results] = await sequelize.query(`
            SELECT ROUTINE_NAME, ROUTINE_DEFINITION
            FROM INFORMATION_SCHEMA.ROUTINES
            WHERE ROUTINE_TYPE = 'PROCEDURE' AND ROUTINE_SCHEMA = 'dbo'
        `);

        // Write each stored procedure to a separate file
        for (const procedure of results) {
            const filePath = path.join(folderPath, `${procedure.ROUTINE_NAME}.sql`);
            const routineDefinition = procedure.ROUTINE_DEFINITION || '-- No definition available';
            fs.writeFileSync(filePath, routineDefinition);
            console.log(`Stored procedure ${procedure.ROUTINE_NAME} written to ${filePath}`);
        }

        console.log('All stored procedures downloaded successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        // Close the database connection
        await sequelize.close();
    }
}

downloadAllStoredProcedures();
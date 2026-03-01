const sqlite3 = require('sqlite3').verbose(); // importing the sqlite3 package

// Creating the SQLite database file named university.db.
const db = new sqlite3.Database('./database/university.db', (err) => {
	if (err) {
		console.error('Error opening database:', err.message);
		return;
	}

	// Creating the courses table
	db.run(
		`DROP TABLE IF EXISTS courses`,
		(dropErr) => {
			if (dropErr) {
				console.error('Error dropping existing courses table:', dropErr.message);
				return;
			}

			db.run(
				`CREATE TABLE IF NOT EXISTS courses (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			course_code TEXT NOT NULL,
			title TEXT NOT NULL,
			credits INTEGER NOT NULL,
			description TEXT NOT NULL,
			semester TEXT NOT NULL
		)` ,
				(tableErr) => {
					if (tableErr) {
						console.error('Error creating courses table:', tableErr.message);
					} else {
						// Confirming successful database setup.
						console.log('Database university.db created successfully with courses table.');
					}

					// Closing the database connection when setup is complete.
					db.close((closeErr) => {
						if (closeErr) {
							console.error('Error closing database:', closeErr.message);
						}
					});
				}
			);
		}
	);
});

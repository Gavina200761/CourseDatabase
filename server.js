const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const db = new sqlite3.Database('./database/university.db', (err) => {
	if (err) {
		console.error('Error connecting to database:', err.message);
	} else {
		console.log('Connected to university.db');
	}
});
// API endpoints for courses
app.get('/api/courses', (req, res) => { // Get all courses
	const sql = 'SELECT * FROM courses';

	db.all(sql, [], (err, rows) => {
		if (err) {
			return res.status(500).json({ error: err.message });
		}

		res.status(200).json(rows);
	});
});

app.get('/api/courses/:id', (req, res) => { // Get a specific course by ID
	const sql = 'SELECT * FROM courses WHERE id = ?';
	const { id } = req.params;

	db.get(sql, [id], (err, row) => {
		if (err) {
			return res.status(500).json({ error: err.message });
		}

		if (!row) {
			return res.status(404).json({ error: 'Course not found' });
		}

		res.status(200).json(row);
	});
});

app.post('/api/courses', (req, res) => { // Create a new course
	const { course_code, title, credits, description, semester } = req.body;

	if (!course_code || !title || credits === undefined || !description || !semester) {
		return res.status(400).json({
			error: 'course_code, title, credits, description, and semester are required'
		});
	}

	const sql = `
		INSERT INTO courses (course_code, title, credits, description, semester)
		VALUES (?, ?, ?, ?, ?)
	`;

	db.run(sql, [course_code, title, credits, description, semester], function onInsert(err) {
		if (err) {
			return res.status(500).json({ error: err.message });
		}

		res.status(201).json({
			id: this.lastID,
			course_code,
			title,
			credits,
			description,
			semester
		});
	});
});

app.put('/api/courses/:id', (req, res) => {
	const { id } = req.params;
	const { course_code, title, credits, description, semester } = req.body;

	if (!course_code || !title || credits === undefined || !description || !semester) {
		return res.status(400).json({
			error: 'course_code, title, credits, description, and semester are required'
		});
	}

	const sql = `
		UPDATE courses
		SET course_code = ?, title = ?, credits = ?, description = ?, semester = ?
		WHERE id = ?
	`;

	db.run(sql, [course_code, title, credits, description, semester, id], function onUpdate(err) {
		if (err) {
			return res.status(500).json({ error: err.message });
		}

		if (this.changes === 0) {
			return res.status(404).json({ error: 'Course not found' });
		}

		res.status(200).json({
			id: Number(id),
			course_code,
			title,
			credits,
			description,
			semester
		});
	});
});

app.delete('/api/courses/:id', (req, res) => { // Delete a course by ID
	const { id } = req.params;
	const sql = 'DELETE FROM courses WHERE id = ?';

	db.run(sql, [id], function onDelete(err) {
		if (err) {
			return res.status(500).json({ error: err.message });
		}

		if (this.changes === 0) {
			return res.status(404).json({ error: 'Course not found' });
		}

		res.status(200).json({ message: 'Course deleted successfully' });
	});
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});

process.on('SIGINT', () => {
	db.close((err) => {
		if (err) {
			console.error('Error closing database:', err.message);
		}
		process.exit(0);
	});
});

const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const dbPath = path.join(__dirname, "..", "distrimed.db");
const app = express();

app.use(express.json());
app.use(cors());

const db = new sqlite3.Database(dbPath);

const query = (sql, params = []) =>
	new Promise((resolve, reject) => {
		db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
	});

app.post("/register", async (req, res) => {

	const { name, email, password } = req.body.body;
	try {
		await query(
			"INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)",
			[uuidv4(), name, email, password]
		);
		res.json({ message: "Usuário cadastrado com sucesso!", status: 200 });
	} catch {
		res.status(400).json({ error: "E-mail já cadastrado" });
	}
});

app.post("/login", async (req, res) => {

	const { email, password } = req.body.body;
	const users = await query(
		"SELECT * FROM users WHERE email = ? AND password = ?",
		[email, password]
	);

	if (!users.length) {
		return res
			.status(400)
			.json({ error: "Credenciais inválidas", status: 401 });
	}

	res.json({
		status: 200,
		user: {
			email,
			password,
		},
	});
});

const getMeetings = async (req, res) => {
	const { room } = req.query;

	try {
		const meetings = await query("SELECT * FROM meetings WHERE room = ?", [
			room,
		]);
		res.json(meetings);
	} catch (error) {
		res.status(500).json({ error: "Erro ao buscar reuniões" });
	}
};

const getByEmail = async (req, res) => {
	console.log(req.query.email)
	const email  = req.query.email;

	try {
		const id = await query("SELECT id FROM users WHERE email = ?", [
			email
		]);
		res.json(id);
	} catch (error) {
		res.status(500).json({ error: "Erro ao buscar usuário" });
	}
};

const createMeeting = async (req, res) => {
	const realBody = req.body;
	try {
		const room = realBody.body.obj[0].room;
		console.log(room);
		await query("DELETE FROM meetings WHERE room = ?", [room]);

		const insertedMeetings = [];

		for (const meeting of realBody.body.obj) {
			console.log(meeting);
			const { id, user_id, room, start, end, title, email } = meeting;

			await query(
				"INSERT INTO meetings (id, user_id, room, start, end, title, email) VALUES (?, ?, ?, ?, ?, ?, ?)",
				[id, user_id, room, start, end, title, email]
			);

			insertedMeetings.push({ id, user_id, room, start, end, title });
		}
		res.json({ insertedMeetings });
	} catch (error) {
		console.error("Erro ao criar reunião:", error);
		res.status(500).json({ error: "Erro ao criar reunião" });
	}
};

app.post("/meetings", createMeeting);
app.get("/meetings", getMeetings);
app.get("/get-by-email", getByEmail);

app.listen(3000, () => console.log("API rodando na porta 3000"));

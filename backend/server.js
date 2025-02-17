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

const createMeeting = async (req, res) => {
	const realBody = req.body;
    console.log(realBody)

	try {
		const insertedMeetings = [];
        const { id, user_id, room, start, end, title, email } = realBody.body.obj;

        await query(
            "INSERT INTO meetings (id, user_id, room, start, end, title, email) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [id, user_id, room, start, end, title, email]
        );

        insertedMeetings.push({ id, user_id, room, start, end, title });
		res.json({ insertedMeetings });
	} catch (error) {
		console.error("Erro ao criar reunião:", error);
		res.status(500).json({ error: "Erro ao criar reunião" });
	}
};

const updateMeeting = async (req, res) => {
    const request = req.body;
    const toUpdate = request.body.meeting;

    console.log(toUpdate)
    if (!toUpdate || toUpdate.length === 0) {
        return res.status(400).json({ error: "Nenhuma reunião fornecida para atualização." });
    }

    try {
        const updatedMeetings = [];

        if (!toUpdate.publicId || !toUpdate.extendedProps.user_id) {
            console.warn("Reunião ignorada por falta de ID ou user_id:", toUpdate);
            return;
        }

        console.log(toUpdate.start,
            toUpdate.end)
        await query(
            "UPDATE meetings SET user_id = ?, room = ?, start = ?, end = ?, title = ?, email = ? WHERE id = ?",
            [
                toUpdate.extendedProps.user_id,
                toUpdate.extendedProps.room,
                toUpdate.start,
                toUpdate.end,
                toUpdate.title,
                toUpdate.extendedProps.email,
                toUpdate.publicId
            ]
        );

        updatedMeetings.push({ toUpdate });
    

        res.json({ toUpdate });
    } catch (error) {
        console.error("Erro ao atualizar reunião:", error);
        res.status(500).json({ error: "Erro ao atualizar reunião" });
    }
};

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

const deleteMeeting = async (req, res) => {
    try{
        await query("DELETE FROM meetings WHERE id = ?", [req.query.id]);
        res.json({ message: "Usuário deletado com sucesso!", status: 200 });
    } catch (error) {
        console.log(res)
    }
}

app.post("/meetings", createMeeting);
app.put("/meetings", updateMeeting);
app.get("/meetings", getMeetings);
app.delete("/meetings", deleteMeeting);

app.get("/get-by-email", getByEmail);

app.listen(3000, () => console.log("API rodando na porta 3000"));

require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
	host:process.env.DB_HOST,
	database:process.env.DB_DATABASE,
	user:process.env.DB_USER,
	password:process.env.DB_PASSWORD,
	ssl: {
		require: true,
	}
});

pool.connect().then(() => {
	console.log("Connected to PostgresSQL database");
});

async function addEvent(req, res) {
	const { title, description, year, period, month, day, country, city } = 
	req.body;
	try {
		const result = await pool.query(
			`INSERT INTO historical_events (title, description, year, period, month, day, country, city) 
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
			[title, description, year, period, month, day, country, city]
		);
		res.status(200).json(result.rows);	
	} catch (error) {
		res.status(500).send("Internal server error");
	}
}

async function getAllEvent(req, res) {
	console.log("Getting all events");
	try {
		const result = await pool.query("SELECT * FROM historical_events");
		
		res.status(201).json(result.rows);
	} catch (error) {
		res.status(500).send("Internal server error");
	}
}

async function updateEvent(req, res) {
	const id = req.params.id;
	const { title, description, year, period, month, day, country, city } = 
	req.body;

	try {
		const result = await pool.query(
			`UPDATE historical_events 
			SET title = $1, description = $2,
			year = $3, period = $4, month = $5, day = $6, 
			country = $7, city = $8 
			WHERE id = $9 RETURNING *`,
			[title, description, year, period, month, day, country, city, id]
		);
		res.status(200).json(result.rows);
	} catch (error) {
		res.status(500).send("Internal server error");
	}
}

async function deleteEvent(req, res) {
	const id = req.params.id;

	try {
		const result = await pool.query("DELETE FROM historical_events WHERE id = $1", [id]);
		res.status(200).send("Event deleted");
	} catch (error) {
		res.status(500).send("Internal server error");
	}
}

async function addMultiEvent(req, res){
	const events = req.body;
	try{
		for(const event of events){
			const { title, description, year, period, month, day, country, city } = event;
			await pool.query(
				`INSERT INTO historical_events (title, description, year, period, month, day, country, city) 
				VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
				[title, description, year, period, month, day, country, city]
			);
		}
		res.status(201).send("Events Added");
	}catch(error){
		res.status(500).send("Internal server error");
	}
}

async function getCountryEvent(req, res){
	const country = req.params.country;
	try{
		const result = await pool.query(
			`SELECT * FROM historical_events 
			WHERE country = $1`,
			[country]
		);
		res.status(200).json(result.rows);
	}catch(error){
		res.status(500).send("Internal server error");
	}
}

async function getPaginatedEvent(req, res){
	const page = parseInt(req.params.page);
	const pageSize = parseInt(req.params.pageSize);
	try{
		const offset = (page - 1) * pageSize;
		const limit = pageSize;
		const result = await pool.query(
			`SELECT * FROM historical_events 
			ORDER BY id
			OFFSET $1 LIMIT $2`,
			[offset, limit]
		);
		res.status(200).json(result.rows);
	}catch(error){
		res.status(500).send("Internal server error");
	}
}

module.exports = {
	addEvent,
	getAllEvent,
	updateEvent,
	deleteEvent,
	addMultiEvent,
	getCountryEvent,
	getPaginatedEvent,
};
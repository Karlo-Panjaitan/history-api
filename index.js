require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const eventRepo = require('./repositories/repository.event');

const port = process.env.DB_PORT;
const app = express();

//middleware
app.use(bodyParser.json());

//endpoints
app.post('/events', eventRepo.addEvent);
app.get('/events', eventRepo.getAllEvent);
app.put('/events/:id', eventRepo.updateEvent);
app.delete('/events/:id', eventRepo.deleteEvent);
app.post('/events/bulk', eventRepo.addMultiEvent);
app.get('/events/country/:country', eventRepo.getCountryEvent);
app.get('/events/paginate/:page/:pageSize', eventRepo.getPaginatedEvent);

app.listen(
	port, () => {
		console.log("Server is running and listening on port", port);
	}
);
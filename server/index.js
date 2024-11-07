const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();
const cors = require('cors');
require('dotenv').config()
// Middleware to parse JSON bodies
app.use(express.json());

app.use(cors({
	origin: ['http://localhost:3000', 'http://localhost:5173'], // Add your frontend URLs
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
	credentials: true
}));

// Database connection
const sequelize = new Sequelize(process.env.DATABASE_URL, {
	dialect: 'postgres',
	ssl: {
		require: true,
		rejectUnauthorized: false // Only needed if using self-signed certificates
	}
});

// Define the BucketListItem model
const BucketListItem = sequelize.define('BucketListItem', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	content: {
		type: DataTypes.STRING,
		allowNull: false
	},
	upvotes: {
		type: DataTypes.INTEGER,
		defaultValue: 0
	},
	downvotes: {
		type: DataTypes.INTEGER,
		defaultValue: 0
	}
});

// Sync the model with the database
sequelize.sync()
	.then(() => {
		console.log('Database synchronized');
	})
	.catch(err => {
		console.error('Error synchronizing database:', err);
	});

// Create endpoint
app.post('/bucket-list', async (req, res) => {
	try {
		const { content } = req.body;

		if (!content) {
			return res.status(400).json({ error: 'Content is required' });
		}

		const newItem = await BucketListItem.create({
			content: content
		});

		res.status(201).json(newItem);
	} catch (error) {
		console.error('Error creating bucket list item:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Update endpoint (for upvotes/downvotes)
app.put('/bucket-list/:id/vote', async (req, res) => {
	try {
		const { id } = req.params;
		const { isUpvote } = req.body;

		if (typeof isUpvote !== 'boolean') {
			return res.status(400).json({ error: 'isUpvote must be a boolean' });
		}

		const item = await BucketListItem.findByPk(id);

		if (!item) {
			return res.status(404).json({ error: 'Item not found' });
		}

		if (isUpvote) {
			item.upvotes += 1;
		} else {
			item.downvotes += 1;
		}

		await item.save();

		res.json(item);
	} catch (error) {
		console.error('Error updating bucket list item:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Optional: Get all items endpoint
app.get('/bucket-list', async (req, res) => {
	try {
		const items = await BucketListItem.findAll({
			order: [
				[sequelize.literal('(upvotes + downvotes)'), 'DESC']
			]
		});
		res.json(items);
	} catch (error) {
		console.error('Error fetching bucket list items:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});
// Delete endpoint
app.delete('/bucket-list/:id', async (req, res) => {
	try {
		const { id } = req.params;

		const item = await BucketListItem.findByPk(id);

		if (!item) {
			return res.status(404).json({ error: 'Item not found' });
		}

		await item.destroy();

		res.status(200).json({ message: 'Item deleted successfully' });
	} catch (error) {
		console.error('Error deleting bucket list item:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

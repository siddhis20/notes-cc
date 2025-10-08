import { Router } from 'express';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, PutCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { nanoid } from 'nanoid';

const router = Router();

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(ddbClient);
const tableName = process.env.TABLE_NAME || 'Notes';

function validateNotePayload(body) {
	const title = typeof body.title === 'string' ? body.title.trim() : '';
	const description = typeof body.description === 'string' ? body.description.trim() : '';
	if (!title) {
		return { valid: false, message: 'Title is required' };
	}
	return { valid: true, title, description };
}

// Convert a DynamoDB item using NoteId to API shape using noteId
function toApiNote(item) {
	if (!item) return null;
	return {
		noteId: item.NoteId,
		title: item.title,
		description: item.description,
		createdAt: item.createdAt,
		updatedAt: item.updatedAt
	};
}

router.post('/', async (req, res, next) => {
	try {
		const validation = validateNotePayload(req.body);
		if (!validation.valid) {
			return res.status(400).json({ success: false, message: validation.message });
		}

		const now = new Date().toISOString();
		const id = nanoid(12);

		// Store with partition key NoteId
		const item = {
			NoteId: id,
			title: validation.title,
			description: validation.description,
			createdAt: now,
			updatedAt: now
		};

		await docClient.send(new PutCommand({
			TableName: tableName,
			Item: item
		}));

		res.status(201).json({ success: true, data: toApiNote(item), message: 'Note created' });
	} catch (err) {
		next(err);
	}
});

router.get('/', async (req, res, next) => {
	try {
		const result = await docClient.send(new ScanCommand({ TableName: tableName }));
		const items = (result.Items || []).map(toApiNote);
		items.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
		res.json({ success: true, data: items });
	} catch (err) {
		next(err);
	}
});

router.put('/:id', async (req, res, next) => {
	try {
		const noteId = req.params.id;
		const validation = validateNotePayload(req.body);
		if (!validation.valid) {
			return res.status(400).json({ success: false, message: validation.message });
		}

		const now = new Date().toISOString();

		const updateResult = await docClient.send(new UpdateCommand({
			TableName: tableName,
			Key: { NoteId: noteId },
			UpdateExpression: 'SET #t = :t, #d = :d, #u = :u',
			ExpressionAttributeNames: {
				'#t': 'title',
				'#d': 'description',
				'#u': 'updatedAt'
			},
			ExpressionAttributeValues: {
				':t': validation.title,
				':d': validation.description,
				':u': now
			},
			ReturnValues: 'ALL_NEW'
		}));

		if (!updateResult.Attributes) {
			return res.status(404).json({ success: false, message: 'Note not found' });
		}

		res.json({ success: true, data: toApiNote(updateResult.Attributes), message: 'Note updated' });
	} catch (err) {
		next(err);
	}
});

router.delete('/:id', async (req, res, next) => {
	try {
		const noteId = req.params.id;
		await docClient.send(new DeleteCommand({ TableName: tableName, Key: { NoteId: noteId } }));
		res.json({ success: true, message: 'Note deleted' });
	} catch (err) {
		next(err);
	}
});

export default router;

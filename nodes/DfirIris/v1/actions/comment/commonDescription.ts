import type { INodeProperties } from 'n8n-workflow';

export const rObjectName: INodeProperties = {
	displayName: 'Object Name',
	name: 'obj_name',
	type: 'options',
	options: [
		{ name: 'Asset', value: 'assets' },
		// {name: "Event", value: "events"},
		// {name: "Evidence", value: "evidences"},
		{ name: 'IOC', value: 'ioc' },
		{ name: 'Note', value: 'notes' },
		{ name: 'Task', value: 'tasks' },
	],
	default: 'tasks',
	required: true,
};

export const rObjectId: INodeProperties = {
	displayName: 'Object ID',
	name: 'obj_id',
	type: 'string',
	default: '',
	required: true,
};

export const rCommentText: INodeProperties = {
	displayName: 'Comment Text',
	name: 'comment_text',
	type: 'string',
	typeOptions: {
		rows: 4,
	},
	default: '',
	required: true,
};

export const rCommentId: INodeProperties = {
	displayName: 'Comment ID',
	name: 'comment_id',
	type: 'string',
	default: '',
	required: true,
};

import type { INodeProperties } from 'n8n-workflow';

export const rFileId: INodeProperties = {
	displayName: 'File ID',
	name: 'file_id',
	type: 'number',
	default: '',
	required: true,
};

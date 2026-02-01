import type { INodeProperties } from 'n8n-workflow';


export const fileId: INodeProperties = {
	displayName: 'Evidence ID',
	name: 'evidenceId',
	type: 'number',
	default: 0,
}

export const fileName: INodeProperties = {
	displayName: 'Evidence File Name',
	name: 'filename',
	type: 'string',
	default: '',
};

export const fileSize: INodeProperties = {
	displayName: 'Evidence File Size',
	description: 'Size of the evidence file in bytes',
	name: 'file_size',
	type: 'number',
	default: 0,
};

export const fileHash: INodeProperties = {
	displayName: 'Evidence File Hash',
	name: 'file_hash',
	type: 'string',
	default: '',
};

export const fileDescription: INodeProperties = {
	displayName: 'Evidence File Description',
	name: 'file_description',
	type: 'string',
	default: '',
};
import type { INodeProperties } from 'n8n-workflow';


export const fileId: INodeProperties = {
	displayName: 'Evidence Name or ID',
	name: 'evidenceId',
	description: 
		'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	type: 'options',
	typeOptions: {
		loadOptionsMethod: 'getEvidences',
		loadOptionsDependsOn: ['cid'],
	},
	default: '',
}

export const fileName: INodeProperties = {
	displayName: 'Evidence File Name',
	name: 'filename',
	type: 'string',
	default: '',
	displayOptions: {
		hide: {
			parseBinary: [true],
		},
	}
};

export const fileSize: INodeProperties = {
	displayName: 'Evidence File Size',
	description: 'Size of the evidence file in bytes',
	name: 'file_size',
	type: 'number',
	default: 0,
	displayOptions: {
		hide: {
			parseBinary: [true],
		},
	}
};

export const fileHash: INodeProperties = {
	displayName: 'Evidence File Hash',
	name: 'file_hash',
	type: 'string',
	default: '',
	displayOptions: {
		hide: {
			parseBinary: [true],
		},
	}
};

export const fileDescription: INodeProperties = {
	displayName: 'Evidence File Description',
	name: 'file_description',
	type: 'string',
	default: '',
};
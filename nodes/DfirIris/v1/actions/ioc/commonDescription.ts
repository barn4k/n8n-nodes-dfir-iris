import type { INodeProperties } from 'n8n-workflow';

export const rIocId: INodeProperties = {
	displayName: 'IOC Name or ID',
	name: 'ioc_id',
	type: 'options',
	description:
		'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	typeOptions: {
		loadOptionsMethod: 'getIOCs',
		loadOptionsDependsOn: ['cid'],
	},
	default: '',
	required: true,
};

export const iocTLP: INodeProperties = {
	displayName: 'IOC TLP',
	name: 'ioc_tlp_id',
	type: 'options',
	options: [
		{ value: 1, name: 'Red' },
		{ value: 2, name: 'Amber' },
		{ value: 3, name: 'Green' },
		{ value: 4, name: 'Clear' },
		{ value: 5, name: 'Amber Strict' },
	],
	default: 1,
	description: 'IOC Name',
};

export const rIocTLP: INodeProperties = {
	displayName: 'IOC TLP',
	name: 'ioc_tlp_id',
	type: 'options',
	options: [
		{ value: 1, name: 'Red' },
		{ value: 2, name: 'Amber' },
		{ value: 3, name: 'Green' },
		{ value: 4, name: 'Clear' },
		{ value: 5, name: 'Amber Strict' },
	],
	default: 1,
	description: 'IOC Name',
	required: true,
};

export const iocType: INodeProperties = {
	displayName: 'IOC Type Name or ID',
	name: 'ioc_type_id',
	type: 'options',
	description:
		'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	typeOptions: {
		loadOptionsMethod: 'getIOCTypes',
	},
	default: '',
};

export const rIocType: INodeProperties = {
	displayName: 'IOC Type Name or ID',
	name: 'ioc_type_id',
	type: 'options',
	description:
		'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	typeOptions: {
		loadOptionsMethod: 'getIOCTypes',
	},
	default: '',
	required: true,
};

export const rIocDescription: INodeProperties = {
	displayName: 'IOC Description',
	name: 'ioc_description',
	type: 'string',
	default: '',
	required: true,
};

export const iocDescription: INodeProperties = {
	displayName: 'IOC Description',
	name: 'ioc_description',
	type: 'string',
	default: '',
};

export const iocValue: INodeProperties = {
	displayName: 'IOC Value',
	name: 'ioc_value',
	type: 'string',
	default: '',
};

export const rIocValue: INodeProperties = {
	displayName: 'IOC Value',
	name: 'ioc_value',
	type: 'string',
	default: '',
	required: true,
};

export const iocTags: INodeProperties = {
	displayName: 'IOC Tags',
	name: 'ioc_tags',
	type: 'string',
	validateType: 'string',
	ignoreValidationDuringExecution: true,
	default: '',
	description: 'IOC Tags, comma-separated',
};

export const rIocTags: INodeProperties = {
	displayName: 'IOC Tags',
	name: 'ioc_tags',
	type: 'string',
	validateType: 'string',
	ignoreValidationDuringExecution: true,
	default: '',
	description: 'IOC Tags, comma-separated',
	required: true,
};

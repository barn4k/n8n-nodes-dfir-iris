import type { INodeProperties } from 'n8n-workflow';

export interface IFolder {
	data: {
		[key: string]: IFolderSub;
	};
}

export interface IFolderSub {
	children?: {
		[key: string]: IFolderSub;
	};
	is_root?: boolean;
	name: string;
	type: 'directory' | 'file';
}

export const cidDescription: INodeProperties[] = [
	{
		displayName: 'Case ID',
		name: 'cid',
		type: 'number',
		default: 1,
		displayOptions: {
			show: {
				// operation: [
				// 	'get',
				// ],
				// resource: [
				// 	'note',
				// 	'task',
				// 	'comment',
				// 	'asset',
				// 	'alert',
				// 	'alert',
				// 	],
			},
		},
		required: true,
	},
];

export function fieldProperties(fields: string[]) {
	return [
		{
			displayName: 'Return Fields',
			name: 'fields',
			type: 'multiOptions',
			options: fields.map((f) => {
				return { name: f, value: f };
			}),
			default: [],
			description: 'Fields to be included',
		},
		{
			displayName: 'Exclude',
			name: 'inverseFields',
			type: 'boolean',
			options: fields.map((f) => {
				return { name: f, value: f };
			}),
			default: false,
			description: 'If the selected fields should be excluded instead',
		},
	] as INodeProperties[];
}

export const returnAllOrLimit: INodeProperties[] = [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		description: 'Max number of results to return',
	},
];

export const returnRaw: INodeProperties[] = [
	{
		displayName: 'Return Raw',
		name: 'isRaw',
		type: 'boolean',
		default: false,
		description: 'Return the raw response',
	},
];

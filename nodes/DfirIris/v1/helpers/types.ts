import type { INodeProperties, } from 'n8n-workflow';

export function fieldProperties(fields: string[]){
	return [
		{
			displayName: 'Return Fields',
			name: 'fields',
			type: 'multiOptions',
			options: fields.map( (f) => { return {name: f, value: f} } ),
			default: [],
			description: 'Fields to be included',
		},
		{
			displayName: 'Exclude',
			name: 'inverseFields',
			type: 'boolean',
			options: fields.map( (f) => { return {name: f, value: f} } ),
			default: false,
			description: 'if the selected fields should be excluded instead',
		},
	] as INodeProperties[]
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
		default: 100,
		description: 'Max number of results to return',
	},
];

export const returnRaw: INodeProperties[] = [
	{
		displayName: 'Return Raw',
		name: 'isRaw',
		type: 'boolean',
		default: false,
		description: 'return the raw response',
	},
];

import { INodeProperties, } from 'n8n-workflow';

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

export const noteFields: string[] = [
	"*",
	"directory",
	"note_id",
	"note_uuid",
	"note_title",
	"note_content",
	"note_user",
	"note_creationdate",
	"note_lastupdate",
	"note_case_id",
	"custom_attributes",
	"directory_id",
	"modification_history",
	"comments"
]

export const noteFieldsShort: string[] = [
	"*",
	"note_id",
	"note_title",
	"note_content",
	"custom_attributes",
]

// export const filterFields: INodeProperties[] = [
// 	{
// 		displayName: 'Return Fields',
// 		name: 'fields',
// 		type: 'string',
// 		description: 'List of comma-separated fields. add (!) in the beginning to exclude fields (e.g. !alert_id,alert_status). Wilcards also (*) supported',
// 		default: '',
// 	}
// ];

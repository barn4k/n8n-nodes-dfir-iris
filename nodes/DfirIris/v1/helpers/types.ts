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

export const taskFields = [
	'task_open_date',
	'task_userid_close',
	'task_last_update',
	'task_userid_update',
	'task_assignees',
	'task_title',
	'task_uuid',
	'task_tags',
	'task_id',
	'task_description',
	'task_userid_open',
	'custom_attributes',
	'task_status_id',
	'task_close_date',
	'task_case_id',
	'modification_history',
	'status_name',
	'status_bscolor',
].sort();

export const iocFields = [
	'ioc_description',
	'ioc_value',
	'ioc_type',
	'ioc_tags',
	'ioc_uuid',
	'ioc_enrichment',
	'ioc_id',
	'ioc_tlp_id',
	'user_id',
	'custom_attributes',
	'ioc_type_id',
	'ioc_misp',
].sort();

export const assetFields = [
	'asset_enrichment',
	'asset_type',
	'asset_type_id',
	'case_id',
	'asset_description',
	'asset_id',
	'analysis_status_id',
	'custom_attributes',
	'asset_info',
	'user_id',
	'date_added',
	'date_update',
	'asset_name',
	'asset_ip',
	'asset_tags',
	'asset_compromise_status_id',
	'asset_uuid',
	'asset_domain',
	'linked_ioc',
].sort();

export const datastoreFileFields: string[] = [
	'file_size',
	'file_is_ioc',
	'file_sha256',
	'file_is_evidence',
	'file_uuid',
	'file_case_id',
	'file_date_added',
	'file_parent_id',
	'added_by_user_id',
	'file_original_name',
	'file_tags',
	'modification_history',
	'file_id',
	'file_description',
	'file_password',
].sort();

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
			description: 'Whether the selected fields should be excluded instead',
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
		description: 'Whether to return the raw response',
	},
];

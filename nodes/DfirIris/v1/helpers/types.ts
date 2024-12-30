import type { INodeProperties, IDataObject } from 'n8n-workflow';

export interface IFolder {
	data: {
		[key: string]: IFolderSub;
	};
}

export interface INoteGroup {
	subdirectories: INoteGroup[] | [];
	id: number;
	name: string;
	note_count: number;
	notes: INoteSub[] | [];
}

interface INoteSub {
	id: number;
	title: string;
}

export interface IFolderSub {
	children?: {
		[key: string]: IFolderSub;
	};
	is_root?: boolean;
	name: string;
	type: 'directory' | 'file';
}

export interface IIOC extends IDataObject {
	ioc_value: string;
	ioc_tlp_id: number;
	ioc_type_id: number;
	ioc_description?: string;
	ioc_tags?: string;
	ioc_enrichment?: object;
}

export interface IAsset extends IDataObject {
	asset_name: string;
	asset_type_id: number;
	asset_description?: string;
	asset_ip?: string;
	asset_domain?: string;
	asset_tags?: string;
	asset_enrichment?: object;
}

export interface IAlert extends IDataObject {
	alert_id?: number;
	alert_title?: string;
	alert_description?: string;
	alert_source?: string;
	alert_source_ref?: string;
	alert_source_link?: string;
	alert_severity_id?: number;
	alert_status_id?: number;
	alert_context?: object;
	alert_source_event_time?: string;
	alert_note?: string;
	alert_tags?: string;
	alert_iocs?: Array<IIOC>;
	alert_assets?: Array<IAsset>;
	alert_customer_id?: number;
	alert_classification_id?: number;
	alert_source_content?: object;
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

export const noteFields: string[] = [
	'directory',
	'note_id',
	'note_uuid',
	'note_title',
	'note_content',
	'note_user',
	'note_creationdate',
	'note_lastupdate',
	'note_case_id',
	'custom_attributes',
	'directory_id',
	'modification_history',
].sort();

export const commentFields: string[] = [
	'comment_date',
	'comment_id',
	'comment_text',
	'comment_update_date',
	'comment_uuid',
	'name',
	'user',
].sort();

export const alertFields: string[] = [
	'owner',
	'alert_note',
	'alert_source',
	'alert_title',
	'modification_history',
	'assets',
	'classification',
	'alert_id',
	'alert_source_link',
	'severity',
	'iocs',
	'alert_context',
	'alert_classification_id',
	'alert_source_content',
	'alert_tags',
	'alert_severity_id',
	'alert_source_ref',
	'alert_status_id',
	'customer',
	'alert_owner_id',
	'alert_description',
	'alert_creation_time',
	'cases',
	'alert_source_event_time',
	'alert_customer_id',
	'status',
	'comments',
	'alert_uuid',
].sort();

export const caseFields: string[] = [
	'case_name',
	'case_customer',
	'case_uuid',
	'case_description',
	'case_id',
	'open_date',
	'status_id',
	'modification_history',
	'case_soc_id',
	'state_id',
	'close_date',
	'classification_id',
	'closing_note',
	'owner_id',
	'user_id',
	'custom_attributes',
	'reviewer_id',
	'review_status_id',
	'severity_id',
].sort();

export const cidDescription: INodeProperties[] = [
	{
		displayName: 'Case ID',
		name: 'cid',
		type: 'number',
		default: 1,
		displayOptions: {
			// show: {
			// 	operation: [
			// 		'get',
			// 	],
			// 	resource: [
			// 		'note',
			// 		'task',
			// 		'comment',
			// 		'asset',
			// 		'alert',
			// 		'alert',
			// 		],
			// },
			hide: {
				resource: ['alert'],
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

export const alertStatus: INodeProperties[] = [
	{
		displayName: 'Alert Status',
		name: 'alert_status_id',
		type: 'options',
		options: [
			{
				name: 'Unspecified',
				value: 1,
			},
			{
				name: 'New',
				value: 2,
			},
			{
				name: 'Assigned',
				value: 3,
			},
			{
				name: 'In Progress',
				value: 4,
			},
			{
				name: 'Pending',
				value: 5,
			},
			{
				name: 'Closed',
				value: 6,
			},
			{
				name: 'Merged',
				value: 7,
			},
			{
				name: 'Escalated',
				value: 8,
			},
		],
		default: 1,
	},
];

export const alertSeverity: INodeProperties[] = [
	{
		displayName: 'Alert Severity',
		name: 'alert_severity_id',
		type: 'options',
		options: [
			{
				name: 'Low',
				value: 1,
			},
			{
				name: 'Medium',
				value: 2,
			},
			{
				name: 'High',
				value: 3,
			},
			{
				name: 'Critical',
				value: 4,
			},
		],
		default: 2,
	},
];

export const alertResolutionStatus: INodeProperties[] = [
	{
		displayName: 'Alert Resolution Status',
		name: 'alert_resolution_status_id',
		type: 'options',
		options: [
			{
				name: 'False Positive',
				value: 1,
			},
			{
				name: 'True Positive With Impact',
				value: 2,
			},
			{
				name: 'True Positive Without Impact',
				value: 3,
			},
			{
				name: 'Not Applicable',
				value: 4,
			},
			{
				name: 'Unknown',
				value: 5,
			},
		],
		default: 5,
	},
];

export const iocTLP: INodeProperties[] = [
	{
		displayName: 'IOC TLP',
		name: 'tlpId',
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
	},
];

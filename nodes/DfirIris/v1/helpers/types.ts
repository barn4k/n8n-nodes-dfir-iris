import type { INodeProperties, IDataObject } from 'n8n-workflow';

export interface IFolder {
	data: {
		[key: string]: IFolderSub | IFileSub;
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
	children: {
		[key: string]: IFolderSub | IFileSub;
	};
	is_root?: boolean;
	name: string;
	type: 'directory';
}


export interface ICustomAttributeContent {
	[tab: string]: {
		[field: string]: {
			type: string
			mandatory: boolean
			value: any
		}
	}
}

export interface ICustomAttributeContentResponse {
	[tab: string]: {
		[field: string]:  any
	}
}

export type TCustomAttributeNames = "IOC"| "Events" | "Assets" | "Tasks" | "Notes" | "Evidences" | "Customers" | "Cases"

export interface ICustomAttribute {
	attribute_id: number,
	attribute_display_name: TCustomAttributeNames
	attribute_description: string
	attribute_content: ICustomAttributeContent
	attribute_for: string
}

export interface IFileSub {
	file_parent_id: number
	file_description: string
	modification_history: any
	file_date_added: string
	added_by_user_id: number
	file_id: number
	file_tags: string
	file_size: number
	file_case_id: number
	file_uuid: string
	file_is_ioc: string | undefined
	file_sha256: string
	file_is_evidence: string | undefined
	file_original_name: string
	file_password: string
	type: 'file'
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
	'alerts',
	'case_id',
	'case_uuid',
	'classification',
	'classification_id',
	'client',
	'client_id',
	'close_date',
	'closing_note',
	'custom_attributes',
	'description',
	'initial_date',
	'modification_history',
	'name',
	'open_date',
	'owner',
	'owner_id',
	'protagonists',
	'review_status',
	'review_status_id',
	'reviewer',
	'reviewer_id',
	'severity',
	'severity_id',
	'soc_id',
	'state',
	'state_id',
	'status_id',
	'status_name',
	'tags',
	'user',
	'user_id',
].sort();

export const cidDescription: INodeProperties[] = [
	{
		displayName: 'Case ID',
		name: 'cid',
		type: 'number',
		default: '',
		displayOptions: {
			hide: {
				resource: ['alert', 'case'],
			},
		},
		required: true,
	},
];

export function fieldProperties(fields: string[] = []) {
	return [
		{
			displayName: 'Return Fields',
			name: 'fields',
			type: 'string',
			default: fields.sort().join(',\n'),
			typeOptions: {
				rows: fields.length > 10 ? 10 : fields.length < 4 ? 4 : fields.length,
			},
			description: 'Fields to be included',
		},
		{
			displayName: 'Exclude',
			name: 'inverseFields',
			type: 'boolean',
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

export const customAttributes: INodeProperties[] = [
	{
		displayName: 'Custom Attributes',
		name: 'custom_attributes',
		type: 'json',
		default: 0,
		description: 'Add custom attributes',
		displayOptions: {
			show: {
				'@version': [1]
			}
		}
	},
	{
	displayName: 'Custom Attributes (JSON)',
	name: 'custom_attributes',
	type: 'json',
	default: 0,
	description: 'Add custom attributes as JSON (without stringify). Will replace existing custom attributes.',
	displayOptions: {
		hide: {
			'@version': [1]
		}
	}
},
{
	displayName: 'Custom Attributes Write Mode',
	name: 'custom_attributes_mode',
	type: 'options',
	options: [
		{name: "Update", value: "update"},
		{name: "Rewrite", value: "rewrite"}
	],
	default: "update",
	description: 'Whether to update or rewrite custom attributes',
	displayOptions: {
		hide: {
			'@version': [1]
		}
	}
}
];

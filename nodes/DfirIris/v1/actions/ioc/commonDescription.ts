import type { INodeProperties } from 'n8n-workflow';
import { TLP } from '../../helpers/types';
// import { TLP, TLPName, TLPValue } from '../../helpers/types';

export const iocId: INodeProperties = {
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
};
export const iocTLP: INodeProperties = {
	displayName: 'IOC TLP',
	name: 'ioc_tlp_id',
	type: 'options',
	options: Object.entries(TLP).map(([name, value]) => ({ name, value })),
	default: '',
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

export const iocTags: INodeProperties = {
	displayName: 'IOC Tags',
	name: 'ioc_tags',
	type: 'string',
	validateType: 'string',
	ignoreValidationDuringExecution: true,
	default: '',
	description: 'IOC Tags, comma-separated',
};

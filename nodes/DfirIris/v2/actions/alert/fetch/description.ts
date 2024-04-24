import type { AlertProperties } from '../../Interfaces';

export const alertFetchDescription: AlertProperties = [
	{
		displayName: 'Alert ID',
		name: 'alertId',
		type: 'number',
		default: 1,
		required: true,
		displayOptions: {
			show: {
				operation: ['fetch'],
				resource: ['alert'],
			},
		},
	},
	{
		displayName: 'Options',
		name: 'options',
		placeholder: 'Add Option',
		type: 'collection',
		default: {},
		displayOptions: {
			show: {
				operation: ['fetch'],
				resource: ['alert'],
			},
			// hide: {
			// 	'@version': [204]
			// }
		},
		options: [
			{
				displayName: 'Return Fields',
				name: 'fields',
				type: 'string',
				description: 'List of comma-separated fields. add (!) in the beginning to exclude fields (e.g. !alert_id,alert_status). Wilcards (*) supported',
				default: '',
			}
		]
	},
];

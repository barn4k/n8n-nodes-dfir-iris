import type { INodeProperties } from 'n8n-workflow';

export const caseId: INodeProperties = {
	displayName: 'Case ID',
	name: 'case_id',
	type: 'number',
	default: '',
};

export const rCaseId: INodeProperties = {
	displayName: 'Case ID',
	name: 'case_id',
	type: 'number',
	default: '',
	required: true,
};

export const caseIds: INodeProperties = {
	displayName: 'Case IDs',
	name: 'case_ids',
	type: 'string',
	description: 'List of comma-separated case IDs',
	default: '',
};

export const caseSocId: INodeProperties = {
	displayName: 'Case SOC ID',
	name: 'case_soc_id',
	type: 'string',
	description: 'A SOC ticket reference',
	default: '',
};

export const rCaseSocId: INodeProperties = {
	displayName: 'Case SOC ID',
	name: 'case_soc_id',
	type: 'string',
	description: 'A SOC ticket reference',
	default: '',
	required: true,
};

export const caseCustomer: INodeProperties = {
	displayName: 'Case Customer Name or ID',
	name: 'case_customer',
	type: 'options',
	description:
		'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	typeOptions: {
		loadOptionsMethod: 'getCustomers',
	},
	default: '',
};

export const rCaseCustomer: INodeProperties = {
	displayName: 'Case Customer Name or ID',
	name: 'case_customer',
	type: 'options',
	description:
		'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	typeOptions: {
		loadOptionsMethod: 'getCustomers',
	},
	default: '',
	required: true,
};

export const caseName: INodeProperties = {
	displayName: 'Case Name',
	name: 'case_name',
	type: 'string',
	default: '',
};

export const rCaseName: INodeProperties = {
	displayName: 'Case Name',
	name: 'case_name',
	type: 'string',
	default: '',
	required: true,
};

export const caseDescription: INodeProperties = {
	displayName: 'Case Description',
	name: 'case_description',
	type: 'string',
	typeOptions: {
		rows: 4,
	},
	default: '',
	description: 'Minimum 2 characters',
};

export const rCaseDescription: INodeProperties = {
	displayName: 'Case Description',
	name: 'case_description',
	type: 'string',
	typeOptions: {
		rows: 4,
	},
	default: '',
	required: true,
	description: 'Minimum 2 characters',
};

export const caseClassification: INodeProperties = {
	displayName: 'Case Classification Name or ID',
	name: 'classification_id',
	type: 'options',
	description:
		'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	typeOptions: {
		loadOptionsMethod: 'getCaseClassifications',
	},
	default: '',
};

export const caseTemplateId: INodeProperties = {
	displayName: 'Case Template Name or ID',
	name: 'case_template_id',
	type: 'options',
	description:
		'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	typeOptions: {
		loadOptionsMethod: 'getCaseTemplates',
	},
	default: '',
};

export const caseOwner: INodeProperties = {
	displayName: 'Case Owner Name or ID',
	name: 'owner_id',
	type: 'options',
	typeOptions: {
		loadOptionsMethod: 'getUsers',
	},
	default: '',
	description:
		'To whom assign a case. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
};

export const caseOpeningUser: INodeProperties = {
	displayName: 'Case Opening User Name or ID',
	name: 'case_opening_user_id',
	type: 'options',
	typeOptions: {
		loadOptionsMethod: 'getUsers',
	},
	default: '',
	description:
		'Who opened the case. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
};

export const caseReviewer: INodeProperties = {
	displayName: 'Case Reviewer Name or ID',
	name: 'reviewer_id',
	type: 'options',
	typeOptions: {
		loadOptionsMethod: 'getUsers',
	},
	default: '',
	description:
		'Who will review the case. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
};

export const caseState: INodeProperties = {
	displayName: 'Case State Name or ID',
	name: 'state_id',
	type: 'options',
	description:
		'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	typeOptions: {
		loadOptionsMethod: 'getCaseState',
	},
	default: '',
};

export const caseStatus: INodeProperties = {
	displayName: 'Case Resolution Status',
	name: 'status_id',
	type: 'options',
	options: [
		{
			name: 'Unknown',
			value: 0,
		},
		{
			name: 'False Positive',
			value: 1,
		},
		{
			name: 'True Positive with Impact',
			value: 2,
		},
		{
			name: 'True Positive without Impact',
			value: 3,
		},
		{
			name: 'Not Applicable',
			value: 4,
		},
	],
	default: 1,
};

// export const caseSeverity: INodeProperties = {
// 	displayName: 'Case Severity',
// 	name: 'severity_id',
// 	type: 'options',
// 	options: [
// 		{
// 			name: 'Unspecified',
// 			value: 2,
// 		},
// 		{
// 			name: 'Informational',
// 			value: 3,
// 		},
// 		{
// 			name: 'Low',
// 			value: 4,
// 		},
// 		{
// 			name: 'Medium',
// 			value: 1,
// 		},
// 		{
// 			name: 'High',
// 			value: 5,
// 		},
// 		{
// 			name: 'Critical',
// 			value: 6,
// 		},
// 	],
// 	default: 2,
// };

export const caseSeverity: INodeProperties = {
	displayName: 'Case Severity Name or ID',
	name: 'severity_id',
	type: 'options',
	description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	typeOptions: {
		loadOptionsMethod: 'getSeverity',
	},
	default: '',
};

export const caseTags: INodeProperties = {
	displayName: 'Case Tags',
	name: 'case_tags',
	type: 'string',
	default: '',
	description: 'Comma-separated list of case tags',
};

export const caseOpenStartDate: INodeProperties = {
	displayName: 'Case Open Date Start',
	name: 'start_open_date', // should be 'alert_start_date', but it's not working
	type: 'dateTime',
	default: '',
	description:
		'Lower Boundary when case was openedTime of the Event in UTC according to RFC. Works only together with end date.',
	hint: 'e.g. 2023-03-26T03:00:30',
};

export const caseOpenEndDate: INodeProperties = {
	displayName: 'Case Open Date End',
	name: 'end_open_date', // should be 'alert_start_date', but it's not working
	type: 'dateTime',
	default: '',
	description:
		'Higher Boundary when case was opened in UTC according to RFC. Works only together with start date.',
	hint: 'e.g. 2023-03-26T03:00:30',
};

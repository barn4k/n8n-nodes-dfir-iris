import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class DfirIrisApi implements ICredentialType {
	name = 'dfirIrisApi';
	displayName = 'DFIR IRIS API';
	documentationUrl = 'https://docs.dfir-iris.org/latest/_static/iris_api_reference_v2.0.4.html';
	properties: INodeProperties[] = [
		{
			displayName: 'Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'get it from the Web console',
		},
		{
			displayName: 'Use HTTP',
			name: 'isHttp',
			type: 'boolean',
			default: false,
			description: "Whether to use HTTP instead of HTTPS"
		},
		{
			displayName: 'Host',
			name: 'host',
			type: 'string',
			default: '<yourserver.yourdomain>',
			description: 'The FQDN, not the URL',
		},
		{
			displayName: 'API Version',
			name: 'apiVersion',
			default: '2.0.4',
			type: 'options',
			description: 'The API version to use',
			options: [
				{
					name: 'v2.0.2',
					value: '2.0.2',
					description:
						'API for DFIR IRIS v2.3.x',
				},
				{
					name: 'v2.0.4',
					value: '2.0.4',
					description:
						'API for DFIR IRIS v2.4.x',
				},
			],
		},
		{
			displayName: 'Ignore SSL Issues',
			name: 'allowUnauthorizedCerts',
			type: 'boolean',
			description: 'Whether to connect even if SSL certificate validation is not possible',
			default: false,
			displayOptions: {
				show: {
					isHttp: [false],
				},
			},
		},
	];

	// This allows the credential to be used by other parts of n8n
	// stating how this credential is injected as part of the request
	// An example is the Http Request node that can make generic calls
	// reusing this credential
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '={{"Bearer " + $credentials.accessToken}}',
			},
		},
	};

	// The block below tells how this credential can be tested
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials?.isHttp ? "http://" : "https://" }}{{$credentials?.host}}',
			url: '/api/ping',
			skipSslCertificateValidation: '={{$credentials?.isHttp ? true : $credentials?.allowUnauthorizedCerts}}'
		},

	};
}


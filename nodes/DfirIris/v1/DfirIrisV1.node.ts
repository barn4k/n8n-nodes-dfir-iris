import type {
	IExecuteFunctions,
	INodeType,
	INodeTypeDescription,
	INodeTypeBaseDescription,
} from 'n8n-workflow';

import { router } from './actions/router';

import { versionDescription } from './actions/versionDescription';
import { loadOptions } from './methods';

// eslint-disable-next-line @n8n/community-nodes/icon-validation
export class DfirIrisV1 implements INodeType {
	description: INodeTypeDescription;
	// icon: string = 'file:icons/iris.svg';

	constructor(baseDescription: INodeTypeBaseDescription) {
		this.description = {
			...baseDescription,
			...versionDescription,
		};
	}

	methods = {
		loadOptions,
	};
	async execute(this: IExecuteFunctions) {
		return await router.call(this);
	}
}

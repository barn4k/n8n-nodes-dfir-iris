import type { INodeTypeBaseDescription, IVersionedNodeType } from 'n8n-workflow';
import { VersionedNodeType } from 'n8n-workflow';

import { DfirIrisV2 } from './v2/DfirIrisV2.node';

export class DfirIris extends VersionedNodeType {
	constructor() {
		const baseDescription: INodeTypeBaseDescription = {
			displayName: 'DFIR IRIS',
			name: 'dfirIris',
			icon: 'file:iris.svg',
			group: ['output'],
			subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
			description: 'works with DFIR IRIS IRP',
			defaultVersion: 202,
		};

		const nodeVersions: IVersionedNodeType['nodeVersions'] = {
			202: new DfirIrisV2(baseDescription),
			204: new DfirIrisV2(baseDescription),
		};

		super(nodeVersions, baseDescription);
	}
}

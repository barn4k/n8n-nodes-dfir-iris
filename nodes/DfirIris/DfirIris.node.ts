import type { INodeTypeBaseDescription, IVersionedNodeType } from 'n8n-workflow';
import { VersionedNodeType } from 'n8n-workflow';

import { DfirIrisV1 } from './v1/DfirIrisV1.node';

export class DfirIris extends VersionedNodeType {
	constructor() {
		const baseDescription: INodeTypeBaseDescription = {
			displayName: 'DFIR IRIS',
			name: 'dfirIris',
			icon: { light: "file:iris.svg", dark: "file:iris.svg"} as const,
			group: ['input'],
			subtitle: '={{ $parameter["resource"] + ": " + $parameter["operation"] }}',
			description: 'works with DFIR IRIS IRP',
			defaultVersion: 1.1,
		};

		const nodeVersions: IVersionedNodeType['nodeVersions'] = {
			1: new DfirIrisV1(baseDescription),
			1.1: new DfirIrisV1(baseDescription),
			// 2: new DfirIrisV2(baseDescription),
			// 2.1: new DfirIrisV2(baseDescription),
		};

		super(nodeVersions, baseDescription);
	}
}

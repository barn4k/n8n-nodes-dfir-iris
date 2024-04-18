import type { AllEntities, Entity, PropertiesOf } from 'n8n-workflow';

type DfirIrisMap = {
	// alert: 'fetch' | 'filter' | 'add' | 'update' | 'delete' | 'escalate' | 'merge' | 'unmerge';
	alert: 'add';
};

export type DfirIris = AllEntities<DfirIrisMap>;

export type DfirIrisAlert = Entity<DfirIrisMap, 'alert'>;
// export type DfirIrisMessage = Entity<MattermostMap, 'message'>;
// export type DfirIrisReaction = Entity<MattermostMap, 'reaction'>;
// export type DfirIrisUser = Entity<MattermostMap, 'user'>;

export type AlertProperties = PropertiesOf<DfirIrisAlert>;
// export type UserProperties = PropertiesOf<MattermostUser>;

export interface IAttachment {
	fields: {
		item?: object[];
	};
	actions: {
		item?: object[];
	};
}

export interface alertIOC {
	ioc_value: string,
	ioc_description?: string,
	ioc_tlp: number,
	ioc_type: number,
	ioc_tags: string,
	ioc_enrichment: object
}

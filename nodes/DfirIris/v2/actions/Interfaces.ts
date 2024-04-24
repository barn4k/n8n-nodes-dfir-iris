import type { AllEntities, Entity, PropertiesOf } from 'n8n-workflow';

type DfirIrisMap = {
	// alert: 'fetch' | 'filter' | 'add' | 'update' | 'delete' | 'escalate' | 'merge' | 'unmerge';
	alert: 'add' | 'fetch' | 'update';
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

export interface IKeypair {
	name: string
	value: string
}

export interface IIOC {
	ioc_value: string,
	ioc_tlp_id: number,
	ioc_type_id: number,
	ioc_description?: string,
	ioc_tags?: string,
	ioc_enrichment?: object
}

export interface IAsset {
	asset_name: string,
	asset_type_id: number,
	asset_description?: string,
	asset_ip?: string,
	asset_domain?: string,
	asset_tags?: string,
	asset_enrichment?: object
}

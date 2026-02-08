import type { IDataObject, ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';

import { NodeOperationError } from 'n8n-workflow';

import { apiRequest } from '../transport/index';
import { utils } from './../helpers';
import { getTLPName, IFolder, INoteGroup, TLPValue } from '../helpers/types';

export async function getUsers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const endpoint = 'case/users/list';

	const response = await apiRequest.call(this, 'GET', endpoint, {});
	if (response === undefined) {
		throw new NodeOperationError(this.getNode(), 'No data got returned');
	}

	const returnData: INodePropertyOptions[] = [];
	if (response.data && Array.isArray(response.data)) {
		(response.data as IDataObject[])
			.filter((x: IDataObject) => x.user_active)
			.forEach((row: IDataObject) => {
				returnData.push({
					name: `${row.user_name} ( ${row.user_email} )`,
					value: row.user_id as string | number,
				});
			});
	}

	returnData.sort((a, b) => {
		if (a.name < b.name) {
			return -1;
		}
		if (a.name > b.name) {
			return 1;
		}
		return 0;
	});

	return returnData;
}

export async function getAssets(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const query = { cid: this.getNodeParameter('cid') as number };

	const response = await apiRequest.call(this, 'GET', 'case/assets/list', {}, query);
	if (response === undefined) {
		throw new NodeOperationError(this.getNode(), 'No data got returned');
	}

	let returnData: INodePropertyOptions[] = [];
	if (response.data && typeof response.data === 'object' && 'assets' in response.data) {
		const data = response.data as IDataObject;
		returnData = (data.assets as IDataObject[]).map((asset: IDataObject) => {
			return {
				name: `${asset.asset_name} | ${asset.asset_type}`,
				value: asset.asset_id as string | number,
			};
		});
	}

	returnData.sort((a, b) => {
		if (a.name < b.name) {
			return -1;
		}
		if (a.name > b.name) {
			return 1;
		}
		return 0;
	});

	return returnData;
}

export async function getAssetTypes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const endpoint = 'manage/asset-type/list';

	const response = await apiRequest.call(this, 'GET', endpoint, {});
	if (response === undefined) {
		throw new NodeOperationError(this.getNode(), 'No data got returned');
	}

	const returnData: INodePropertyOptions[] = [];
	if (response.data && Array.isArray(response.data)) {
		(response.data as IDataObject[]).forEach((row: IDataObject) => {
			returnData.push({
				name: row.asset_name as string,
				value: row.asset_id as string | number,
			});
		});
	}

	returnData.sort((a, b) => {
		if (a.name < b.name) {
			return -1;
		}
		if (a.name > b.name) {
			return 1;
		}
		return 0;
	});

	return returnData;
}

export async function getTasks(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const query = { cid: this.getNodeParameter('cid') as number };

	const response = await apiRequest.call(this, 'GET', 'case/tasks/list', {}, query);
	if (response === undefined) {
		throw new NodeOperationError(this.getNode(), 'No data got returned');
	}

	let returnData: INodePropertyOptions[] = [];
	if (response.data && typeof response.data === 'object' && 'tasks' in response.data) {
		const data = response.data as IDataObject;
		returnData = (data.tasks as IDataObject[]).map((entity: IDataObject) => {
			return {
				name: `${entity.task_title} | ${entity.status_name}`,
				value: entity.task_id as string | number,
			};
		});
	}

	returnData.sort((a, b) => {
		if (a.name < b.name) {
			return -1;
		}
		if (a.name > b.name) {
			return 1;
		}
		return 0;
	});

	return returnData;
}

export async function getNoteGroups(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const query = { cid: this.getNodeParameter('cid') as number };

	const response = await apiRequest.call(this, 'GET', 'case/notes/directories/filter', {}, query);
	if (response === undefined) {
		throw new NodeOperationError(this.getNode(), 'No data got returned');
	}
	const returnData: INodePropertyOptions[] = utils.getNoteGroupsNested(this.logger, response.data as INoteGroup[]);

	return returnData;
}

export async function getNotes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const query = { cid: this.getNodeParameter('cid') as number };

	const response = await apiRequest.call(this, 'GET', 'case/notes/directories/filter', {}, query);
	if (response === undefined) {
		throw new NodeOperationError(this.getNode(), 'No data got returned');
	}
	const newData = utils.getFlattenGroups(this.logger, response.data as INoteGroup[]);

	const returnData: INodePropertyOptions[] = [];

	Object.values(newData).forEach((d) => {
		if (d && typeof d === 'object' && 'notes' in d && d.notes && typeof d.notes === 'object'){
			const notes = d.notes as IDataObject[]
			if (notes.length > 0)
				notes.map(
			(n: IDataObject) => returnData.push(
				{ name: `${n.title} (${(d as IDataObject).name})`, value: n.id as string | number }
			));
		}
		
	});
	return returnData;
}

export async function getIOCs(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const query = { cid: this.getNodeParameter('cid') as number };

	const response = await apiRequest.call(this, 'GET', 'case/ioc/list', {}, query);
	if (response === undefined) {
		throw new NodeOperationError(this.getNode(), 'No data got returned');
	}

	const returnData: INodePropertyOptions[] = [];
	if (response.data && typeof response.data === 'object' && 'ioc' in response.data ){
		const data = response.data.ioc as IDataObject[];
		data.forEach((row: IDataObject) => {
			returnData.push({
				name: `${row.ioc_value} | ${row.ioc_type} | ${getTLPName(row.ioc_tlp_id as TLPValue)}`,
				value: row.ioc_id as string | number,
			});
		});
	}

	returnData.sort((a, b) => {
		if (a.name < b.name) {
			return -1;
		}
		if (a.name > b.name) {
			return 1;
		}
		return 0;
	});

	return returnData;
}

export async function getEvidences(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const query = { cid: this.getNodeParameter('cid') as number };

	const response = await apiRequest.call(this, 'GET', 'case/evidences/list', {}, query);
	// const irisLogger = new utils.IrisLog(this.logger);
	// irisLogger.info('getEvidences response', {response});
	if (response === undefined) {
		throw new NodeOperationError(this.getNode(), 'No data got returned');
	}

	const returnData: INodePropertyOptions[] = [];
	if (response.data && typeof response.data === 'object' && 'evidences' in response.data ){
		const data = response.data.evidences as IDataObject[];
		data.forEach((row: IDataObject) => {
			const rowType = row.type as IDataObject;
			returnData.push({
				name: `${row.filename} | ${rowType?.name}`,
				value: row.id as string | number,
			});
		});
	}
	// irisLogger.info('getEvidences returnData', {returnData});

	returnData.sort((a, b) => {
		if (a.name < b.name) {
			return -1;
		}
		if (a.name > b.name) {
			return 1;
		}
		return 0;
	});

	return returnData;
}

export async function getEvidenceTypes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const query = { cid: this.getNodeParameter('cid') as number };

	const response = await apiRequest.call(this, 'GET', 'manage/evidence-types/list', {}, query);
	// const irisLogger = new utils.IrisLog(this.logger);
	// irisLogger.info('getEvidenceTypes response', {response});
	if (response === undefined) {
		throw new NodeOperationError(this.getNode(), 'No data got returned');
	}

	const returnData: INodePropertyOptions[] = [];
	if (response.data && typeof response.data === 'object' ){
		const data = response.data as IDataObject[];
		data.forEach((row: IDataObject) => {
			returnData.push({
				name: row.name as string,
				value: row.id as number,
			});
		});
	}
	returnData.sort((a, b) => {
		if (a.name < b.name) {
			return -1;
		}
		if (a.name > b.name) {
			return 1;
		}
		return 0;
	});

	return returnData;
}

export async function getIOCTypes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const endpoint = 'manage/ioc-types/list';

	const response = await apiRequest.call(this, 'GET', endpoint, {});
	if (response === undefined) {
		throw new NodeOperationError(this.getNode(), 'No data got returned');
	}

	const returnData: INodePropertyOptions[] = [];
	if (response.data && typeof response.data === 'object'){
		const data = response.data as IDataObject[];
		data.forEach((row: IDataObject) => {
			returnData.push({
				name: `${row.type_name} ( ${row.type_description} )`,
				value: row.type_id as string | number,
			});
		});
	}

	returnData.sort((a, b) => {
		if (a.name < b.name) {
			return -1;
		}
		if (a.name > b.name) {
			return 1;
		}
		return 0;
	});

	return returnData;
}

export async function getFolders(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const query = { cid: this.getNodeParameter('cid') as number };
	const irisLogger = new utils.IrisLog(this.logger);

	const response = await apiRequest.call(this, 'GET', 'datastore/list/tree', {}, query);
	if (response === undefined) {
		throw new NodeOperationError(this.getNode(), 'No data got returned');
	}

	irisLogger.info('getFolders responseData', {response});

	const returnData: INodePropertyOptions[] = utils.getFolderNested([], response.data as IFolder['data']);

	return returnData;
}

export async function getCustomers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const endpoint = 'manage/customers/list';

	const response = await apiRequest.call(this, 'GET', endpoint, {});
	if (response === undefined) {
		throw new NodeOperationError(this.getNode(), 'No data got returned');
	}

	const returnData: INodePropertyOptions[] = [];
	const data = response.data as IDataObject[];
		data.forEach((row: IDataObject) => {
		returnData.push({
			name: row.customer_name as string,
			value: row.customer_id as string | number,
		});
	});

	returnData.sort((a, b) => {
		if (a.name < b.name) {
			return -1;
		}
		if (a.name > b.name) {
			return 1;
		}
		return 0;
	});

	return returnData;
}

export async function getCaseClassifications(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const endpoint = 'manage/case-classifications/list';

	const response = await apiRequest.call(this, 'GET', endpoint, {});
	if (response === undefined) {
		throw new NodeOperationError(this.getNode(), 'No data got returned');
	}

	const returnData: INodePropertyOptions[] = [];

	if (response.data && typeof response.data === 'object'){
		const data = response.data as IDataObject[];
		data.forEach((row: IDataObject) => {
			returnData.push({
				name: row.name_expanded as string,
				value: row.id as string | number,
			});
		});
	}

	returnData.sort((a, b) => {
		if (a.name < b.name) {
			return -1;
		}
		if (a.name > b.name) {
			return 1;
		}
		return 0;
	});

	return returnData;
}

export async function getCaseState(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const endpoint = 'manage/case-states/list';

	const response = await apiRequest.call(this, 'GET', endpoint, {});
	const irisLogger = new utils.IrisLog(this.logger);
	if (response === undefined) {
		throw new NodeOperationError(this.getNode(), 'No data got returned');
	}

	irisLogger.info('getModules', {response});
	const returnData: INodePropertyOptions[] = [];
	if (response.data && typeof response.data === 'object'){
		const data = response.data as IDataObject[];
		data.forEach((row: IDataObject) => {
			returnData.push({
				name: row.state_name as string,
				value: row.state_id as string | number,
			});
		});
	}

	returnData.sort((a, b) => {
		if (a.name < b.name) {
			return -1;
		}
		if (a.name > b.name) {
			return 1;
		}
		return 0;
	});

	return returnData;
}

export async function getSeverity(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const endpoint = 'manage/severities/list';

	const response = await apiRequest.call(this, 'GET', endpoint, {});
	if (response === undefined) {
		throw new NodeOperationError(this.getNode(), 'No data got returned');
	}

	const returnData: INodePropertyOptions[] = [];
	if (response.data && typeof response.data === 'object'){
		const data = response.data as IDataObject[];
		data.forEach((row: IDataObject) => {
			returnData.push({
				name: row.severity_name as string,
				value: row.severity_id as string | number,
			});
		});
	}

	returnData.sort((a, b) => {
		if (a.name < b.name) {
			return -1;
		}
		if (a.name > b.name) {
			return 1;
		}
		return 0;
	});

	return returnData;
}


export async function getCaseTemplates(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const endpoint = 'manage/case-templates/list';

	const response = await apiRequest.call(this, 'GET', endpoint, {});
	if (response === undefined) {
		throw new NodeOperationError(this.getNode(), 'No data got returned');
	}

	const returnData: INodePropertyOptions[] = [];
	if (response.data && typeof response.data === 'object'){
		const data = response.data as IDataObject[];
		data.forEach((row: IDataObject) => {
			returnData.push({
				name: `${row.display_name} (prefix: ${row.title_prefix} )`,
				value: String(row.id),
			});
		});
	}

	returnData.sort((a, b) => {
		if (a.name < b.name) {
			return -1;
		}
		if (a.name > b.name) {
			return 1;
		}
		return 0;
	});

	return returnData;
}

export async function getModules(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const endpoint = `dim/hooks/options/${this.getNodeParameter('type')}/list`;
	const irisLogger = new utils.IrisLog(this.logger);

	const response = await apiRequest.call(this, 'GET', endpoint, {});
	if (response === undefined || null) {
		throw new NodeOperationError(this.getNode(), 'No data got returned');
	}
	irisLogger.info('getModules', {response});
	const returnData: INodePropertyOptions[] = [];

	if (response.data && typeof response.data === 'object'){
		const data = response.data as IDataObject[];
		data.forEach((row: IDataObject) => {
			returnData.push({
				name: `${row.manual_hook_ui_name} (${row.module_name})`,
				value: `${row.hook_name};${row.manual_hook_ui_name};${row.module_name}`,
			});
		});
	}
	

	returnData.sort((a, b) => {
		if (a.name < b.name) {
			return -1;
		}
		if (a.name > b.name) {
			return 1;
		}
		return 0;
	});

	return returnData;
}

export async function getTimelineEvent(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const endpoint = `case/timeline/advanced-filter`;
	const query = { cid: this.getNodeParameter('cid') as number, q: JSON.stringify({}) };

	const irisLogger = new utils.IrisLog(this.logger);

	const response = await apiRequest.call(this, 'GET', endpoint, {}, query);
	if (response === undefined || null) {
		throw new NodeOperationError(this.getNode(), 'No data got returned');
	}
	irisLogger.info('getTimelineIocs', {response});
	const returnData: INodePropertyOptions[] = [];

	if (response.data && typeof response.data === 'object' && 'timeline' in response.data){
		const timeline = response.data.timeline as IDataObject[];
		if (timeline.length === 0) {
			return [];
		}

		timeline.forEach( x => { 
			const iocs = x.iocs as IDataObject[];
			const assets = x.assets as IDataObject[];
			returnData.push({ 
				name: `${x.event_title} | ${x.category_name} | iocs:${iocs.length} | assets:${assets.length}`, 
				value: String(x.event_id) 
			}) 
		})
	}
	

	returnData.sort((a, b) => {
		if (a.name < b.name) {
			return -1;
		}
		if (a.name > b.name) {
			return 1;
		}
		return 0;
	});

	return returnData;
}
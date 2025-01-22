import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';

import { NodeOperationError } from 'n8n-workflow';

import { apiRequest } from '../transport/index';
import { utils } from './../helpers';

export async function getUsers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const endpoint = 'case/users/list';

	const responseData = await apiRequest.call(this, 'GET', endpoint, {});
	if (responseData === undefined) {
		throw new NodeOperationError(this.getNode(), 'No data got returned');
	}

	const returnData: INodePropertyOptions[] = [];
	responseData.data
		.filter((x: any) => x.user_active)
		.forEach((row: any) => {
			returnData.push({
				name: `${row.user_name} ( ${row.user_email} )`,
				value: row.user_id,
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

export async function getAssets(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const query = { cid: this.getNodeParameter('cid') as number };

	const response = await apiRequest.call(this, 'GET', 'case/assets/list', {}, query);
	if (response === undefined) {
		throw new NodeOperationError(this.getNode(), 'No data got returned');
	}

	const returnData: INodePropertyOptions[] = response.data.assets.map((asset: any) => {
		return {
			name: `${asset.asset_name} | ${asset.asset_type}`,
			value: asset.asset_id,
		};
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

export async function getAssetTypes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const endpoint = 'manage/asset-type/list';

	const responseData = await apiRequest.call(this, 'GET', endpoint, {});
	if (responseData === undefined) {
		throw new NodeOperationError(this.getNode(), 'No data got returned');
	}

	const returnData: INodePropertyOptions[] = [];
	responseData.data.forEach((row: any) => {
		returnData.push({
			name: row.asset_name,
			value: row.asset_id,
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

export async function getTasks(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const query = { cid: this.getNodeParameter('cid') as number };

	const response = await apiRequest.call(this, 'GET', 'case/tasks/list', {}, query);
	if (response === undefined) {
		throw new NodeOperationError(this.getNode(), 'No data got returned');
	}

	const returnData: INodePropertyOptions[] = response.data.tasks.map((entity: any) => {
		return {
			name: `${entity.task_title} | ${entity.status_name}`,
			value: entity.task_id,
		};
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

export async function getNoteGroups(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const query = { cid: this.getNodeParameter('cid') as number };

	const response = await apiRequest.call(this, 'GET', 'case/notes/directories/filter', {}, query);
	if (response === undefined) {
		throw new NodeOperationError(this.getNode(), 'No data got returned');
	}
	this.logger.debug(JSON.stringify(response.data));
	const returnData: INodePropertyOptions[] = utils.getNoteGroupsNested(response.data);

	return returnData;
}

export async function getNotes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const query = { cid: this.getNodeParameter('cid') as number };

	const response = await apiRequest.call(this, 'GET', 'case/notes/directories/filter', {}, query);
	if (response === undefined) {
		throw new NodeOperationError(this.getNode(), 'No data got returned');
	}
	this.logger.debug(JSON.stringify(response.data));
	const newData = utils.getFlattenGroups(response.data);

	let returnData: INodePropertyOptions[] = [];

	Object.values(newData).forEach((d: any) => {
		if (d.notes.length > 0)
			d.notes.map((n: any) => returnData.push({ name: `${n.title} (${d.name})`, value: n.id }));
	});
	return returnData;
}

export async function getIOCs(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const query = { cid: this.getNodeParameter('cid') as number };

	const response = await apiRequest.call(this, 'GET', 'case/ioc/list', {}, query);
	if (response === undefined) {
		throw new NodeOperationError(this.getNode(), 'No data got returned');
	}

	const returnData: INodePropertyOptions[] = response.data.ioc.map((ioc: any) => {
		return {
			name: `${ioc.ioc_value} | ${ioc.ioc_type} | ${ioc.tpl_name}`,
			value: ioc.ioc_id,
		};
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

export async function getIOCTypes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const endpoint = 'manage/ioc-types/list';

	const responseData = await apiRequest.call(this, 'GET', endpoint, {});
	if (responseData === undefined) {
		throw new NodeOperationError(this.getNode(), 'No data got returned');
	}

	const returnData: INodePropertyOptions[] = [];
	for (const data of responseData.data) {
		returnData.push({
			name: `${data.type_name} ( ${data.type_description} )`,
			value: data.type_id,
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

	const response = await apiRequest.call(this, 'GET', 'datastore/list/tree', {}, query);
	if (response === undefined) {
		throw new NodeOperationError(this.getNode(), 'No data got returned');
	}

	this.logger.debug('getFolders responseData', response);

	const returnData: INodePropertyOptions[] = utils.getFolderNested([], response.data);

	return returnData;
}

export async function getCustomers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const endpoint = 'manage/customers/list';

	const responseData = await apiRequest.call(this, 'GET', endpoint, {});
	if (responseData === undefined) {
		throw new NodeOperationError(this.getNode(), 'No data got returned');
	}

	const returnData: INodePropertyOptions[] = [];
	responseData.data.forEach((row: any) => {
		returnData.push({
			name: row.customer_name,
			value: row.customer_id,
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

	const responseData = await apiRequest.call(this, 'GET', endpoint, {});
	if (responseData === undefined) {
		throw new NodeOperationError(this.getNode(), 'No data got returned');
	}

	const returnData: INodePropertyOptions[] = [];
	responseData.data.forEach((row: any) => {
		returnData.push({
			name: row.name_expanded,
			value: row.id,
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

export async function getCaseState(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const endpoint = 'manage/case-states/list';

	const responseData = await apiRequest.call(this, 'GET', endpoint, {});
	if (responseData === undefined) {
		throw new NodeOperationError(this.getNode(), 'No data got returned');
	}

	const returnData: INodePropertyOptions[] = [];
	responseData.data.forEach((row: any) => {
		returnData.push({
			name: row.state_name,
			value: row.state_id,
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

export async function getSeverity(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const endpoint = 'manage/severities/list';

	const responseData = await apiRequest.call(this, 'GET', endpoint, {});
	if (responseData === undefined) {
		throw new NodeOperationError(this.getNode(), 'No data got returned');
	}

	const returnData: INodePropertyOptions[] = [];
	responseData.data.forEach((row: any) => {
		returnData.push({
			name: row.severity_name,
			value: row.severity_id,
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


export async function getCaseTemplates(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const endpoint = 'manage/case-templates/list';

	const responseData = await apiRequest.call(this, 'GET', endpoint, {});
	if (responseData === undefined) {
		throw new NodeOperationError(this.getNode(), 'No data got returned');
	}

	const returnData: INodePropertyOptions[] = [];
	responseData.data.forEach((row: any) => {
		returnData.push({
			name: `${row.display_name} (prefix: ${row.title_prefix} )`,
			value: String(row.id),
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

export async function getModules(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const endpoint = `dim/hooks/options/${this.getNodeParameter('type')}/list`;

	const responseData = await apiRequest.call(this, 'GET', endpoint, {});
	if (responseData === undefined) {
		throw new NodeOperationError(this.getNode(), 'No data got returned');
	}
	console.log('getModules', responseData);
	const returnData: INodePropertyOptions[] = [];
	responseData.data.forEach((row: any) => {
		returnData.push({
			name: `${row.manual_hook_ui_name} (${row.module_name})`,
			value: `${row.hook_name};${row.manual_hook_ui_name};${row.module_name}`,
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

// import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
// import { NodeOperationError } from 'n8n-workflow';

// import { apiRequest } from '../transport';

// export async function getAlertSeverity(this: ILoadOptionsFunctions) {
// 	const returnData: INodePropertyOptions[] = [
// 		{
// 			name: "Low",
// 			value: 1
// 		},
// 		{
// 			name: "Medium",
// 			value: 2
// 		},
// 		{
// 			name: "High",
// 			value: 3
// 		},
// 		{
// 			name: "Critical",
// 			value: 4
// 		}
// 	];

// 	return returnData;
// }

// export async function getAlertStatus(this: ILoadOptionsFunctions) {
// 	const returnData: INodePropertyOptions[] = [
// 		{
// 			name: "Low",
// 			value: 1
// 		},
// 		{
// 			name: "Medium",
// 			value: 2
// 		},
// 		{
// 			name: "High",
// 			value: 3
// 		},
// 		{
// 			name: "Critical",
// 			value: 4
// 		}
// 	];
// 	return returnData;
// }

// export async function getIOCTLP(this: ILoadOptionsFunctions) {
// 	const returnData: INodePropertyOptions[] = [
// 		{
// 			name: "Red",
// 			value: 1
// 		},
// 		{
// 			name: "Amber",
// 			value: 2
// 		},
// 		{
// 			name: "Green",
// 			value: 3
// 		},
// 		{
// 			name: "Clear",
// 			value: 4
// 		}
// 	];

// 	return returnData;
// }

// export async function getIOCTypes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
// 	const endpoint = 'manage/ioc-types/list';
// 	this.logger.verbose("iris > loadOptions > getIOCTypes called")

// 	const responseData = await apiRequest.call(this, 'GET', endpoint, {});
// 	if (responseData === undefined) {
// 		throw new NodeOperationError(this.getNode(), 'No data got returned');
// 	}

// 	const returnData: INodePropertyOptions[] = [];
// 	for (const data of responseData.data) {
// 		returnData.push({
// 			name: `${data.type_description} ( ${data.type_name} )`,
// 			value: data.type_id,
// 		});
// 	}

// 	returnData.sort((a, b) => {
// 		if (a.name < b.name) {
// 			return -1;
// 		}
// 		if (a.name > b.name) {
// 			return 1;
// 		}
// 		return 0;
// 	});

// 	return returnData;
// }

// export async function getAssetTypes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
// 	const endpoint = 'manage/asset-type/list';
// 	const responseData = await apiRequest.call(this, 'GET', endpoint, {});
// 	this.logger.verbose("iris > loadOptions > getAssetTypes called")
// 	if (responseData === undefined) {
// 		throw new NodeOperationError(this.getNode(), 'No data got returned');
// 	}

// 	const returnData: INodePropertyOptions[] = [];
// 	for (const data of responseData.data) {
// 		returnData.push({
// 			name: `${data.asset_description} ( ${data.asset_name} )`,
// 			value: data.asset_id,
// 		});
// 	}

// 	returnData.sort((a, b) => {
// 		if (a.name < b.name) {
// 			return -1;
// 		}
// 		if (a.name > b.name) {
// 			return 1;
// 		}
// 		return 0;
// 	});

// 	return returnData;
// }

// export async function getCustomers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
// 	const endpoint = 'manage/users/list';
// 	const responseData = await apiRequest.call(this, 'GET', endpoint, {});
// 	this.logger.verbose("iris > loadOptions > getCustomers called")
// 	// console.log("getCustomers > response: "+JSON.stringify(responseData))
// 	if (responseData === undefined) {
// 		throw new NodeOperationError(this.getNode(), 'No data got returned');
// 	}

// 	let userType: string
// 	const returnData: INodePropertyOptions[] = [];
// 	for (const data of responseData.data) {
// 		userType = data.user_is_service_account? "Service" : "User"

// 		returnData.push({
// 			name: data.user_name + " (" + userType + ")",
// 			value: data.user_id,
// 		});
// 	}

// 	returnData.sort((a, b) => {
// 		if (a.name < b.name) {
// 			return -1;
// 		}
// 		if (a.name > b.name) {
// 			return 1;
// 		}
// 		return 0;
// 	});

// 	return returnData;
// }

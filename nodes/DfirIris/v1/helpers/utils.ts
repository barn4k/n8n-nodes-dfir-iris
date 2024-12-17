import type { IDataObject, IExecuteFunctions, INodePropertyOptions } from 'n8n-workflow';

import { NodeOperationError } from 'n8n-workflow';
import type { IFolder, IFolderSub } from './../helpers/types';


export function fieldsRemover(responseData: any, options: IDataObject, prop: string = 'data') {
	const fields = (options.fields as string[]) || [];
	const inverseFields = (options.inverseFields as boolean) || false;

	if (fields && prop in responseData) {
		if (Array.isArray(responseData.data)) {
			responseData[prop].forEach((row: { [index: string]: any }) => {
				if (inverseFields) {
					Object.keys(row)
						.filter((k) => fields.includes(k))
						.forEach((x: string) => {
							delete row[x];
						});
				} else {
					Object.keys(row)
						.filter((k) => !fields.includes(k))
						.forEach((x: string) => {
							delete row[x];
						});
				}
			});
		} else {
			if (inverseFields) {
				Object.keys(responseData[prop])
					.filter((k) => fields.includes(k))
					.forEach((x: string) => {
						delete responseData[prop][x];
					});
			} else {
				Object.keys(responseData[prop])
					.filter((k) => !fields.includes(k))
					.forEach((x: string) => {
						delete responseData[prop][x];
					});
			}
		}
	}

	return responseData;
}

/**
 * Add the additional fields to the body
 *
 * @param {IDataObject} body The body object to add fields to
 * @param {number} index The index of the item
 */
export function addAdditionalFields(
	this: IExecuteFunctions,
	body: IDataObject,
	index: number,
	nodeVersion?: number,
	instanceId?: string,
) {
	// Add the additional fields
	const additionalFields = this.getNodeParameter('additionalFields', index);
	this.logger.debug('additionalFields', additionalFields);

	if (additionalFields.hasOwnProperty('custom_attributes')) {
		if (typeof additionalFields.custom_attributes !== 'object') {
			try {
				JSON.parse(additionalFields.custom_attributes as string);
			} catch {
				throw new NodeOperationError(this.getNode(), 'JSON parameter needs to be valid JSON', {
					itemIndex: index,
				});
			}
			additionalFields.custom_attributes = JSON.parse(additionalFields.custom_attributes as string);
		}
	}

	Object.assign(body, additionalFields);
}

// with slashes
// export function getFolderNested(data: INodePropertyOptions[], root: IFolder['data'], idx: number = 0){
// 	const rootObj = Object.entries(root).filter( (e: [string, IFolderSub]) => e[0].startsWith('d-'))
// 	const sp: string = idx === 0 ? '' : ' '
// 	if (rootObj.length >= 0)
// 		rootObj.forEach( (e: [string, IFolderSub]) => {
// 			data.push({
// 				name: `${'>'.repeat(idx)}${sp}${e[1].name}`,
// 				value: e[0].replace('d-', '')
// 			})
// 			return getFolderNested(data, e[1].children || {}, idx+1)
// 		})
// 	return data
// }

// with folder names
export function getFolderNested(data: INodePropertyOptions[], root: IFolder['data'], prefix: string = ''){
	const rootObj = Object.entries(root).filter( (e: [string, IFolderSub]) => e[0].startsWith('d-'))
	if (rootObj.length >= 0)
		rootObj.forEach( (e: [string, IFolderSub]) => {
			data.push({
				name: `${prefix}${e[1].name}`,
				value: e[0].replace('d-', '')
			})
			return getFolderNested(data, e[1].children || {}, `${prefix}${e[1].name} - `)
		})
	return data
}

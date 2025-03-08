import type { IDataObject, IExecuteFunctions, INodePropertyOptions } from 'n8n-workflow';

import { NodeOperationError } from 'n8n-workflow';
import type { IFolder, IFolderSub, INoteGroup } from './../helpers/types';

const SHOW_LOGS = false
export function customDebug(msg: string, obj: any = {}){
	if (SHOW_LOGS){
		if (obj){
			console.debug(msg, obj)
		} else {
			console.debug(msg)
		}
	}
}

export function fieldsRemover(responseRoot: any, options: IDataObject) {
	// const fields = (options.fields as string[]) || [];
	const fields = (options.fields as string).replace(/\s+/g, '').split(',') || [];
	const inverseFields = (options.inverseFields as boolean) || false;

	if (fields.length > 0) {
		if (Array.isArray(responseRoot)) {
			responseRoot.forEach((row: { [index: string]: any }) => {
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
				Object.keys(responseRoot)
					.filter((k) => fields.includes(k))
					.forEach((x: string) => {
						delete responseRoot[x];
					});
			} else {
				Object.keys(responseRoot)
					.filter((k) => !fields.includes(k))
					.forEach((x: string) => {
						delete responseRoot[x];
					});
			}
		}
	}

	return responseRoot;
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
	customDebug('additionalFields', additionalFields);

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

	Object.keys(additionalFields).forEach((f) => {
		f.startsWith('__') ? delete additionalFields[f] : '';
	});
	Object.assign(body, additionalFields);
}

export function getFolderNested(
	data: INodePropertyOptions[],
	root: IFolder['data'],
	prefix: string = '',
) {
	const rootObj = Object.entries(root).filter((e: [string, IFolderSub]) => e[0].startsWith('d-'));
	if (rootObj.length >= 0)
		rootObj.forEach((e: [string, IFolderSub]) => {
			data.push({
				name: `${prefix}${e[1].name}`,
				value: e[0].replace('d-', ''),
			});
			return getFolderNested(data, e[1].children || {}, `${prefix}${e[1].name} - `);
		});
	return data;
}

export function getNoteGroupsNested(
	root: INoteGroup[],
	data: INodePropertyOptions[] = [],
	prefix: string = '',
) {
	if (root.length > 0) {
		root.forEach((e: INoteGroup) => {
			customDebug('checking '+e.name)
			const oldEntry = data.filter((x) => x.value === e.id);
			// if in sub >> remove sub id from root
			if (prefix) {
				if (oldEntry.length > 0) {
					if (oldEntry[0].name.indexOf('--') === -1) {
						customDebug('removing old entry with '+e.name)
						customDebug('data before old', data)
						data = data.filter((x) => x.value !== e.id);
						customDebug('data after old', data)

						customDebug('adding new prefixed(1) entry '+prefix+" "+e.name)
						data.push({
							name: `${prefix}${e.name}`,
							value: e.id,
						});
					}
				} else {
					customDebug('adding new prefixed(2) entry '+prefix+" "+e.name)
					data.push({
						name: `${prefix}${e.name}`,
						value: e.id,
					});
				}
			} else if (oldEntry.length === 0) {
				customDebug('adding new root entry '+e.name)
				data.push({
					name: `${prefix}${e.name}`,
					value: e.id,
				});
			}
			customDebug('going in')
			data = getNoteGroupsNested(e.subdirectories, data, `${prefix}-- `);
		});
	}
	customDebug('going out')
	return data;
}

export function getFlattenGroups(root: INoteGroup[], data: any = {}, parentId: number = 0) {
	if (root.length > 0) {
		// initialize
		if (parentId === 0) {
			data = Object.fromEntries(
				root.map((x) => {
					return [x.id, { name: x.name, notes: x.notes }];
				}),
			);
			customDebug('initialize data ' + data);
		}
		root.forEach((e: INoteGroup) => {
			customDebug('checking ' + e.name);
			if (parentId > 0) {
				customDebug('changing prefixed(1) entry ' + parentId + '/' + e.name);
				data[e.id].name = `${data[parentId].name}/${e.name}`;
			}
			customDebug('going in');
			data = getFlattenGroups(e.subdirectories, data, e.id);
		});
	}
	customDebug('going out');
	customDebug('out data', data);
	return data;
}

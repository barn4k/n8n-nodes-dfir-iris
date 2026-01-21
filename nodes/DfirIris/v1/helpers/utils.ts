import type { IDataObject, IExecuteFunctions, INodePropertyOptions, Logger } from 'n8n-workflow';

import { NodeOperationError } from 'n8n-workflow';
import type { IFolder, IFolderSub, INoteGroup } from './../helpers/types';

// overwrite on global level
const SHOW_LOGS_FORCED = false

let SHOW_LOGS = false

export interface IrisLogger {
  info(message: string, meta?: Record<string, unknown>): void;
}

export class IrisLog implements IrisLogger {
  private readonly logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  info(message: string, meta?: Record<string, unknown>): void {
	if (SHOW_LOGS){
		if (meta && Object.keys(meta).length > 0) {
		this.logger.info(message, meta);
		} else {
		this.logger.info(message);
		}
	}
  }
}

export function enableDebug(state: boolean): void{
	if (!SHOW_LOGS_FORCED){
		SHOW_LOGS = state ? true : false
	}
}

// export function customDebug(
//   logger: Logger,
//   message: string,
//   meta?: Record<string, unknown>,
// ): void {
// 	if (SHOW_LOGS){
// 		if (meta && Object.keys(meta).length > 0) {
// 			logger.info(message, meta);
// 		} else {
// 			logger.info(message);
// 		}
// 	}
// }

export function fieldsRemover(responseRoot: IDataObject | IDataObject[], options: IDataObject) {
	const fields = (options.fields as string).replace(/\s+/g, '').split(',') || [];
	const inverseFields = (options.inverseFields as boolean) || false;

	if (fields.length > 0) {
		if (Array.isArray(responseRoot)) {
			responseRoot.forEach((row: IDataObject) => {
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
	// nodeVersion?: number,
	// instanceId?: string,
) {
	// Add the additional fields
	const additionalFields = this.getNodeParameter('additionalFields', index);
	const irisLogger = new IrisLog(this.logger);
	irisLogger.info('additionalFields', additionalFields);

	if (Object.prototype.hasOwnProperty.call(additionalFields, 'custom_attributes')) {
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
		if (f.startsWith('__')) {
			delete additionalFields[f];
		}
	});
	Object.assign(body, additionalFields);
}

export function getFolderNested(
	data: INodePropertyOptions[],
	root: IFolder['data'],
	prefix: string = '',
) {
	const rootObj = Object.entries(root).filter(e => e[0].startsWith('d-')) as [string, IFolderSub][];
	if (rootObj.length >= 0)
		rootObj.forEach(e => {
			data.push({
				name: `${prefix}${e[1].name}`,
				value: e[0].replace('d-', ''),
			});
			return getFolderNested(data, e[1].children || {}, `${prefix}${e[1].name} - `);
		});
	return data;
}

export function getNoteGroupsNested(
	logger: Logger,
	root: INoteGroup[],
	data: INodePropertyOptions[] = [],
	prefix: string = '',
) {
	const irisLogger = new IrisLog(logger);
	if (root.length > 0) {
		root.forEach((e: INoteGroup) => {
			irisLogger.info('checking '+e.name)
			const oldEntry = data.filter((x) => x.value === e.id);
			// if in sub >> remove sub id from root
			if (prefix) {
				if (oldEntry.length > 0) {
					if (oldEntry[0].name.indexOf('--') === -1) {
						irisLogger.info('removing old entry with '+e.name)
						irisLogger.info('data before old:', {data})
						data = data.filter((x) => x.value !== e.id);
						irisLogger.info('data after old', {data})

						irisLogger.info('adding new prefixed(1) entry '+prefix+" "+e.name)
						data.push({
							name: `${prefix}${e.name}`,
							value: e.id,
						});
					}
				} else {
					irisLogger.info('adding new prefixed(2) entry '+prefix+" "+e.name)
					data.push({
						name: `${prefix}${e.name}`,
						value: e.id,
					});
				}
			} else if (oldEntry.length === 0) {
				irisLogger.info('adding new root entry '+e.name)
				data.push({
					name: `${prefix}${e.name}`,
					value: e.id,
				});
			}
			irisLogger.info('going in')
			data = getNoteGroupsNested(logger, e.subdirectories, data, `${prefix}-- `);
		});
	}
	irisLogger.info('going out')
	return data;
}

export function getFlattenGroups(
	logger: Logger,
	root: INoteGroup[], 
	data: IDataObject = {}, 
	parentId: number = 0
) {
	const irisLogger = new IrisLog(logger);
	if (root.length > 0) {
		// initialize
		if (parentId === 0) {
			data = Object.fromEntries(
				root.map((x) => {
					return [x.id, { name: x.name, notes: x.notes }];
				}),
			);
			irisLogger.info('initialize data ' + data);
		}
		root.forEach((e: INoteGroup) => {
			irisLogger.info('checking ' + e.name);
			if (parentId > 0) {
				irisLogger.info('changing prefixed(1) entry ' + parentId + '/' + e.name);
				const dataId = data[e.id] as IDataObject
				const dataPid = data[parentId] as IDataObject
				dataId.name = `${dataPid?.name}/${e.name}`;
			}
			irisLogger.info('going in');
			data = getFlattenGroups(logger, e.subdirectories, data, e.id);
		});
	}
	irisLogger.info('going out');
	irisLogger.info('out data', data);
	return data;
}

export function getFlattenTree(
	data: IFolder['data'],
	parentId: string="",
	parentKey: string="",
	returnType: 'file'|'folder'|'all' = "all"){

  const ar = Object.entries(data)
  const out: IDataObject[] = []

  ar.forEach( ele => {
    const [k,v] = ele
    if (v.type === "directory"){
      if (Object.keys( v.children ).length > 0){
        out.push(...getFlattenTree(v.children, k, v.name, returnType))
      }

			if (returnType === 'folder' || returnType === 'all' ){
				out.push({
					_parentId: parentId,
					_parentKey: parentKey,
					_key: k,
					type: "directory",
					name: v.name,
					is_root: v.is_root
				})
			}
    } else {
      if (returnType === 'file' || returnType === 'all' ){
        const obj = Object.assign({}, {_parentId: parentId, _parentKey: parentKey, _key: k}, v) as unknown as IDataObject
        out.push(obj)
      }
    }

  })
  return out
}

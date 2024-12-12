import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';

import { NodeOperationError } from 'n8n-workflow';

export function fieldsRemover(responseData: any, options: IDataObject) {
	const fields = (options.fields as string[]) || [];
	const inverseFields = (options.inverseFields as boolean) || false;

	if (fields && 'data' in responseData) {
		if (Array.isArray(responseData.data)) {
			responseData.data.forEach((row: { [index: string]: any }) => {
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
				Object.keys(responseData.data)
					.filter((k) => fields.includes(k))
					.forEach((x: string) => {
						delete responseData.data[x];
					});
			} else {
				Object.keys(responseData.data)
					.filter((k) => !fields.includes(k))
					.forEach((x: string) => {
						delete responseData.data[x];
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

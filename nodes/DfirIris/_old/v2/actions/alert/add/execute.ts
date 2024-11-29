// import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
// import { NodeOperationError } from 'n8n-workflow';

// import { apiRequest } from '../../../transport';
// import { fieldsRemover } from '../../../methods'
// import type { IAsset, IIOC, IKeypair } from '../../Interfaces';

// export async function add(
// 	this: IExecuteFunctions,
// 	index: number,
// ): Promise<INodeExecutionData[]> {
// 	const body = {} as IDataObject;
// 	const qs = {} as IDataObject;
// 	const requestMethod = 'POST';
// 	const endpoint = 'alerts/add';
// 	this.logger.verbose("iris > alert > add > execute called")

// 	body.alert_title = this.getNodeParameter('alertTitle', index) as string
// 	body.alert_description = this.getNodeParameter('alertDescription', index) as string
// 	body.alert_source = this.getNodeParameter('alertSource', index) as string
// 	body.alert_source_ref = this.getNodeParameter('alertSourceRef', index) as string
// 	body.alert_source_link = this.getNodeParameter('alertSourceLink', index) as string
// 	body.alert_severity_id = this.getNodeParameter('alertSeverity', index, 1) as number
// 	body.alert_status_id = this.getNodeParameter('alertStatus', index, 1) as number

// 	let alertContextType = this.getNodeParameter('alertContextType', index, 'keypair') as string
// 	let kvUI = this.getNodeParameter('alertContextKV.parameters', index, []) as IKeypair[]
// 	let jsUI = this.getNodeParameter('alertContextJSON', index, '') as string
// 	let alertContext

// 	if (alertContextType === 'keypair' && kvUI !== null){
// 		alertContext = kvUI.map((p: IKeypair) => [p.name,p.value] )
// 	} else if (alertContextType === 'json' && jsUI !== null){
// 		try {
// 			alertContext = JSON.parse(jsUI)
// 		} catch {
// 			throw new NodeOperationError(
// 				this.getNode(),
// 				'JSON parameter need to be an valid JSON',
// 				{ itemIndex: index},
// 			);
// 		}
// 	} else {
// 		alertContext = {}
// 	}

// 	body.alert_context = alertContext

// 	body.alert_source_event_time = this.getNodeParameter('alertSourceEventTime', index) as string
// 	body.alert_note = this.getNodeParameter('alertNote', index) as string
// 	body.alert_tags = this.getNodeParameter('alertTags', index) as string

// 	body.alert_iocs = this.getNodeParameter('iocsCollection.iocData', index, []) as IIOC
// 	body.alert_assets = this.getNodeParameter('assetsCollection.assetData', index, []) as IAsset

// 	this.logger.debug("iris > alert > add > execute > iocs:")
// 	this.logger.debug(JSON.stringify(body.alert_iocs, undefined, 2))

// 	this.logger.debug("iris > alert > add > execute > assets:")
// 	this.logger.debug(JSON.stringify(body.alert_assets, undefined, 2))

// 	body.alert_customer_id = this.getNodeParameter('alertCustomer', index) as number
// 	body.alert_classification_id = this.getNodeParameter('alertClassification', index, 2) as number
// 	body.alert_source_content = this.getNodeParameter('alertSourceContent', index) as object

// 	this.logger.debug("iris > alert > add > execute > body:")
// 	this.logger.debug(JSON.stringify(body, undefined, 2))

// 	const options = this.getNodeParameter('options', index, {})
// 	const fieldStr = options.fields as string || ''

// 	const responseData = await apiRequest.call(this, requestMethod, endpoint, body, qs);
// 	const responseDataModified = fieldStr ? fieldsRemover(responseData, fieldStr): responseData

// 	return this.helpers.returnJsonArray(responseDataModified as IDataObject[] || responseData as IDataObject[]);
// }

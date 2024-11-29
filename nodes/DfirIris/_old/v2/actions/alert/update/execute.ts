// import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
// import { NodeOperationError } from 'n8n-workflow';

// import { apiRequest } from '../../../transport';
// import { fieldsRemover } from '../../../methods'
// import { sendOnDebug } from '../../../methods/helpers';
// import type { IAsset, IIOC, IKeypair, IAlert } from '../../Interfaces';

// // add a property to the object if it exists, othewise ignores. Needed to not pass the empty object
// function addProperty(obj: IDataObject, propName: string, propValue: any, force: boolean = false){
// 	if (propValue || force) return obj[propName] = propValue
// 	else return obj
// }

// export async function update(
// 	this: IExecuteFunctions,
// 	index: number,
// ): Promise<INodeExecutionData[]> {
// 	const body = {} as IAlert;
// 	const qs = {} as IDataObject;
// 	const requestMethod = 'POST';
// 	// const endpoint = `alerts/update/${this.getNodeParameter('alertId', index, 1) as number}`;
// 	const alertId = this.getNodeParameter('alertId', index) as number
// 	const endpoint = `alerts2/update/${alertId}`;

// 	this.logger.verbose("iris > alert > update > execute called")

// 	const kvUI = this.getNodeParameter('updateFields.alertContextKV.parameters', index, null) as IKeypair[]
// 	const jsUI = this.getNodeParameter('updateFields.alertContextJSON', index, null) as string
// 	let alertContext

// 	const sendEmpty = this.getNodeParameter('options.sendEmptyFields', index, false) as boolean
// 	this.logger.debug("kvUI")
// 	this.logger.debug(JSON.stringify(kvUI, undefined, 2))
// 	this.logger.debug("jsUI")
// 	this.logger.debug(JSON.stringify(jsUI, undefined, 2))

// 	if (kvUI !== null && kvUI.length > 0){
// 		alertContext = Object.fromEntries(kvUI.map((p: IKeypair) => [p.name,p.value] ))
// 	} else if (jsUI !== null){
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
// 		alertContext = sendEmpty ? {} : undefined
// 	}

// 	addProperty(body, 'alert_context', alertContext)

// 	// const updateFields = this.getNodeParameter('updateFields', index, {})
// 	addProperty(body, 'alert_title'            , this.getNodeParameter('updateFields.alertTitle', index, "") as string )
// 	addProperty(body, 'alert_description'      , this.getNodeParameter('updateFields.alertDescription', index, "") as string )
// 	addProperty(body, 'alert_source'           , this.getNodeParameter('updateFields.alertSource', index, "") as string )
// 	addProperty(body, 'alert_source_ref'       , this.getNodeParameter('updateFields.alertSourceRef', index, "") as string )
// 	addProperty(body, 'alert_source_link'      , this.getNodeParameter('updateFields.alertSourceLink', index, "") as string )
// 	addProperty(body, 'alert_severity_id'      , this.getNodeParameter('updateFields.alertSeverity', index, 0) as number )
// 	addProperty(body, 'alert_status_id'        , this.getNodeParameter('updateFields.alertStatus', index, 0) as number )
// 	addProperty(body, 'alert_source_event_time', this.getNodeParameter('updateFields.alertSourceEventTime', index, "") as string )
// 	addProperty(body, 'alert_note'             , this.getNodeParameter('updateFields.alertNote', index, "") as string )
// 	addProperty(body, 'alert_tags'             , this.getNodeParameter('updateFields.alertTags', index, "") as string )
// 	addProperty(body, 'alert_customer_id'			 , this.getNodeParameter('updateFields.alertCustomer', index, 0) as number )
// 	addProperty(body, 'alert_classification_id', this.getNodeParameter('updateFields.alertClassification', index, 0) as number )
// 	addProperty(body, 'alert_source_content'   , this.getNodeParameter('updateFields.alertSourceContent', index, null) as object )

// 	// this.logger.debug("iris > alert > update > execute > updateFields:")
// 	// this.logger.debug(JSON.stringify(updateFields, undefined, 2))

// 	const options = this.getNodeParameter('options', index, {})
// 	// const shouldReplaceIOC = this.getNodeParameter('options.replaceIOCs', index, false)
// 	// const shouldReplaceAsset = this.getNodeParameter('options.replaceAssets', index, false)

// 	let iocs = this.getNodeParameter('updateFields.iocsCollection.iocData', index, null) as Array<IIOC>
// 	let assets = this.getNodeParameter('updateFields.assetsCollection.assetData', index, null) as Array<IAsset>

// 	this.logger.debug("iris > alert > update > execute > iocs:")
// 	this.logger.debug(JSON.stringify(iocs, undefined, 2))
// 	this.logger.debug("iris > alert > update > execute > assets:")
// 	this.logger.debug(JSON.stringify(assets, undefined, 2))

// 	if (iocs?.length > 0) iocs = iocs.filter(i => i.ioc_value)
// 	if (assets?.length > 0) assets = assets.filter(i => i.asset_name)

// 	if (sendEmpty && !iocs) iocs = []
// 	if (sendEmpty && !assets) assets = []

// 	addProperty(body, 'alert_iocs'  , iocs, sendEmpty )
// 	addProperty(body, 'alert_assets', assets, sendEmpty )

// 	this.logger.debug("iris > alert > update > execute > options:")
// 	this.logger.debug(JSON.stringify(options, undefined, 2))

// 	this.logger.debug("iris > alert > update > execute > body:")
// 	this.logger.debug(JSON.stringify(body, undefined, 2))
// 	this.sendMessageToUI(body)

// 	const fieldStr = options.fields as string || ''



// 	let alertResponse: object
// 	if ((body.alert_iocs || body.alert_assets) && !sendEmpty) {
// 		try {
// 			sendOnDebug(this, {method: "GET", uri: `alerts/${alertId}`, query: {}, body: {}}, "API call to get current alert data")

// 			alertResponse = await apiRequest.call(this, "GET", `alerts/${alertId}`, {}, {})
// 		} catch {
// 			throw new NodeOperationError(this.getNode(), `Cannot fetch alert with id: ${alertId}`);
// 		}
// 		sendOnDebug(this, alertResponse, "API response")
// 		if ('data' in alertResponse){
// 			let alertData = (alertResponse as any).data as IAlert

// 			if (body.alert_iocs && 'iocs' in alertData) {
// 				(body.alert_iocs as Array<object>).push(...alertData.iocs as Array<IIOC>)
// 			}
// 			if (body.alert_assets && 'assets' in alertData) {
// 				(body.alert_assets as Array<object>).push(...alertData.assets as Array<IAsset>)
// 			}
// 		}
// 	}
// 	sendOnDebug(this, {method: requestMethod, uri: endpoint,	query: qs, body: body}, "API call to update alert")

// 	const responseData = await apiRequest.call(this, requestMethod, endpoint, body, qs);
// 	const responseDataModified = fieldStr ? fieldsRemover(responseData, fieldStr): responseData

// 	sendOnDebug(this, responseDataModified, "API response")
// 	return this.helpers.returnJsonArray(responseDataModified as IDataObject[] || responseData as IDataObject[]);
// }

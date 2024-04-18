import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import type { alertIOC } from '../../Interfaces'

import { apiRequest } from '../../../transport';

export async function add(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const body = {} as IDataObject;
	const qs = {} as IDataObject;
	const requestMethod = 'POST';
	const endpoint = 'alerts/add';

	body.alert_title = this.getNodeParameter('alertTitle', index) as string
	body.alert_description = this.getNodeParameter('alertDescription', index) as string
	body.alert_source = this.getNodeParameter('alertSource', index) as string
	body.alert_source_ref = this.getNodeParameter('alertSourceRef', index) as string
	body.alert_source_link = this.getNodeParameter('alertSourceLink', index) as string
	body.alert_severity_id = this.getNodeParameter('alertSeverity', index) as number
	body.alert_status_id = this.getNodeParameter('alertStatus', index) as number


	const akv = this.getNodeParameter('alertContextKV', index, {})
	const ajson = this.getNodeParameter('alertContextJSON', index, {})


	body.alert_context = akv || ajson
	console.log("execute > add > alert Context")
	console.log("execute > add > alertContext: ", body.alert_context)
	console.log("execute > add > alertContextKV: ", JSON.stringify(akv))
	console.log("execute > add > alertContextKV is: ", typeof akv)

	console.log("execute > add > alertContextJSON: ", JSON.stringify(ajson))
	console.log("execute > add > alertContextJSON is: ", typeof ajson)

	console.log("execute > add > alert IOCs")
	console.log("execute > add > iocsCollection" ,this.getNodeParameter('iocsCollection', index, []))
	console.log("execute > add > alert Assets")
	console.log("execute > add > assetsCollection" ,this.getNodeParameter('assetsCollection', index, []))

	body.alert_source_event_time = this.getNodeParameter('alertSourceEventTime', index) as string
	body.alert_note = this.getNodeParameter('alertNote', index) as string
	body.alert_tags = this.getNodeParameter('alertTags', index) as string
	body.alert_iocs = this.getNodeParameter('iocsCollection', index, []) as alertIOC[]
	body.alert_assets = this.getNodeParameter('assetsCollection', index, []) as object[]
	body.alert_customer_id = this.getNodeParameter('alertCustomer', index) as number
	body.alert_classification_id = this.getNodeParameter('alertClassification', index, 2) as number
	body.alert_source_content = this.getNodeParameter('alertSourceContent', index) as object

	console.log("execute > add > body:\n", JSON.stringify(body))
	const responseData = await apiRequest.call(this, requestMethod, endpoint, body, qs);

	return this.helpers.returnJsonArray(responseData as IDataObject[]);
}

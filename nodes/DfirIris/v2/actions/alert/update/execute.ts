import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { apiRequest } from '../../../transport';
import { fieldsRemover } from '../../../methods'
// import type { IAsset, IIOC, IKeypair } from '../../Interfaces';
import type { IKeypair } from '../../Interfaces';

function addProperty(obj: IDataObject, propName: string, propValue: any){
	if (propValue) return obj[propName] = propValue
	else return obj
}

export async function update(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const body = {} as IDataObject;
	const qs = {} as IDataObject;
	const requestMethod = 'POST';
	const endpoint = `alerts2/update/${this.getNodeParameter('alertId', index, 1) as number}`;

	// addProperty(body, 'alert_title'            , this.getNodeParameter('alertTitle', index) as string )
	// addProperty(body, 'alert_description'      , this.getNodeParameter('alertDescription', index) as string )
	// addProperty(body, 'alert_source'           , this.getNodeParameter('alertSource', index) as string )
	// addProperty(body, 'alert_source_ref'       , this.getNodeParameter('alertSourceRef', index) as string )
	// addProperty(body, 'alert_source_link'      , this.getNodeParameter('alertSourceLink', index) as string )
	// addProperty(body, 'alert_severity_id'      , this.getNodeParameter('alertSeverity', index, 1) as number )
	// addProperty(body, 'alert_status_id'        , this.getNodeParameter('alertStatus', index, 1) as number )
	// addProperty(body, 'alert_source_event_time', this.getNodeParameter('alertSourceEventTime', index) as string )
	// addProperty(body, 'alert_note'             , this.getNodeParameter('alertNote', index) as string )
	// addProperty(body, 'alert_tags'             , this.getNodeParameter('alertTags', index) as string )
	// addProperty(body, 'alert_iocs'  	         , this.getNodeParameter('iocsCollection.iocData', index, []) as IIOC )
	// addProperty(body, 'alert_assets'					 , this.getNodeParameter('assetsCollection.assetData', index, []) as IAsset )
	// addProperty(body, 'alert_customer_id'			 , this.getNodeParameter('alertCustomer', index) as number )
	// addProperty(body, 'alert_classification_id', this.getNodeParameter('alertClassification', index, 2) as number )
	// addProperty(body, 'alert_source_content'   , this.getNodeParameter('alertSourceContent', index) as object )

	const alertContextType = this.getNodeParameter('alertContextType', index, 'keypair') as string
	const kvUI = this.getNodeParameter('alertContextKV.parameters', index, []) as IKeypair[]
	const jsUI = this.getNodeParameter('alertContextJSON', index, '') as string
	let alertContext

	if (alertContextType === 'keypair' && kvUI !== null){
		alertContext = kvUI.map((p: IKeypair) => [p.name,p.value] )
	} else if (alertContextType === 'json' && jsUI !== null){
		try {
			alertContext = JSON.parse(jsUI)
		} catch {
			throw new NodeOperationError(
				this.getNode(),
				'JSON parameter need to be an valid JSON',
				{ itemIndex: index},
			);
		}
	} else {
		alertContext = {}
	}

	addProperty(body, 'alert_context', alertContext)

	console.log("execute > update > body:\n", body)
	const updateFields = this.getNodeParameter('updateFields', index, {})
	console.log('alert > update > updateFields: ', updateFields)
	const options = this.getNodeParameter('options', index, {})

	const fieldStr = options.fields as string || ''

	const responseData = await apiRequest.call(this, requestMethod, endpoint, body, qs);
	const responseDataModified = fieldStr ? fieldsRemover(responseData, fieldStr): responseData

	return this.helpers.returnJsonArray(responseDataModified as IDataObject[] || responseData as IDataObject[]);
}

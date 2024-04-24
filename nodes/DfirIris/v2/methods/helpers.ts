export function fieldsRemover(responseData: any, filterString: string){
	const inverseFilter = filterString.indexOf("!") === 0 ? true : false
	if (inverseFilter) filterString = filterString.replace("!", "")

	let fields = filterString ? filterString.split(",") : []
 	let fieldsToRemove: string[]

	if (fields && 'data' in responseData){
		const dataFields = Object.keys(responseData.data)

		// if wildcarded
		fields.filter(f => f.indexOf("*") !== -1).forEach(f => {
			const wFields = dataFields.filter(k => k.match(f.split("*").join(".*")))
			fields.push(...wFields)
		})

		fieldsToRemove = inverseFilter ? dataFields.filter(df => fields.includes(df)) : dataFields.filter(df => !fields.includes(df))

		if (fieldsToRemove.length === dataFields.length) throw new Error('Filter Removed all fields')

		fieldsToRemove.forEach(f => {
			if(f in responseData.data) delete responseData.data[f]
		})
		return responseData

	} else {
		return responseData
	}
}

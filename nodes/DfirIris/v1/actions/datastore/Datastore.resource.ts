import type { INodeProperties } from 'n8n-workflow';

import * as getTree from './getTree.operation';
import * as uploadFile from './uploadFile.operation';
// import * as updateFileInfo from './updateFileInfo.operation'
// import * as getFileInfo from './getFileInfo.operation'

import { cidDescription } from '../../helpers/types';

export { getTree, uploadFile };
// export { getTree, uploadFile, getFileInfo, updateFileInfo }

// const fieldsFile: string[] = [
// 	"file_size",
// 	"file_is_ioc",
// 	"file_sha256",
// 	"file_is_evidence",
// 	"file_uuid",
// 	"file_case_id",
// 	"file_date_added",
// 	"file_parent_id",
// 	"added_by_user_id",
// 	"file_original_name",
// 	"file_tags",
// 	"modification_history",
// 	"file_id",
// 	"file_description",
// 	"file_password"
// ]

// const fieldsFolder = [
// 	"case",
// 	"path_case_id",
// 	"path_id",
// 	"path_is_root",
// 	"path_name",
// 	"path_parent_id",
// 	"path_uuid",
// 	"registry"
// ]

export const endpoint = 'datastore';

export const resource: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['datastore'],
			},
		},
		options: [
			// ----------------------------------
			//           General
			// ----------------------------------
			{
				name: 'Get Datastore Tree',
				value: 'getTree',
				action: `Get Datastore Tree`,
			},

			// ----------------------------------
			//           File Operations
			// ----------------------------------
			{
				name: 'Upload File',
				value: 'uploadFile',
				description: 'Add new File',
				action: `Add new File`,
			},
			{
				name: 'Get File Info',
				value: 'getFileInfo',
				action: `Get File Info`,
			},
			{
				name: 'Update File Info',
				value: 'updateFileInfo',
				action: `Update File Info`,
			},
			{
				name: 'Download File',
				value: 'downloadFile',
				action: `Download File`,
			},
			{
				name: 'Delete File',
				value: 'deleteFile',
				action: `Delete File`,
			},
			{
				name: 'Move File',
				value: 'moveFile',
				action: `Move File`,
			},

			// ----------------------------------
			//        Folder Operations
			// ----------------------------------

			{
				name: 'Add Folder',
				value: 'addFolder',
				action: `Add Folder`,
			},
			{
				name: 'Rename Folder',
				value: 'renameFolder',
				action: `Rename Folder`,
			},
			{
				name: 'Move Folder',
				value: 'moveFolder',
				action: `Move Folder`,
			},
			{
				name: 'Delete Folder',
				value: 'deleteFolder',
				action: `Delete Folder`,
			},
		],
		default: 'uploadFile',
	},
	...cidDescription,
	...getTree.description,
	...uploadFile.description,
	// ...getFileInfo.description,
	// ...updateFileInfo.description,
];

// export const operations: INodeProperties[] = [

// 	// ----------------------------------
// 	//         datastore:general
// 	// ----------------------------------

// 	{
// 		displayName: 'File Id',
// 		name: 'fileId',
// 		type: 'number',
// 		default: '',
// 		displayOptions: {
// 			show: {
// 				operation: [
// 'getFileInfo',
// 					'updateFileInfo',
// 					'deleteFile',
// 					'downloadFile',
// 					'moveFile',
// 				],
// 				resource: [thisRes],
// 			},
// 		},
// 		required: true,
// 		description: 'File Id',
// 	},

// 	{
// 		displayName: 'Folder Id',
// 		name: 'folderId',
// 		type: 'number',
// 		default: '',
// 		displayOptions: {
// 			show: {
// 				operation: [
// 					'renameFolder',
// 					'moveFolder',
// 					'deleteFolder',
// 				],
// 				resource: [thisRes],
// 			},
// 		},
// 		required: true,
// 		description: 'File Id',
// 	},

// 	// boolean block
// 	{
// 		displayName: 'Use Folder Id',
// 		name: 'useFolderUI',
// 		type: 'boolean',
// 		default: false,
// 		displayOptions: {
// 			show: {
// 				operation: [
// 					'moveFile',
// 					'uploadFile',
// 				],
// 				resource: [thisRes],
// 			},
// 		},
// 		// required: true,
// 		description: 'Use Folder Id',
// 	},

// 	{
// 		displayName: 'Folder Id',
// 		name: 'folderId',
// 		type: 'number',
// 		default: '',
// 		displayOptions: {
// 			show: {
// 				useFolderUI: [true],
// 				operation: [
// 					'moveFile',
// 					'uploadFile',
// 				],
// 				resource: [thisRes],
// 			},
// 		},
// 		// required: true,
// 		description: 'Folder Id as number',
// 	},

// 	{
// 		displayName: 'Default Folder',
// 		name: 'folderLabel',
// 		type: 'options',
// 		noDataExpression: true,
// 		options: [
// 			{
// 				value: "root",
// 				name: "Root of the case"
// 			},
// 			{
// 				value: "evidences",
// 				name: "Evidences"
// 			},
// 			{
// 				value: "iocs",
// 				name: "IOCs"
// 			},
// 			{
// 				value: "images",
// 				name: "Images"
// 			},
// 		],
// 		default: 'evidences',
// 		displayOptions: {
// 			show: {
// 				useFolderUI: [false],
// 				operation: [
// 					'moveFile',
// 					'uploadFile',
// 				],
// 				resource: [thisRes],
// 			},
// 		},
// 		// required: true,
// 		description: 'Use Predefined Folder',
// 	},
// 	// end of block

// 	// ----------------------------------
// 	//         datastore:uploadFile
// 	// ----------------------------------

// 	{
// 		displayName: 'Parent Folder Id',
// 		name: 'parentFolderId',
// 		type: 'number',
// 		default: '',
// 		displayOptions: {
// 			show: {
// 				operation: [
// 					'addFolder',
// 					'moveFolder',
// 				],
// 				resource: [thisRes],
// 			},
// 		},
// 		required: true,
// 		description: 'Parent Folder Id as number',
// 	},
// 	{
// 		displayName: 'Binary Property Name',
// 		name: 'binaryName',
// 		type: 'string',
// 		default: 'data',
// 		displayOptions: {
// 			show: {
// 				operation: ['uploadFile'],
// 				resource: [thisRes],
// 			},
// 		},
// 		required: true,
// 		description: 'Name of the binary property which contains the data for the file to be uploaded',
// 	},
// 	{
// 		displayName: 'File Tags',
// 		name: 'file_tags',
// 		type: 'string',
// 		default: '',
// 		displayOptions: {
// 			show: {
// 				operation: ['uploadFile'],
// 				resource: [thisRes],
// 			},
// 		},
// 		required: true,
// 		description: 'File Tags',
// 	},
// 	{
// 		displayName: 'Additional Fields',
// 		name: 'additionalFields',
// 		type: 'collection',
// 		placeholder: 'Add Field',
// 		displayOptions: {
// 			show: {
// 				operation: ['uploadFile'],
// 				resource: [thisRes],
// 			},
// 		},
// 		default: {},
// 		options: [
// 			{
// 				displayName: 'File Description',
// 				name: 'file_description',
// 				type: 'string',
// 				default: '',
// 				description: 'File Description',
// 			},
// 			{
// 				displayName: 'File Password',
// 				name: 'file_password',
// 				type: 'string',
// 				default: '',
// 				description: 'File Password',
// 			},
// 			{
// 				displayName: 'File Is Evidence',
// 				name: 'file_is_evidence',
// 				type: 'boolean',
// 				default: true,
// 				description: 'Whether file is Evidence',
// 			},
// 			{
// 				displayName: 'File Is IOC',
// 				name: 'file_is_ioc',
// 				type: 'boolean',
// 				default: false,
// 				description: 'Whether file is IOC',
// 			},
// 		],
// 	},
// 	// ----------------------------------
// 	//         datastore:updateFileInfo
// 	// ----------------------------------

// 	{
// 		displayName: 'Additional Fields',
// 		name: 'additionalFields',
// 		type: 'collection',
// 		placeholder: 'Add Field',
// 		displayOptions: {
// 			show: {
// 				operation: ['updateFileInfo'],
// 				resource: [thisRes],
// 			},
// 		},
// 		default: {},
// 		options: [
// 			{
// 				displayName: 'Set new File Name',
// 				name: 'file_original_name',
// 				type: 'string',
// 				default: '',
// 				description: 'Set the file name',
// 			},
// 			{
// 				displayName: 'Set new File Content',
// 				name: 'binaryName',
// 				type: 'string',
// 				default: 'data',
// 				description: 'Name of the binary property which contains the data for the file to be uploaded',
// 			},
// 			{
// 				displayName: 'Set new Description',
// 				name: 'file_description',
// 				type: 'string',
// 				default: '',
// 				description: 'File Description',
// 			},
// 			{
// 				displayName: 'Set new Password',
// 				name: 'file_password',
// 				type: 'string',
// 				default: '',
// 				description: 'File Password',
// 			},
// 			{
// 				displayName: 'Set new Tags',
// 				name: 'file_tags',
// 				type: 'string',
// 				default: '',
// 				description: 'File Password',
// 			},
// 			{
// 				displayName: 'Set File as Evidence',
// 				name: 'file_is_evidence',
// 				type: 'boolean',
// 				default: true,
// 				description: 'Whether file is Evidence',
// 			},
// 			{
// 				displayName: 'Set File as IOC',
// 				name: 'file_is_ioc',
// 				type: 'boolean',
// 				default: false,
// 				description: 'Whether file is IOC',
// 			},
// 		],
// 	},
// 	// ----------------------------------
// 	//         datastore:downloadFile
// 	// ----------------------------------

// 	{
// 		displayName: 'Put Output File in Field',
// 		name: 'binaryName',
// 		type: 'string',
// 		default: 'data',
// 		displayOptions: {
// 			show: {
// 				operation: ['downloadFile'],
// 				resource: [thisRes],
// 			},
// 		},
// 		required: true,
// 		description: 'The name of the output binary field to put the file in',
// 	},
// 	{
// 		displayName: 'Additional Fields',
// 		name: 'additionalFields',
// 		type: 'collection',
// 		placeholder: 'Add Field',
// 		displayOptions: {
// 			show: {
// 				operation: ['downloadFile'],
// 				resource: [thisRes],
// 			},
// 		},
// 		default: {},
// 		options: [
// 			{
// 				displayName: 'Set new File Name',
// 				name: 'fileName',
// 				type: 'string',
// 				default: '',
// 				description: 'Set the new file name',
// 			},
// 		],
// 	},
// 	// ----------------------------------
// 	//         datastore:addFolder
// 	// ----------------------------------

// 	{
// 		displayName: 'Folder Name',
// 		name: 'folderName',
// 		type: 'string',
// 		default: '',
// 		displayOptions: {
// 			show: {
// 				operation: [
// 					'addFolder',
// 					'renameFolder',
// 				],
// 				resource: [thisRes],
// 			},
// 		},
// 		required: true,
// 		description: 'Folder Name',
// 	},

// 	// ----------------------------------
// 	//         datastore:options
// 	// ----------------------------------

// 	{
// 		displayName: 'Options',
// 		name: 'options',
// 		type: 'collection',
// 		placeholder: 'Add Option',
// 		displayOptions: {
// 			show: {
// 				operation: [
// 					'uploadFile',
// 					'getFileInfo',
// 					'updateFileInfo',
// 					'moveFile',
// 				],
// 				resource: [thisRes],
// 			},
// 		},
// 		default: {},
// 		options: [
// 			...returnRaw,
// 			...fieldProperties(fieldsFile),
// 		],
// 	},

// 	{
// 		displayName: 'Options',
// 		name: 'options',
// 		type: 'collection',
// 		placeholder: 'Add Option',
// 		displayOptions: {
// 			show: {
// 				operation: [
// 					'addFolder',
// 					'renameFolder',
// 					'moveFolder',
// 				],
// 				resource: [thisRes],
// 			},
// 		},
// 		default: {},
// 		options: [
// 			...returnRaw,
// 			...fieldProperties(fieldsFolder),
// 		],
// 	},
// ]

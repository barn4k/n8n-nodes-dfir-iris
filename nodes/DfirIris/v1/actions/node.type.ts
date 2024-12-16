import type { AllEntities } from 'n8n-workflow';

type NodeMap = {
	datastore:
	| 'uploadFile'
	| 'getTree'
	| 'getFileInfo'
	| 'updateFileInfo'
	| 'downloadFile'
	| 'moveFile'
	| 'deleteFile'
	| 'addFolder'
	| 'moveFolder'
	| 'renameFolder'
	| 'deleteFolder' // +
	// file:
	// 	| 'copy'
	// 	| 'createFromText'
	// 	| 'download'
	// 	| 'deleteFile'
	// 	| 'move'
	// 	| 'share'
	// 	| 'upload'
	// 	| 'update';
	// folder: 'create' | 'deleteFolder' | 'share';
	// fileFolder: 'search';
};

export type DfirIrisType = AllEntities<NodeMap>;

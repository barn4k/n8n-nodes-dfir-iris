import type { AllEntities } from 'n8n-workflow';

type NodeMap = {
	datastoreFile:
	| 'uploadFile'
	| 'getFileInfo'
	| 'updateFileInfo'
	| 'downloadFile'
	| 'moveFile'
	| 'deleteFile';
	datastoreFolder:
	| 'getTree'
	| 'addFolder'
	| 'moveFolder'
	| 'renameFolder'
	| 'deleteFolder'; // +
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

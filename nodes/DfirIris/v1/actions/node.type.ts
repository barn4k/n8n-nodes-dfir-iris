import type { AllEntities } from 'n8n-workflow';

type NodeMap = {
	datastore: 'uploadFile' | 'getTree'; // checked
	// | 'getFileInfo'
	// | 'updateFileInfo'
	// | 'downloadFile'
	// | 'deleteFile';
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

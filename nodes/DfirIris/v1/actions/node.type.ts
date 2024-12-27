import type { AllEntities } from 'n8n-workflow';

type NodeMap = {
	datastoreFile:
		| 'uploadFile'
		| 'getFileInfo'
		| 'updateFileInfo'
		| 'downloadFile'
		| 'moveFile'
		| 'deleteFile';
	datastoreFolder: 'getTree' | 'addFolder' | 'moveFolder' | 'renameFolder' | 'deleteFolder';
	asset: 'create' | 'deleteAsset' | 'get' | 'getAll' | 'update';
	ioc: 'create' | 'deleteIOC' | 'get' | 'getAll' | 'update';
	task: 'create' | 'deleteTask' | 'get' | 'getAll' | 'update';
	note: 'create' | 'deleteNote' | 'get' | 'search' | 'update';
	noteDirectory: 'create' | 'deleteNoteDirectory' | 'getAll' | 'update';
};

export type DfirIrisType = AllEntities<NodeMap>;

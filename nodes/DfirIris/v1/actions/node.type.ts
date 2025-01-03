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
	alert:
		| 'create'
		| 'update'
		| 'get'
		| 'countAlerts'
		| 'deleteAlert'
		| 'filterAlerts'
		| 'batchUpdate'
		| 'batchDelete'
		| 'escalate'
		| 'merge'
		| 'unmerge';
	asset: 'create' | 'deleteAsset' | 'get' | 'getAll' | 'update';
	ioc: 'create' | 'deleteIOC' | 'get' | 'getAll' | 'update';
	task: 'create' | 'deleteTask' | 'get' | 'getAll' | 'update';
	note: 'create' | 'deleteNote' | 'get' | 'search' | 'update';
	noteDirectory: 'create' | 'deleteNoteDirectory' | 'getAll' | 'update';
	comment: 'create' | 'deleteComment' | 'getAll' | 'update';
	case:
		| 'create'
		| 'update'
		| 'updateSummary'
		| 'getSummary'
		| 'countCases'
		| 'deleteCase'
		| 'filterCases'
		| 'exportCase';
};

export type DfirIrisType = AllEntities<NodeMap>;

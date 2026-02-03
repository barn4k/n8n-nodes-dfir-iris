import type { AllEntities } from 'n8n-workflow';

type NodeMap = {
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
	case:
		| 'create'
		| 'update'
		| 'updateSummary'
		| 'getSummary'
		| 'countCases'
		| 'deleteCase'
		| 'filterCases'
		| 'exportCase';
	comment: 'create' | 'deleteComment' | 'getAll' | 'update';
	datastoreFile:
		| 'uploadFile'
		| 'getFileInfo'
		| 'updateFileInfo'
		| 'downloadFile'
		| 'moveFile'
		| 'deleteFile';
	datastoreFolder: 'getTree' | 'addFolder' | 'moveFolder' | 'renameFolder' | 'deleteFolder';
	evidence: 'createEvidence' | 'deleteEvidence' | 'getEvidence' | 'listEvidences' | 'updateEvidence';
	ioc: 'create' | 'deleteIOC' | 'get' | 'getAll' | 'update';
	note: 'create' | 'deleteNote' | 'get' | 'search' | 'update';
	noteDirectory: 'create' | 'deleteNoteDirectory' | 'getAll' | 'update';
	task: 'create' | 'deleteTask' | 'get' | 'getAll' | 'update';
	timeline: 'addEvent' | 'queryTimeline' | 'deleteEvent' | 'fetchEvent' | 'flagEvent' | 'updateEvent' | 'getTimelineState';
	module: 'callModule';
};

export type DfirIrisType = AllEntities<NodeMap>;

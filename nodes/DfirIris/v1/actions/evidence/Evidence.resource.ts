import type { INodeProperties } from 'n8n-workflow';

import * as createEvidence from './createEvidence.operation';
import * as updateEvidence from './updateEvidence.operation';
import * as getEvidence from './getEvidence.operation';
import * as listEvidences from './listEvidences.operation';
import * as deleteEvidence from './deleteEvidence.operation';

export { createEvidence, updateEvidence, getEvidence, listEvidences, deleteEvidence };

export const endpoint = 'case/evidences';

export const resource: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['evidence'],
            }
        },
        options: [
            {
                name: 'Create Evidence',
                value: 'createEvidence',
                action: `Create Evidence`,
            },
            {
                name: 'Delete Evidence',
                value: 'deleteEvidence',
                action: `Delete Evidence`,
            },
            {
                name: 'Get Evidence',
                value: 'getEvidence',
                action: `Get Evidence`,
            },
            {
                name: 'List Evidences',
                value: 'listEvidences',
                action: `List Evidences`,
            },
            {           
                name: 'Update Evidence',
                value: 'updateEvidence',
                action: `Update Evidence`,
            },
        ],
        default: 'createEvidence',
    },
    ...createEvidence.description,
    ...deleteEvidence.description,
    ...getEvidence.description,
    ...listEvidences.description,
    ...updateEvidence.description,
];

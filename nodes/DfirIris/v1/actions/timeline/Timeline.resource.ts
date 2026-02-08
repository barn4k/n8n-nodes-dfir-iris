import type { INodeProperties } from 'n8n-workflow';

import * as addEvent from './addEvent.operation';
import * as deleteEvent from './deleteEvent.operation';
import * as flagEvent from './flagEvent.operation';
import * as fetchEvent from './fetchEvent.operation';
import * as getTimelineState from './getTimelineState.operation';
import * as updateEvent from './updateEvent.operation';
import * as queryTimeline from './filterTimeline.operation';

export { addEvent, deleteEvent, flagEvent, fetchEvent, getTimelineState, updateEvent, queryTimeline };

export const endpoint = 'case/timeline';

export const resource: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['timeline'],
            }
        },
        options: [
            {
                name: 'Create Timeline Event',
                value: 'addEvent',
                action: `Create Timeline Event`,
            },
            {
                name: 'Delete Timeline Event',
                value: 'deleteEvent',
                action: `Delete Timeline Event`,
            },
            {
                name: 'Fetch Timeline Event',
                value: 'fetchEvent',
                action: `Fetch Timeline Event`,
            },
            {
                name: 'Flag or Unflag Timeline Event',
                value: 'flagEvent',
                action: `Flag or Unflag Timeline Event`,
            },
            {
                name: 'Get Timeline State',
                value: 'getTimelineState',
                action: `Get Timeline State`,
            },
            {
                name: 'Query Timeline',
                value: 'queryTimeline',
                action: `Query Timeline`,
            },
            {           
                name: 'Update Timeline Event',
                value: 'updateEvent',
                action: `Update Timeline Event`,
            },
        ],
        default: 'addEvent',
    },
    ...addEvent.description,
    ...deleteEvent.description,
    ...fetchEvent.description,
    ...flagEvent.description,
    ...getTimelineState.description,
    ...updateEvent.description,
    ...queryTimeline.description,
];

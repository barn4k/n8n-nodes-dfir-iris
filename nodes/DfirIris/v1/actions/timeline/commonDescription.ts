import type { INodeProperties } from 'n8n-workflow';


export const eventId: INodeProperties = {
	displayName: 'Event Name or ID',
	name: 'event_id',
	type: 'options',
    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
    typeOptions: {
		loadOptionsMethod: 'getTimelineEvent',
		loadOptionsDependsOn: ['cid'],
	},
	default: '',
}

export const parentEventId: INodeProperties = {
	displayName: 'Parent Event ID',
	name: 'parent_event_id',
	type: 'number',
	default: 0,
}

export const eventTitle: INodeProperties = {
	displayName: 'Event Title',
	name: 'event_title',
	type: 'string',
	default: '',
};

export const eventRaw: INodeProperties = {
    displayName: 'Event Raw',
	description: 'Raw event data as string',
    name: 'event_raw',
    type: 'string',
    default: '',
};

export const eventSource: INodeProperties = {
    displayName: 'Event Source',
    name: 'event_source',
    type: 'string',
    default: '',
};

export const eventAssetsMV: INodeProperties = {
    displayName: 'Event Assets Names or IDs',
    name: 'event_assets',
    type: 'multiOptions',
    typeOptions: {
		loadOptionsMethod: 'getAssets',
		loadOptionsDependsOn: ['cid'],
        multipleValues: false,
        // loadOptionsDependsOn: ['event_id']
	},
    default: [],
    description: 'List of event assets. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
};

export const eventIocsMV: INodeProperties = {
    displayName: 'Event IOCs Names or IDs',
    name: 'event_iocs',
    type: 'multiOptions',
    typeOptions: {
        multipleValues: false,
		loadOptionsMethod: 'getIOCs',
        loadOptionsDependsOn: ['cid'],
        // loadOptionsDependsOn: ['event_id']
	},
    default: [],
    description: 'List of event IOCs. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
};

export const eventCategory: INodeProperties = {
    displayName: 'Event Category',
    name: 'event_category_id',
    type: 'options',
    default: 1,
    options: [
        {
            name: "Unspecified",
            value: 1
        },
        {
            name: "Legitimate",
            value: 2
        },
        {
            name: "Remediation",
            value: 3
        },
        {
            name: "Initial Access",
            value: 4
        },
        {
            name: "Execution",
            value: 5
        },
        {
            name: "Persistence",
            value: 6
        },
        {
            name: "Privilege Escalation",
            value: 7
        },
        {
            name: "Defense Evasion",
            value: 8
        },
        {
            name: "Credential Access",
            value: 9
        },
        {
            name: "Discovery",
            value: 10
        },
        {
            name: "Lateral Movement",
            value: 11
        },
        {
            name: "Collection",
            value: 12
        },
        {
            name: "Command and Control",
            value: 13
        },
        {
            name: "Exfiltration",
            value: 14
        },
        {
            name: "Impact",
            value: 15
        }
    ]
};

export const eventInSummary: INodeProperties = {
    displayName: 'Event In Summary',
    name: 'event_in_summary',
    type: 'boolean',
    default: false,
};

export const eventInGraph: INodeProperties = {
    displayName: 'Event In Graph',
    name: 'event_in_graph',
    type: 'boolean',
    default: false,
};

export const eventColor: INodeProperties = {
    displayName: 'Event Color',
    name: 'event_color',
    type: 'options',
    options: [
        {
            name: 'Blue',
            value: '#48ABF799',
        },
        {
            name: 'Dark-Blue',
            value: '#1572E899',
        },
        {
            name: 'Green',
            value: '#31CE3699',
        },
        {
            name: 'Orange',
            value: '#FFAD4699',
        },
        
        {
            name: 'Purple',
            value: '#6861CE99',
        },
        {
            name: 'Red',
            value: '#F2596199',
        },
        {
            name: 'White',
            value: '#FFF',
        },
    ],
    default: '#FFF',
};

export const eventDate: INodeProperties = {
    displayName: 'Event Date UTC',
    name: 'event_date',
    type: 'dateTime',
    default: '',
};

export const eventDescription: INodeProperties = {
    displayName: 'Event Description',
    name: 'event_description',
    type: 'string',
    default: '',
};

export const eventSyncIocsAssets: INodeProperties = {
    displayName: 'Link IOC to Asset',
    name: 'event_sync_iocs_assets',
    type: 'boolean',
    default: false,
};

export const eventTags: INodeProperties = {
    displayName: 'Event Tags',
    name: 'event_tags',
    type: 'string',
    default: '',
    description: 'Comma-separated list of tags',
};

// will extract from the date time picker
// export const event_tz: INodeProperties = {
//     displayName: 'Event Timezone',
//     name: 'event_tz',
//     type: 'string',
//     default: '',
// };

export const eventContent: INodeProperties = {
    displayName: 'Event Content',
    name: 'event_content',
    type: 'string',
    default: '',
};

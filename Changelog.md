# Changelog

# v1.1.0


### Bug fixes
* fixed issue with FormData in download/upload Datastore file operations
* disabled debug logs

### Features

* added debug option in the credentials for extended logs
* added n8n node v1.1
* ⚠️ only v1.1. added option to ignore empty iocs on creation
* added list Hooks module operation
* added Evidence resource with operations:
* * Create Evidence
* * Delete Evidence
* * Get Evidence
* * List Evidence
* * Update Evidence
* added Manage resource with operations:
* * Get Asset Types
* * Get Case Classifications
* * Get Case Customers
* * Get Case States
* * Get Evidence Types
* * Get IOC Types
* * Get Severities
* * Get Task Statuses
* * Get Users
* added Timeline resource with operations:
* * Create Timeline Event
* * Delete Timeline Event
* * Fetch Timeline Event
* * Flag or Unflag Timeline Event
* * Get Timeline State
* * Query Timeline
* * Update Timeline Event

### Misc

* updated the code for n8n v2 linter (`n8n node lint`).

# v1.0.14


### Bug fixes

* disabled debug logs

### Features

* added simplify mode option with simplified type option for datastore tree. It's possible to filter response by file/folder/all entitity types


# v1.0.13


### Bug fixes

* fixed issue with incorrect case resolution statuses
* fixed issue with alert and case sorting

# v1.0.12


### Bug fixes

* fixed an issue with incorect starting page for pagination

# v1.0.11


### Features

* added pagination for **Case** and **ALert** **Filter** operation methods

## v1.0.10


### Bug fixes

* removed excessive logging.
* fixed issue with **Note >> Delete** operation, where there was no **Note ID** field.

## v1.0.9


### Features

* added option to look for alert **relations** (experimental, as there is no PAI description)


## v1.0.8


### Bug fixes

* fixed issue with **alert assets** and **alert iocs** within alert **Update** operation. Now assets and iocs should be added/updated properly. (However, the ioc resource isn't described in the docs)

### Features

* added option to manage comments for the **Alert** resource (may not work, as there is no API description though)


## v1.0.7


### Bug fixes

* fixed issue with **case filtering** options. Now the filter should work for the supported fields.
* changed  the **case severities** from static to dynamically be populated from the IRIS


## v1.0.6


### Features

* changed **returned fields** for major operations from a **list** to **string** due to the difficulties with proper fields mapping in various versions


## v1.0.5


### Bug fixes

* ** Add Case** operation - fixed another issue with **case_template_id**. Value must be a **string**
* ** Add Case** operation - **case_description** must be present
* ** Get Case** operation - fixed return fields. Changed **case_name** with **name**
* **Add Task** operation - **task_description** now mandatory
* fixed couple of fields so they now depend on the chosen case instead of preloading with default one


## v1.0.4


### Bug fixes

* ** Add Case** operation - fixed issue with absent **case_template_id**
* **Update Task** operation - now depends on the case Id, istead of preloading with the default one.
* **Add Comment** operation - mixed up between **comment_id** and **comment_text**
* fixed option to return fields for case, note, task, comment resources

## v1.0.3


### Features

* ** Case Module** Added. Supported operations: **Call Module** and **List Module** Tasks

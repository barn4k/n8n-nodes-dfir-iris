# Changelog

## v1.0.7


### Bug fixes

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

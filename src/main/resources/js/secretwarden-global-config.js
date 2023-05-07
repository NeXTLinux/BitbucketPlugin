// Global Configuration Page Javascript Functions
// [1] https://docs.atlassian.com/aui/8.0.2/docs/restful-table.html
// [2] https://bitbucket.org/jwalton/aui-archive/src/master/auiplugin-tests/src/main/resources/restfultable/restfultable-example.js

define('BitbucketPlugin/GlobalConfig', [
        'jquery',
        'bitbucket/util/navbuilder',
        'bitbucket/util/server',
        'exports'
    ], function($,
        navbuilder,
        server,
        exports) {
        'use strict';


    exports.onReady = function () {
        $(document).on('click', '#bitbucketplugin-clearcache-button', function (e) {
            invokeClearCache();
        });

        $(document).on('click', '#bitbucketplugin-reloadruleset-button', function (e) {
            invokeReloadRuleSet();
        });

        buildMatchRulesetTable();
    };

    function invokeClearCache() {
        var selectButton = $("#bitbucketplugin-clearcache-button");
        selectButton.attr("aria-disabled", "true");

        server.rest({
            url: navbuilder.rest("bitbucketplugin").addPathComponents("globalconfig", "clear-result-cache").build(),
            type: 'PUT',
            async: false,
            complete: function(jqXHR) {
                if (jqXHR.status === 200) {
                    AJS.flag({
                        type: 'success',
                        title: 'Success!',
                        persistent: false,
                        body: 'BitbucketPlugin result cache has been cleared successfully!'
                    });
                } else {
                    AJS.flag({
                        type: 'error',
                        title: 'Failed!',
                        persistent: false,
                        body: 'An error occurred clearing the BitbucketPlugin cache. Please check console / server-logs for more information'
                    });
                    console.log("BitbucketPlugin clear result cache failed! Status: " + jqXHR.status);
                }
                selectButton.attr("aria-disabled", "false");
            }
        });

    }

    var CheckboxCreateView = AJS.RestfulTable.CustomCreateView.extend({
        render: function (self) {
            return true;
        }
    });

    var CheckboxEditView = AJS.RestfulTable.CustomEditView.extend({
        render: function (self) {
            var attrChecked = "";
            if (self.value === true)
                attrChecked = "checked";

            var $select = $("<input type='checkbox' " + attrChecked + " class='ajs-restfultable-input-" + self.name + "' />" +
                "<input type='hidden' name='" + self.name + "'/>");

            $select.val(self.value);

            $select.change(function() {
                if ($select.is(":checked")) {
                    self.value = true;
                    $select.val(true);
                } else {
                    self.value = false;
                    $select.val(false);
                }
            });

            return $select;
        }
    });
    var CheckboxReadView = AJS.RestfulTable.CustomReadView.extend({
        render: function (self) {
            var attrChecked = "";
            if (self.value === true)
                attrChecked = "checked";

            var $select = $("<input type='checkbox' disabled='disabled' " + attrChecked + " class='ajs-restfultable-input-" + self.name + "' />" +
                "<input type='hidden' name='" + self.name + "'/>");
            return $select;
        }
    });

    function buildMatchRulesetTable() {
        console.log("Building the MatchSecretRule RESTful table...");

        var restTable = new AJS.RestfulTable({
            el: jQuery("#match-rule-config-table"),
            autoFocus: true,
            allowDelete: false, // DELETE Not yet implemented
            resources: {
                all: AJS.contextPath() + "/rest/bitbucketplugin/1.0/globalconfig/match-secret-rule",
                self: AJS.contextPath() + "/rest/bitbucketplugin/1.0/globalconfig/match-secret-rule"
            },
            columns: [
                {
                    id: "ruleNumber",
                    header: "Rule Number",
                    allowEdit: false
                },
                {
                    id: "friendlyName",
                    header: "Rule Name"
                },
                {
                    id: "regexPattern",
                    header: "Regular Expression Pattern"
                },
                {
                    id: "enabled",
                    header: "Enabled",
                    readView: CheckboxReadView,
                    editView: CheckboxEditView,
                    createView: CheckboxCreateView
                }
            ]
        });


        AJS.$(document).bind(AJS.RestfulTable.Events.EDIT_ROW, function (event,editedRow,table) {
            // Need to do this until we find a way to reliably reload & return the newly created rule ID back to the client.
            editedRow.bind(AJS.RestfulTable.Events.UPDATED, function () {
                invokeFullReload();
            });
        });

        restTable.getCreateRow().bind(AJS.RestfulTable.Events.CREATED, function () {
            // Need to do this until we find a way to reliably reload & return the newly created rule ID back to the client.
            invokeFullReload();
        });

        restTable.getCreateRow().bind(AJS.RestfulTable.Events.VALIDATION_ERROR, function () {
            showFailureFlag();
        });

    }

    function invokeFullReload() {
        invokeReloadRuleSet();
        invokeClearCache();
        location.reload();
    }

    function showFailureFlag() {
        AJS.flag({
            type: 'error',
            title: 'Failed!',
            persistent: false,
            body: 'Failed to create or update a rule because of a server error. Please ensure you entry meets validation requirements ' +
                'or check server-logs for further information!'
        });
    }

    function invokeReloadRuleSet() {
        var selectButton = $("#bitbucketplugin-reloadruleset-button");

        server.rest({
            url: navbuilder.rest("bitbucketplugin").addPathComponents("globalconfig", "reload-ruleset").build(),
            type: 'PUT',
            async: false,
            complete: function(jqXHR) {
                if (jqXHR.status === 200) {
                    AJS.flag({
                        type: 'success',
                        title: 'Success!',
                        persistent: false,
                        body: 'BitbucketPlugin ruleset has reloaded successfully!'
                    });
                } else {
                    AJS.flag({
                        type: 'error',
                        title: 'Failed!',
                        persistent: false,
                        body: 'BitbucketPlugin ruleset reload has failed! The old ruleset still applies. Please check console / server-logs for more information'
                    });
                    console.log("BitbucketPlugin ruleset reload has failed! The old ruleset still applies. Status: " + jqXHR.status);
                }
                selectButton.attr("aria-disabled", "false");
            }
        });

    }

});

jQuery(document).ready(function () {
    require('BitbucketPlugin/GlobalConfig').onReady();
});

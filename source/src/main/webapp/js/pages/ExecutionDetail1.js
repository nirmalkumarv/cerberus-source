/*
 * Cerberus  Copyright (C) 2013  vertigo17
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This file is part of Cerberus.
 *
 * Cerberus is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Cerberus is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Cerberus.  If not, see <http://www.gnu.org/licenses/>.
 */

$.when($.getScript("js/pages/global/global.js")).then(function () {
    $(document).ready(function () {
        var stepList = [];
        var executionId = GetURLParameter("executionId");
        initPage(executionId);

        $.ajax({
            url: "ReadTestCaseExecution",
            method: "GET",
            data: "executionId="+executionId,
            datatype: "json",
            async: true,
            success: function (data) {
                var tce = data.testCaseExecution;
                updatePage(tce, stepList);
                if(tce.controlStatus == "PE"){
                    var parser = document.createElement('a');
                    parser.href = window.location.href;

                    var protocol = "ws:";
                    if(parser.protocol == "https:"){
                        protocol = "wss:";
                    }
                    var path = parser.pathname.split("ExecutionDetail2")[0];
                    var new_uri = protocol + parser.host + path + "execution/" + executionId;

                    var socket = new WebSocket(new_uri);

                    socket.onopen = function(e){
                    } //on "écoute" pour savoir si la connexion vers le serveur websocket s'est bien faite
                    socket.onmessage = function(e){
                        var data = JSON.parse(e.data);
                        updatePage(data, stepList);
                    } //on récupère les messages provenant du serveur websocket
                    socket.onclose = function(e){
                    } //on est informé lors de la fermeture de la connexion vers le serveur
                    socket.onerror = function(e){
                    } //on traite les cas d'erreur*/
                }
            }
        });
    });
});

function initPage(id) {

    var doc = new Doc();
    $("#testCaseConfig #testCaseDetails").hide();
    $(".panel-heading").click(function(e){
        $("#testCaseConfig #testCaseDetails").toggle();
        $('#list-wrapper').data('bs.affix').options.offset.top = $("nav.navbar.navbar-inverse.navbar-static-top").outerHeight(true) + $("div.alert.alert-warning").outerHeight(true) + $("div.progres").outerHeight(true) + $("#testCaseConfig").outerHeight(true);
        return false;
    });

    $('#list-wrapper').affix({offset: {top: $("nav.navbar.navbar-inverse.navbar-static-top").outerHeight(true) + $("div.alert.alert-warning").outerHeight(true) + $("div.progres").outerHeight(true) + $("#testCaseConfig").outerHeight(true)} });

    $("#editTcInfo").prop("disabled",true);
    $("#runTestCase").prop("disabled",true);
    $("#lastExecution").prop("disabled",true);

    $("#runOld").click(function () {
        window.location = "ExecutionDetail.jsp?id_tc="+id;
    });

    displayHeaderLabel(doc);
    displayFooter(doc);
    displayPageLabel(doc);
}

function displayPageLabel(doc){
    $("#pageTitle").text(doc.getDocLabel("page_executiondetail","title"));
    $(".alert.alert-warning span").text(doc.getDocLabel("page_global","beta_message"));
    $(".alert.alert-warning button").text(doc.getDocLabel("page_global","old_page"));
    $("#ExecutionByTag").text(doc.getDocLabel("page_executiondetail","see_execution_tag"));
    $("#more").text(doc.getDocLabel("page_executiondetail","more_detail"));
    $("#testCaseDetails label[for='application']").text(doc.getDocLabel("page_executiondetail","application"));
    $("#testCaseDetails label[for='browser']").text(doc.getDocLabel("page_executiondetail","browser"));
    $("#testCaseDetails label[for='browserfull']").text(doc.getDocLabel("page_executiondetail","browserfull"));
    $("#testCaseDetails label[for='country']").text(doc.getDocLabel("page_executiondetail","country"));
    $("#testCaseDetails label[for='environment']").text(doc.getDocLabel("page_executiondetail","environment"));
    $("#testCaseDetails label[for='status']").text(doc.getDocLabel("page_executiondetail","status"));
    $("#testCaseDetails label[for='controlstatus2']").text(doc.getDocLabel("page_executiondetail","controlstatus"));
    $("#testCaseDetails label[for='controlmessage']").text(doc.getDocLabel("page_executiondetail","controlmessage"));
    $("#testCaseDetails label[for='ip']").text(doc.getDocLabel("page_executiondetail","ip"));
    $("#testCaseDetails label[for='port']").text(doc.getDocLabel("page_executiondetail","port"));
    $("#testCaseDetails label[for='platform']").text(doc.getDocLabel("page_executiondetail","platform"));
    $("#testCaseDetails label[for='cerberusversion']").text(doc.getDocLabel("page_executiondetail","cerberusversion"));
    $("#testCaseDetails label[for='executor']").text(doc.getDocLabel("page_executiondetail","executor"));
    $("#testCaseDetails label[for='url']").text(doc.getDocLabel("page_executiondetail","url"));
    $("#testCaseDetails label[for='start']").text(doc.getDocLabel("page_executiondetail","start"));
    $("#testCaseDetails label[for='end']").text(doc.getDocLabel("page_executiondetail","end"));
    $("#testCaseDetails label[for='finished']").text(doc.getDocLabel("page_executiondetail","finished"));
    $("#testCaseDetails label[for='id']").text(doc.getDocLabel("page_executiondetail","id"));
    $("#testCaseDetails label[for='revision']").text(doc.getDocLabel("page_executiondetail","revision"));
    $("#testCaseDetails label[for='screenSize']").text(doc.getDocLabel("page_executiondetail","screensize"));
    $("#testCaseDetails label[for='tag']").text(doc.getDocLabel("page_executiondetail","tag"));
    $("#testCaseDetails label[for='verbose']").text(doc.getDocLabel("page_executiondetail","verbose"));
    $("#testCaseDetails label[for='build']").text(doc.getDocLabel("page_executiondetail","build"));
    $("#testCaseDetails label[for='version']").text(doc.getDocLabel("page_executiondetail","version"));
    $("#handler h3").text(doc.getDocLabel("page_executiondetail","steps"));
    $("#handler #editTcInfo").text(doc.getDocLabel("page_executiondetail","edittc"));
    $("#handler #runTestCase").text(doc.getDocLabel("page_executiondetail","runtc"));
    $("#handler #lastExecution").text(doc.getDocLabel("page_executiondetail","lastexecution"));

}

function updatePage(data, stepList){

    sortData(data.testCaseStepExecutionList);

    $("#editTcInfo").prop("disabled",false);
    $("#runTestCase").prop("disabled",false);
    $("#lastExecution").prop("disabled",false);

    $("#editTcInfo").click(function () {
        window.location = "TestCaseScript.jsp?test=" + data.test + "&testcase=" + data.testcase;
    });
    $("#runTestCase").click(function () {
        window.location = "RunTests1.jsp?test=" + data.test + "&testcase=" + data.testcase + "&country=" + data.country + "&environment=" + data.environment + "&browser=" + data.browser + "&tag=" + data.tag;
    });
    $("#lastExecution").click(function () {
        window.location = "ExecutionDetailList.jsp?test=" + data.test + "&testcase=" + data.testcase;
    });

    var configPanel = $("#testCaseConfig");

    configPanel.find("#ExecutionByTag").click(function(){
        window.open("ReportingExecutionByTag.jsp?Tag=" + data.tag,'_blank');
        return false;
    });

    configPanel.find("#idlabel").text(data.id);
    configPanel.find("#test").text(data.test);
    configPanel.find("#testcase").text(data.testcase);
    configPanel.find("#controlstatus").text(data.controlStatus);
    configPanel.find("input#application").val(data.application);
    configPanel.find("input#browser").val(data.browser);
    configPanel.find("input#browserfull").val(data.browserFullVersion);
    configPanel.find("input#build").val(data.build);
    configPanel.find("input#country").val(data.country);
    configPanel.find("input#environment").val(data.environment);
    configPanel.find("input#status").val(data.status);
    configPanel.find("input#controlstatus2").val(data.controlStatus);
    configPanel.find("input#controlmessage").val(data.controlMessage);
    configPanel.find("input#end").val(data.end);
    configPanel.find("input#finished").val(data.finished);
    configPanel.find("input#id").val(data.id);
    configPanel.find("input#ip").val(data.ip);
    configPanel.find("input#port").val(data.port);
    configPanel.find("input#platform").val(data.platform);
    configPanel.find("input#revision").val(data.revision);
    configPanel.find("input#cerberusversion").val(data.crbVersion);
    configPanel.find("input#executor").val(data.executor);
    configPanel.find("input#screenSize").val(data.screenSize);
    configPanel.find("input#start").val(data.start);
    configPanel.find("input#tag").val(data.tag);
    configPanel.find("input#url").val(data.url);
    configPanel.find("input#verbose").val(data.verbose);
    configPanel.find("input#version").val(data.version);

    createStepList(data.testCaseStepExecutionList,stepList);
    updateLoadBar(data);
}
function updateLoadBar(data) {
    var total = 0;
    var ended = 0;
    if (data.testCaseObj != undefined && data.testCaseObj.testCaseStepList != undefined) {
        for (var i = 0; i < data.testCaseObj.testCaseStepList.length; i++) {
            var step = data.testCaseObj.testCaseStepList[i];
            var stepExec = data.testCaseStepExecutionList[i];
            if (stepExec != undefined && stepExec.returnCode != "PE") {
                ended += 1;
            }
            total += 1;
            for (var j = 0; j < step.testCaseStepActionList.length; j++) {
                var action = step.testCaseStepActionList[j];
                if (stepExec != undefined) {
                    var actionExec = stepExec.testCaseStepActionExecutionList[j];
                    if (actionExec != undefined && actionExec.returnCode != "PE") {
                        ended += 1;
                    }
                }
                total += 1;
                for (var k = 0; k < action.testCaseStepActionControlList.length; k++) {
                    var control = action.testCaseStepActionControlList[k];
                    if (stepExec != undefined && actionExec != undefined) {
                        var controlExec = actionExec.testCaseStepActionControlExecutionList[k];
                        if (controlExec != undefined && controlExec.returnCode != "PE") {
                            ended += 1;
                        }
                    }
                    total += 1;
                }
            }
        }
    }
    var progress = ended / total * 100;
    if (data.controlStatus != "PE") {
        if (data.controlStatus === "OK") {
            $("#progress-bar").addClass("progress-bar-success");
        } else if (data.controlStatus === "FA") {
            $("#progress-bar").addClass("progress-bar-warning");
        } else {
            $("#progress-bar").addClass("progress-bar-danger");
        }
        progress = 100;
    }
    $("#progress-bar").css("width", progress + "%").attr("aria-valuenow", progress);
}
/** DATA AGREGATION **/

function sortStep(step) {

    for (var j = 0; j < step.testCaseStepActionExecutionList.length; j++) {
        var action = step.testCaseStepActionExecutionList[j];

        action.testCaseStepActionControlExecutionList.sort(function (a, b) {
            return a.sort - b.sort;
        });
    }

    step.testCaseStepActionExecutionList.sort(function (a, b) {
        return a.sort - b.sort;
    });
}

function sortData(agreg) {
    for (var i = 0; i < agreg.length; i++) {
        var step = agreg[i];

        sortStep(step);
    }

    agreg.sort(function (a, b) {
        return a.sort - b.sort;
    });
}

function createStepList(data, stepList) {
    $("#actionContainer").empty();
    $("#stepList").empty();

    for (var i = 0; i < data.length; i++) {
        var step = data[i];
        var stepObj = new Step(step, stepList);

        stepObj.draw();
        stepList.push(stepObj);
    }
    if (stepList.length > 0) {
        $("#stepList a:last-child").trigger("click");
    }
}

/** JAVASCRIPT OBJECT **/

function Step(json, stepList) {
    this.stepActionContainer = $("<div></div>").addClass("list-group").css("display", "none");

    this.description = json.description;
    this.end = json.end;
    this.fullEnd = json.fullEnd;
    this.fullStart = json.fullStart;
    this.id = json.id;
    this.returnCode = json.returnCode;
    this.sort = json.sort;
    this.start = json.start;
    this.step = json.step;
    this.test = json.test;
    this.testcase = json.testCase;
    this.timeElapsed = json.timeElapsed;
    this.useStep = json.useStep;
    this.useStepTest = json.useStepTest;
    this.useStepTestCase = json.useStepTestCase;
    this.useStepTestCaseStep = json.useStepTestCaseStep;
    this.useStepStep = json.useStepStep;
    this.inLibrary = json.inLibrary;
    this.actionList = [];
    this.setActionList(json.testCaseStepActionExecutionList);

    this.stepList = stepList;
    this.toDelete = false;

    this.html = $("<a href='#'></a>").addClass("list-group-item row").css("margin-left", "0px").css("margin-right", "0px");
    this.textArea = $("<div></div>").addClass("col-lg-10")
            .text("[" + this.sort + "]  " + this.description + "  (" + this.timeElapsed + ")");

}

Step.prototype.draw = function () {
    var htmlElement = this.html;


    htmlElement.data("item", this);
    htmlElement.click(this.show);
    var object = htmlElement.data("item");
    if (object.returnCode === "OK") {
        htmlElement.append($("<span>").addClass("glyphicon glyphicon-ok pull-left"));
        object.html.addClass("list-group-item-success");
    } else if (object.returnCode === "PE") {
        htmlElement.append($("<span>").addClass("glyphicon glyphicon-refresh spin pull-left"));
        object.html.addClass("list-group-item-info");
    } else if (object.returnCode === "FA") {
        htmlElement.append($("<span>").addClass("glyphicon glyphicon-alert pull-left"));
        object.html.addClass("list-group-item-warning");
    } else {
        htmlElement.prepend($("<span>").addClass("glyphicon glyphicon-remove pull-left"));
        object.html.addClass("list-group-item-danger");
    }
    htmlElement.append(this.textArea);
    $("#stepList").append(htmlElement);
    $("#actionContainer").append(this.stepActionContainer);
};

Step.prototype.show = function () {
    var doc = new Doc();
    var object = $(this).data("item");
    var stepDesc = $("<div>").addClass("col-sm-11");

    for (var i = 0; i < object.stepList.length; i++) {
        var step = object.stepList[i];

        step.stepActionContainer.hide();
        step.html.removeClass("active");
    }
    $("#stepInfo").empty();
    $("#stepContent").removeClass();
    $(this).addClass("active");



    if (object.returnCode === "OK") {
        $("#stepInfo").prepend($("<div>").addClass("col-sm-1").append($("<h2>").addClass("glyphicon glyphicon-ok pull-left text-success").attr("style", "font-size:3em")));
        $("#stepContent").addClass("col-lg-9");
    } else if (object.returnCode === "PE") {
        $("#stepInfo").prepend($("<div>").addClass("col-sm-1").append($("<h2>").addClass("glyphicon glyphicon-refresh spin pull-left text-info").attr("style", "font-size:3em")));
        $("#stepContent").addClass("col-lg-9");
    } else if (object.returnCode === "FA") {
        $("#stepInfo").prepend($("<div>").addClass("col-sm-1").append($("<h2>").addClass("glyphicon glyphicon-alert pull-left text-warning").attr("style", "font-size:3em")));
        $("#stepContent").addClass("col-lg-9");
    } else {
        $("#stepInfo").prepend($("<div>").addClass("col-sm-1").append($("<h2>").addClass("glyphicon glyphicon-remove pull-left text-danger").attr("style", "font-size:3em")));
        $("#stepContent").addClass("col-lg-9");
    }

    stepDesc.append($("<h2 id='stepDescription' style='float:left;'>").text(object.description));
    if (object.useStep === "Y") {
        stepDesc.append($("<div id='libInfo' style='float:right; margin-top: 20px;'>").text("(" + doc.getDocLabel("page_testcasescript","imported_from") + " " + object.useStepTest + " - " + object.useStepTestCase + " - " + object.useStepStep + " )"));
    } else {
        stepDesc.append($("<div id='libInfo' style='float:right; margin-top: 20px;'>").text(""));
    }
    $("#stepInfo").append(stepDesc);
    object.stepActionContainer.show();
    $("#stepInfo").show();
    return false;
};

Step.prototype.setActionList = function (actionList) {
    for(var i = 0; i < actionList.length; i++) {
        this.setAction(actionList[i]);
    }
};

Step.prototype.setAction = function (action) {
    var actionObj;
    if (action instanceof Action) {
        actionObj = action;
    } else {
        actionObj = new Action(action, this);
    }

    this.actionList.push(actionObj);

    actionObj.draw();

    actionObj.setControlList(actionObj.controlListJson);
};

Step.prototype.setDescription = function (description) {
    this.description = description;
    this.textArea.text(description);
    $("#stepDescription").text(description);
};

Step.prototype.setStep = function (step) {
    this.step = step;
};

Step.prototype.getJsonData = function () {
    var json = {};

    json.toDelete = this.toDelete;
    json.test = this.test;
    json.testcase = this.testcase;
    json.step = this.step;
    json.description = this.description;
    json.useStep = this.useStep;
    json.useStepTest = this.useStepTest;
    json.useStepTestCase = this.useStepTestCase;
    json.useStepStep = this.useStepStep;
    json.inLibrary = this.inLibrary;

    return json;
};

function Action(json, parentStep) {
    this.html = $("<a href='#'></a>").addClass("action-group");
    this.parentStep = parentStep;

    if (json !== null) {
        this.action = json.action;
        this.description = json.description;
        this.end = json.end;
        this.endlong = json.endlong;
        this.forceExeStatus = json.forceExeStatus;
        this.id = json.id;
        this.returnCode = json.returnCode;
        this.returnMessage = json.returnMessage;
        this.sequence = json.sequence;
        this.sort = json.sort;
        this.start = json.start;
        this.startlong = json.startlong;
        this.step = json.step;
        this.test = json.test;
        this.testcase = json.testcase;
        this.value1 = json.value1;
        this.value2 = json.value2;
        this.screenshotFileName = json.screenshotFileName;
        this.controlListJson = json.testCaseStepActionControlExecutionList;
        this.controlList = [];
    } else {
        this.action = "Unknown";
        this.description = "";
        this.end = 0;
        this.endlong = 0;
        this.forceExeStatus = "";
        this.id = 0;
        this.returnCode = "";
        this.returnMessage = "";
        this.sequence = 0;
        this.sort = 0;
        this.start = 0;
        this.startlong = 0;
        this.step = parentStep.step;
        this.test = "";
        this.testcase = "";
        this.value1 = "";
        this.value2 = "";
        this.screenshotFileName = "";
        this.controlListJson = "";
        this.controlList = [];
    }

    this.toDelete = false;
}

Action.prototype.draw = function () {
    var htmlElement = this.html;
    var action = this;
    var row = $("<div></div>").addClass("col-sm-10");
    var type = $("<div></div>").addClass("type");

    var header = this.generateHeader();

    row.append(header);
    row.data("item", this);

    var button = $("<div></div>").addClass("col-sm-1").append($("<span class='glyphicon glyphicon-chevron-down'></span>").attr("style", "font-size:1.5em"));

    htmlElement.prepend(button);
    htmlElement.prepend(row);

    var content = this.generateContent();

    if (action.returnCode === "OK") {
        htmlElement.prepend($("<div>").addClass("col-sm-1").append($("<span>").addClass("glyphicon glyphicon-ok").attr("style", "font-size:1.5em")));
        htmlElement.addClass("row list-group-item list-group-item-success");
        content.hide();
    } else if (action.returnCode === "PE") {
        htmlElement.prepend($("<div>").addClass("col-sm-1").append($("<span>").addClass("glyphicon glyphicon-refresh spin").attr("style", "font-size:1.5em")));
        htmlElement.addClass("row list-group-item list-group-item-info");
        content.hide();
    } else if (action.returnCode === "FA") {
        htmlElement.prepend($("<div>").addClass("col-sm-1").append($("<span>").addClass("glyphicon glyphicon-alert").attr("style", "font-size:1.5em")));
        htmlElement.addClass("row list-group-item list-group-item-warning");
        content.hide();
    } else {
        htmlElement.prepend($("<div>").addClass("col-sm-1").append($("<span>").addClass("glyphicon glyphicon-remove").attr("style", "font-size:1.5em")));
        htmlElement.addClass("row list-group-item list-group-item-danger");
        content.show();
    }

    this.parentStep.stepActionContainer.append(htmlElement);
    this.parentStep.stepActionContainer.append(content);
    htmlElement.click(function(){
        content.toggle();
        return false;
    });

    var f = new File();
    f.getFiles(this,"ReadTestCaseExecutionImage?id=" + this.id + "&test=" + this.test + "&testcase=" + this.testcase + "&type=action&step=" + this.step + "&sequence=" + this.sequence).then(function(data){

        var headerToAdd = data[0];
        var bodyToAdd = data[1];

        if(headerToAdd != undefined) {
            var cnt = headerToAdd.contents();
            $(header).find("#contentField").removeClass("col-sm-12").addClass("col-sm-"+(12-f.getIt()));
            $(header).find(".row").append(cnt);
        }

        if(bodyToAdd != undefined) {
            var cnt = bodyToAdd.contents();
            $(content).append(cnt);
        }

    },function(e){
        // No File Found
    });

};

Action.prototype.setControlList = function (controlList) {
    for (var i = 0; i < controlList.length; i++) {
        this.setControl(controlList[i]);
    }
};

Action.prototype.setControl = function (control) {
    if (control instanceof Control) {
        control.draw();
        this.controlList.push(control);
    } else {
        var controlObj = new Control(control, this);

        controlObj.draw();
        this.controlList.push(controlObj);
    }
};

Action.prototype.setStep = function (step) {
    this.step = step;
};

Action.prototype.setSequence = function (sequence) {
    this.sequence = sequence;
};

Action.prototype.generateHeader = function () {
    var scope = this;
    var content = $("<div></div>").addClass("content");
    var firstRow = $("<div></div>").addClass("row ");
    var contentField = $("<div></div>").addClass("col-sm-12").attr("id","contentField");
    var returnMessageField = $("<h4>").attr("style", "font-size:.9em;margin:0px;line-height:1;height:.9em;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;");
    var descriptionField = $("<h4>").attr("style", "font-size:1.2em;margin:0px;line-height:1;height:1.2em;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;");

    returnMessageField.text(this.returnMessage);
    descriptionField.text(this.description);

    contentField.append(descriptionField);
    contentField.append(returnMessageField);

    firstRow.append(contentField);

    content.append(firstRow);

    return content;

};

Action.prototype.generateContent = function () {
    var obj = this;
    var doc = new Doc();

    var secondRow = $("<div></div>").addClass("row");
    var thirdRow = $("<div></div>").addClass("row");
    var fourthRow = $("<div></div>").addClass("row");
    var fifthRow = $("<div></div>").addClass("row");
    var container = $("<div id='content-container'></div>").addClass("action-group row list-group-item");

    var actionList = $("<input type='text' class='form-control' id='action'>").prop("readonly",true);
    var descField = $("<input type='text' class='form-control' id='description'>").prop("readonly",true);
    var value1Field = $("<input type='text' class='form-control' id='value1'>").prop("readonly",true);
    var value2Field = $("<input type='text' class='form-control' id='value2'>").prop("readonly",true);
    var timeField = $("<input type='text' class='form-control' id='time'>").prop("readonly",true);
    var returnCodeField = $("<input type='text' class='form-control' id='returncode'>").prop("readonly",true);
    var returnMessageField = $("<textarea class='form-control' id='returnmessage'>").prop("readonly",true);
    var sortField = $("<input type='text' class='form-control' id='sort'>").prop("readonly",true);

    var actionGroup = $("<div class='form-group'></div>").append($("<label for='action'>" + doc.getDocLabel("page_executiondetail","action") + "</label>")).append(actionList);
    var descGroup = $("<div class='form-group'></div>").append($("<label for='description'>" + doc.getDocLabel("page_executiondetail","description") + "</label>")).append(descField);
    var objectGroup = $("<div class='form-group'></div>").append($("<label for='value1'>" + doc.getDocLabel("page_executiondetail","value1") + "</label>")).append(value1Field);
    var timeGroup = $("<div class='form-group'></div>").append($("<label for='time'>" + doc.getDocLabel("page_executiondetail","time") + "</label>")).append(timeField);
    var propertyGroup = $("<div class='form-group'></div>").append($("<label for='value2'>" + doc.getDocLabel("page_executiondetail","value2") + "</label>")).append(value2Field);
    var returncodeGroup = $("<div class='form-group'></div>").append($("<label for='returncode'>" + doc.getDocLabel("page_executiondetail","return_code") + "</label>")).append(returnCodeField);
    var returnmessageGroup = $("<div class='form-group'></div>").append($("<label for='returnmessage'>" + doc.getDocLabel("page_executiondetail","return_message") + "</label>")).append(returnMessageField);
    var sortGroup = $("<div class='form-group'></div>").append($("<label for='sort'>" + doc.getDocLabel("page_executiondetail","sort") + "</label>")).append(sortField);



    descField.val(this.sequence + " - " + this.description);
    actionList.val(this.action);
    value1Field.val(this.value1);
    value2Field.val(this.value2);
    timeField.val((this.endlong - this.startlong) + " ms");
    returnCodeField.val(this.returnCode);
    returnMessageField.val(this.returnMessage);
    sortField.val(this.sort);

    secondRow.append($("<div></div>").addClass("col-sm-4").append(returncodeGroup));
    secondRow.append($("<div></div>").addClass("col-sm-4").append(descGroup));
    secondRow.append($("<div></div>").addClass("col-sm-4").append(timeGroup));
    fifthRow.append($("<div></div>").addClass("col-sm-4").append(sortGroup));
    thirdRow.append($("<div></div>").addClass("col-sm-4").append(actionGroup));
    thirdRow.append($("<div></div>").addClass("col-sm-4").append(objectGroup));
    thirdRow.append($("<div></div>").addClass("col-sm-4").append(propertyGroup));
    fourthRow.append($("<div></div>").addClass("col-sm-12").append(returnmessageGroup));

    container.append(secondRow);
    container.append(fifthRow);
    container.append(thirdRow);
    container.append(fourthRow);

    return container;
};

Action.prototype.getJsonData = function () {
    var json = {};

    json.toDelete = this.toDelete;
    json.test = this.test;
    json.testcase = this.testcase;
    json.step = this.step;
    json.sequence = this.sequence;
    json.description = this.description;
    json.action = this.action;
    json.value1 = this.value1;
    json.value2 = this.value2;
    json.screenshotFileName = "";

    return json;
};

function Control(json, parentAction) {
    if (json !== null) {
        this.control = json.control;
        this.controlType = json.controlType;
        this.value1 = json.controlProperty;
        this.value2 = json.controlValue;
        this.description = json.description;
        this.end = json.end;
        this.endlong = json.endlong;
        this.fatal = json.fatal;
        this.id = json.id;
        this.returnCode = json.returnCode;
        this.returnMessage = json.returnMessage;
        this.screenshotFileName = "";
        this.sequence = json.sequence;
        this.sort = json.sort;
        this.start = json.start;
        this.startlong = json.startlong;
        this.step = json.step;
        this.test = json.test;
        this.testcase = json.testcase;
    } else {
        this.control = "";
        this.controlType = "Unknown";
        this.value1 = "";
        this.value2 = "";
        this.description = "";
        this.end = 0;
        this.endlong = 0;
        this.fatal = "Y";
        this.id = 0;
        this.returnCode = "";
        this.returnMessage = "";
        this.screenshotFileName = "";
        this.sequence = parentAction.sequence;
        this.sort = 0;
        this.start = 0;
        this.startlong = 0;
        this.step = parentAction.step;
        this.test = "";
        this.testcase = "";
    }

    this.parentStep = parentAction.parentStep;
    this.parentAction = parentAction;

    this.toDelete = false;

    this.html = $("<a href='#'></a>").addClass("action-group").css("margin-left","25px");
}

Control.prototype.draw = function () {
    var htmlElement = this.html;
    var row = $("<div></div>").addClass("col-sm-10");
    var type = $("<div></div>").addClass("type");

    var header = this.generateHeader();

    row.append(header);
    row.data("item", this);

    var button = $("<div></div>").addClass("col-sm-1").append($("<span class='glyphicon glyphicon-chevron-down'></span>").attr("style", "font-size:1.5em"));

    htmlElement.prepend(button);
    htmlElement.prepend(row);

    var content = this.generateContent();

    if (this.returnCode === "OK") {
        htmlElement.prepend($("<div>").addClass("col-sm-1").append($("<span>").addClass("glyphicon glyphicon-ok").attr("style", "font-size:1.5em")));
        htmlElement.addClass("row list-group-item list-group-item-success");
        content.hide();
    } else if (this.returnCode === "PE") {
        htmlElement.prepend($("<div>").addClass("col-sm-1").append($("<span>").addClass("glyphicon glyphicon-refresh spin").attr("style", "font-size:1.5em")));
        htmlElement.addClass("row list-group-item list-group-item-info");
        content.hide();
    } else if (this.returnCode === "FA") {
        htmlElement.prepend($("<div>").addClass("col-sm-1").append($("<span>").addClass("glyphicon glyphicon-alert").attr("style", "font-size:1.5em")));
        htmlElement.addClass("row list-group-item list-group-item-warning");
        content.hide();
    } else {
        htmlElement.prepend($("<div>").addClass("col-sm-1").append($("<span>").addClass("glyphicon glyphicon-remove").attr("style", "font-size:1.5em")));
        htmlElement.addClass("row list-group-item list-group-item-danger");
        content.show();
    }

    this.parentStep.stepActionContainer.append(htmlElement);
    this.parentStep.stepActionContainer.append(content);
    htmlElement.click(function(){
        content.toggle();
        return false;
    });

    var f = new File();
    f.getFiles(this,"ReadTestCaseExecutionImage?id=" + this.id + "&test=" + this.test + "&testcase=" + this.testcase + "&type=control&step=" + this.step + "&sequence=" + this.sequence + "&sequenceControl=" + this.control).then(function(data){

        var headerToAdd = data[0];
        var bodyToAdd = data[1];

        if(headerToAdd != undefined) {
            var cnt = headerToAdd.contents();
            $(header).find("#contentField").removeClass("col-sm-12").addClass("col-sm-"+(12-f.getIt()));
            $(header).find(".row").append(cnt);
        }

        if(bodyToAdd != undefined) {
            var cnt = bodyToAdd.contents();
            $(content).append(cnt);
        }

    },function(e){
        // No File Found
    });

};

Control.prototype.setStep = function (step) {
    this.step = step;
};

Control.prototype.setSequence = function (sequence) {
    this.sequence = sequence;
};

Control.prototype.setControl = function (control) {
    this.control = control;
};

Control.prototype.generateHeader = function () {
    var scope = this;
    var content = $("<div></div>").addClass("content");
    var firstRow = $("<div></div>").addClass("row ");
    var contentField = $("<div></div>").addClass("col-sm-12").attr("id","contentField");
    var returnMessageField = $("<h4>").attr("style", "font-size:.9em;margin:0px;line-height:1;height:.9em;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;");
    var descriptionField = $("<h4>").attr("style", "font-size:1.2em;margin:0px;line-height:1;height:1.2em;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;");

    returnMessageField.text(this.returnMessage);
    descriptionField.text(this.description);

    contentField.append(descriptionField);
    contentField.append(returnMessageField);

    firstRow.append(contentField);

    content.append(firstRow);

    return content;
};

Control.prototype.generateContent = function () {
    var doc = new Doc();
    var obj = this;

    var secondRow = $("<div></div>").addClass("row");
    var thirdRow = $("<div></div>").addClass("row");
    var fourthRow = $("<div></div>").addClass("row");
    var fifthRow = $("<div></div>").addClass("row");
    var container = $("<div id='content-container'></div>").addClass("action-group row list-group-item").css("margin-left","25px");

    var descField = $("<input type='text' class='form-control' id='description'>").prop("readonly",true);
    var returnCodeField = $("<input type='text' class='form-control' id='returncode'>").prop("readonly",true);
    var controlTypeField = $("<input type='text' class='form-control' id='controltype'>").prop("readonly",true);
    var value1Field = $("<input type='text' class='form-control' id='value1'>").prop("readonly",true);
    var value2Field = $("<input type='text' class='form-control' id='value2'>").prop("readonly",true);
    var timeField = $("<input type='text' class='form-control' id='time'>").prop("readonly",true);
    var returnMessageField = $("<textarea class='form-control' id='returnmessage'>").prop("readonly",true);
    var fatalField = $("<input type='text' class='form-control' id='fatal'>").prop("readonly",true);
    var sortField = $("<input type='text' class='form-control' id='sort'>").prop("readonly",true);

    var descGroup = $("<div class='form-group'></div>").append($("<label for='description'>" + doc.getDocLabel("page_executiondetail","description") + "</label>")).append(descField);
    var returncodeGroup = $("<div class='form-group'></div>").append($("<label for='returncode'>" + doc.getDocLabel("page_executiondetail","return_code") + "</label>")).append(returnCodeField);
    var returnmessageGroup = $("<div class='form-group'></div>").append($("<label for='returnmessage'>" + doc.getDocLabel("page_executiondetail","return_message") + "</label>")).append(returnMessageField);
    var controlTypeGroup = $("<div class='form-group'></div>").append($("<label for='controltype'>" + doc.getDocLabel("page_executiondetail","control_type") + "</label>")).append(controlTypeField);
    var controlValueGroup = $("<div class='form-group'></div>").append($("<label for='controlvalue'>" + doc.getDocLabel("page_executiondetail","value1") + "</label>")).append(value1Field);
    var timeGroup = $("<div class='form-group'></div>").append($("<label for='time'>" + doc.getDocLabel("page_executiondetail","time") + "</label>")).append(timeField);
    var controlPropertyGroup = $("<div class='form-group'></div>").append($("<label for='controlproperty'>" + doc.getDocLabel("page_executiondetail","value2") + "</label>")).append(value2Field);
    var fatalGroup = $("<div class='form-group'></div>").append($("<label for='fatal'>" + doc.getDocLabel("page_executiondetail","fatal") + "</label>")).append(fatalField);
    var sortGroup = $("<div class='form-group'></div>").append($("<label for='sort'>" + doc.getDocLabel("page_executiondetail","sort") + "</label>")).append(sortField);



    descField.val(this.sequence + " - " + this.description);
    returnCodeField.val(this.returnCode);
    returnMessageField.val(this.returnMessage);
    controlTypeField.val(this.controlType);
    timeField.val((this.endlong - this.startlong) + " ms");
    value1Field.val(this.value1);
    value2Field.val(this.value2);
    fatalField.val(this.fatal);
    sortField.val(this.sort);

    secondRow.append($("<div></div>").addClass("col-sm-4").append(returncodeGroup));
    secondRow.append($("<div></div>").addClass("col-sm-4").append(descGroup));
    secondRow.append($("<div></div>").addClass("col-sm-4").append(timeGroup));
    fifthRow.append($("<div></div>").addClass("col-sm-4").append(sortGroup));
    fifthRow.append($("<div></div>").addClass("col-sm-4").append(fatalGroup));
    thirdRow.append($("<div></div>").addClass("col-sm-4").append(controlTypeGroup));
    thirdRow.append($("<div></div>").addClass("col-sm-4").append(controlValueGroup));
    thirdRow.append($("<div></div>").addClass("col-sm-4").append(controlPropertyGroup));
    fourthRow.append($("<div></div>").addClass("col-sm-12").append(returnmessageGroup));

    container.append(secondRow);
    container.append(fifthRow);
    container.append(thirdRow);
    container.append(fourthRow);

    return container;
};

Control.prototype.getJsonData = function () {
    var json = {};

    json.toDelete = this.toDelete;
    json.test = this.test;
    json.testcase = this.testcase;
    json.step = this.step;
    json.sequence = this.sequence;
    json.control = this.control;
    json.description = this.description;
    json.type = this.type;
    json.controlProperty = this.value1;
    json.controlValue = this.value2;
    json.fatal = this.fatal;
    json.screenshotFileName = this.screenshotFileName;

    return json;
};

/**
 * File Utilities
 */

var File = function(){
    var scope = this;
    var it = 0;
    // A div to store what to add in the header (Only the content of the div will be add)
    var containerHeader = $("<div>");
    // A div to store what to add in the body
    var containerBody = $("<div>");
    this.checkFile = function(data, src, id){
        return new Promise(function(resolve, reject){
            // Check if Picture

            var xhr = new XMLHttpRequest();
            xhr.open('GET', src + id, true);
            xhr.responseType = 'blob';

            xhr.onload = function(e) {
                var description = this.getResponseHeader("Description");
                if (this.status == 200 && this.response != undefined && this.response.size > 0) {
                    // get binary data as a response
                    var blob = this.response;

                    // We want to know the type of the File (The type of the blob is trustfully, always xml)
                    var fileReader = new FileReader();
                    fileReader.onloadend = function(e) {
                        var arr = (new Uint8Array(e.target.result)).subarray(0, 4);
                        var header = "";
                        for(var i = 0; i < arr.length; i++) {
                            header += arr[i].toString(16);
                        }

                        // Check the file signature against known types
                        var type;
                        switch (header) {
                            case "89504e47":
                                type = "image/png";
                                break;
                            case "47494638":
                                type = "image/gif";
                                break;
                            case "ffd8ffd8":
                            case "ffd8ffe0":
                            case "ffd8ffe1":
                            case "ffd8ffe2":
                                type = "image/jpeg";
                                break;
                            case "25504446":
                                type = "application/pdf";
                                break;
                            default:
                                type = "text/plain";
                                break;
                        }

                        // We create the view depending the type
                        var fileHeader;
                        var fileBody;
                        var nowit = it;
                        if(type == "image/png" || type == "image/gif" || type == "image/jpeg") {
                            var urlCreator = window.URL || window.webkitURL;
                            var imageUrl = urlCreator.createObjectURL(blob);
                            fileHeader = $("<div>").addClass("col-sm-1").css("padding","0px 7px 0px 7px").append($("<img>").attr("src", imageUrl).css("height","30px").click(function(e){
                                showPicture(description, src + id);
                                return false;
                            }));

                            //Then we add it in the container and we increment the iterator
                            if(fileHeader != undefined || fileBody != undefined) {
                                scope.foundFile(data, src, fileHeader, fileBody).then(function () {
                                    resolve([containerHeader,containerBody]);
                                });
                            }else{
                                reject(e);
                            }

                        }else if(type == "text/plain"){
                            var fileReader2 = new FileReader();
                            fileReader2.onloadend = function(evt){
                                // file is loaded
                                var result = evt.target.result;
                                //We create the view, what to add in the header and the body
                                fileBody = $("<div>").addClass("row").append(
                                    $("<div>").addClass("col-sm-12").append(
                                        $("<div class='form-group'></div>")
                                            .append($("<label for='action'>" + description + "</label>"))
                                            .append($("<textarea class='form-control' id='textResponse"+nowit+"'>").prop("readonly",true).val(result)
                                        )
                                    )
                                );
                                fileHeader =  $("<div>").addClass("col-sm-2").css("padding","0px 7px 0px 7px").append(
                                    $("<button type='button'>")
                                        .addClass("btn btn-outline-primary")
                                        .css("height","30px")
                                        .css("width","100%")
                                        .css("max-width","100%")
                                        .css("display","inline-block")
                                        .css("overflow","hidden")
                                        .css("text-overflow","ellipsis")
                                        .css("white-space","nowrap")
                                        .css("font-size","small")
                                        .html('<span class="glyphicon glyphicon-file text-muted" aria-hidden="true"></span><span class="text-muted">'+ description +'</span>')
                                        .click(function(e){
                                            showTextArea(description,result);
                                            return false;
                                        })
                                );
                                //We take one more col
                                it++;
                                //Then we add it in the container and we increment the iterator
                                if(fileHeader != undefined || fileBody != undefined) {
                                    scope.foundFile(data, src, fileHeader, fileBody).then(function () {
                                        resolve([containerHeader,containerBody]);
                                    });
                                }else{
                                    reject(e);
                                }
                            };
                            fileReader2.readAsText(blob);
                        }
                    };
                    fileReader.readAsArrayBuffer(blob);
                }else{
                    reject(e);
                }
            };

            xhr.send();
        });
    };

    this.getFiles = function(data, src){
        return this.checkFile(data,src + "&iterator=", it);
    };

    this.getIt = function(){
        return it;
    };

    this.foundFile = function(data, src, fileHeader, fileBody){
        var scope = this;
        it++;
        return new Promise(function(resolve, reject) {
            scope.checkFile(data, src, it).then(function () {
                if(fileHeader != undefined) {
                    containerHeader.append(fileHeader);
                }
                if(fileBody != undefined){
                    containerBody.append(fileBody);
                }
                resolve([containerHeader, containerBody]);
            },function (e) {
                if(fileHeader != undefined) {
                    containerHeader.append(fileHeader);
                }
                if(fileBody != undefined){
                    containerBody.append(fileBody);
                }
                resolve([containerHeader, containerBody]);
            });
        });
    };

};
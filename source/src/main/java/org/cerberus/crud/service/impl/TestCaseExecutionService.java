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
package org.cerberus.crud.service.impl;

import java.awt.image.BufferedImage;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import org.cerberus.crud.dao.ITestCaseExecutionDAO;
import org.cerberus.crud.entity.Parameter;
import org.cerberus.crud.entity.TestCaseExecutionData;
import org.cerberus.crud.service.*;
import org.cerberus.engine.entity.MessageEvent;
import org.cerberus.engine.entity.MessageGeneral;
import org.cerberus.crud.entity.TestCase;
import org.cerberus.crud.entity.TestCaseExecution;
import org.cerberus.exception.CerberusException;
import org.cerberus.log.MyLogger;
import org.cerberus.enums.MessageEventEnum;
import org.cerberus.enums.MessageGeneralEnum;
import org.cerberus.util.ParameterParserUtil;
import org.cerberus.util.answer.Answer;
import org.cerberus.util.answer.AnswerItem;
import org.cerberus.util.answer.AnswerList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author bcivel
 */
@Service
public class TestCaseExecutionService implements ITestCaseExecutionService {

    @Autowired
    ITestCaseExecutionDAO testCaseExecutionDao;
    @Autowired
    ITestCaseStepExecutionService testCaseStepExecutionService;
    @Autowired
    IParameterService parameterService;
    @Autowired
    ITestCaseStepActionExecutionService testCaseStepActionExecutionService;
    @Autowired
    ITestCaseExecutionDataService testCaseExecutionDataService;
    @Autowired
    ITestCaseStepActionControlExecutionService testCaseStepActionControlExecutionService;
    @Autowired
    ITestCaseService testCaseService;

    private static final Logger LOG = Logger.getLogger(TestCaseExecutionService.class);


    @Override
    public long insertTCExecution(TestCaseExecution tCExecution) throws CerberusException {
        return testCaseExecutionDao.insertTCExecution(tCExecution);
    }

    @Override
    public void updateTCExecution(TestCaseExecution tCExecution) throws CerberusException {
        testCaseExecutionDao.updateTCExecution(tCExecution);
    }

    @Override
    public AnswerItem readLastByCriteria(String application) {
        return testCaseExecutionDao.readLastByCriteria(application);
    }

    @Override
    public TestCaseExecution findLastTCExecutionByCriteria(String test, String testCase, String environment, String country,
            String build, String revision) throws CerberusException {
        return testCaseExecutionDao.findLastTCExecutionByCriteria(test, testCase, environment, country, build, revision);
    }

    @Override
    public TestCaseExecution findLastTCExecutionByCriteria(String test, String testCase, String environment, String country,
            String build, String revision, String browser, String browserVersion,
            String ip, String port, String tag) {
        return this.testCaseExecutionDao.findLastTCExecutionByCriteria(test, testCase, environment, country, build, revision, browser, browserVersion, ip, port, tag);
    }

    @Override
    public List<TestCaseExecution> findTCExecutionbyCriteria1(String dateLimitFrom, String test, String testCase, String application, String country, String environment, String controlStatus, String status) throws CerberusException {
        // Transform empty parameter in % in order to remove from SQL filter (thanks to the like operator).
        test = ParameterParserUtil.wildcardIfEmpty(test);
        testCase = ParameterParserUtil.wildcardIfEmpty(testCase);
        application = ParameterParserUtil.wildcardIfEmpty(application);
        country = ParameterParserUtil.wildcardIfEmpty(country);
        environment = ParameterParserUtil.wildcardIfEmpty(environment);
        controlStatus = ParameterParserUtil.wildcardIfEmpty(controlStatus);
        status = ParameterParserUtil.wildcardIfEmpty(status);
        return testCaseExecutionDao.findExecutionbyCriteria1(dateLimitFrom, test, testCase, application, country, environment, controlStatus, status);
    }

    @Override
    public long registerRunID(TestCaseExecution tCExecution) throws CerberusException {

        /**
         * Insert TestCaseExecution
         */
        long runID = 0;
        try {
            runID = this.insertTCExecution(tCExecution);
        } catch (CerberusException ex) {
            MyLogger.log(TestCaseExecutionService.class.getName(), Level.FATAL, ex.toString());
            throw new CerberusException(ex.getMessageError());
        }
        return runID;
    }

    @Override
    public TestCaseExecution findTCExecutionByKey(long id) throws CerberusException {
        return testCaseExecutionDao.findTCExecutionByKey(id);
    }

    @Override
    public List<TestCaseExecution> findExecutionsByCampaignNameAndTag(String campaign, String tag) throws CerberusException {
        return testCaseExecutionDao.findExecutionsByCampaignNameAndTag(campaign, tag);
    }

    @Override
    public TestCaseExecution findLastTCExecutionInGroup(String test, String testCase, String environment, String country,
            String build, String revision, String browser, String browserVersion,
            String ip, String port, String tag) {
        return this.testCaseExecutionDao.findLastTCExecutionInGroup(test, testCase, environment, country, build, revision, browser, browserVersion, ip, port, tag);
    }

    @Override
    public TestCaseExecution findLastTestCaseExecutionNotPE(String test, String testCase) throws CerberusException {
        return testCaseExecutionDao.findLastTestCaseExecutionNotPE(test, testCase);
    }

    @Override
    public List<String> findDistinctTag(boolean withUUIDTag) throws CerberusException {
        return testCaseExecutionDao.findDistinctTag(withUUIDTag);
    }

    @Override
    public void setTagToExecution(long id, String tag) throws CerberusException {
        testCaseExecutionDao.setTagToExecution(id, tag);
    }

    @Override
    public AnswerList findTagList(int tagnumber) throws CerberusException {
        return testCaseExecutionDao.findTagList(tagnumber);
    }

    @Override
    public AnswerList readByTagByCriteria(String tag, int start, int amount, String sort, String searchTerm, Map<String, List<String>> individualSearch) throws CerberusException {
        return testCaseExecutionDao.readByTagByCriteria(tag, start, amount, sort, searchTerm, individualSearch);
    }

    @Override
    public AnswerList readDistinctEnvCoutnryBrowserByTag(String tag) {
        return testCaseExecutionDao.readDistinctEnvCoutnryBrowserByTag(tag);
    }

    @Override
    public AnswerList readDistinctColumnByTag(String tag, boolean env, boolean country, boolean browser, boolean app) {
        return testCaseExecutionDao.readDistinctColumnByTag(tag, env, country, browser, app);
    }

    @Override
    public List<TestCaseExecution> createAllTestCaseExecution(List<TestCase> testCaseList, List<String> envList, List<String> countryList) {
        List<TestCaseExecution> result = new ArrayList<TestCaseExecution>();

        for (TestCase tc : testCaseList) {
            for (String environment : envList) {
                for (String country : countryList) {
                    TestCaseExecution execution = new TestCaseExecution();

                    execution.setTest(tc.getTest());
                    execution.setTestCase(tc.getTestCase());
                    execution.setEnvironment(environment);
                    execution.setCountry(country);
                    result.add(execution);
                }
            }
        }

        return result;
    }

    @Override
    public AnswerList readBySystemByVarious(String system, List<String> testList, List<String> applicationList, List<String> projectList, List<String> tcstatusList,
            List<String> groupList, List<String> tcactiveList, List<String> priorityList, List<String> targetsprintList, List<String> targetrevisionList,
            List<String> creatorList, List<String> implementerList, List<String> buildList, List<String> revisionList, List<String> environmentList,
            List<String> countryList, List<String> browserList, List<String> tcestatusList, String ip, String port, String tag, String browserversion,
            String comment, String bugid, String ticket) {

        return testCaseExecutionDao.readBySystemByVarious(system, testList, applicationList, projectList, tcstatusList, groupList, tcactiveList, priorityList, targetsprintList,
                targetrevisionList, creatorList, implementerList, buildList, revisionList, environmentList, countryList, browserList, tcestatusList,
                ip, port, tag, browserversion, comment, bugid, ticket);
    }

    @Override
    public AnswerItem readByKey(long executionId) {
        return testCaseExecutionDao.readByKey(executionId);
    }

    @Override
    public AnswerItem readByKeyWithDependency(long executionId) {
        AnswerItem tce = this.readByKey(executionId);
        TestCaseExecution testCaseExecution = (TestCaseExecution) tce.getItem();

        AnswerItem ai = testCaseService.readByKeyWithDependency(testCaseExecution.getTest(), testCaseExecution.getTestCase());
        testCaseExecution.setTestCaseObj((TestCase) ai.getItem());

        AnswerList a = testCaseExecutionDataService.readById(executionId);
        testCaseExecution.setTestCaseExecutionDataList(a.getDataList());

        AnswerList steps = testCaseStepExecutionService.readByVarious1WithDependency(executionId, testCaseExecution.getTest(), testCaseExecution.getTestCase());
        testCaseExecution.setTestCaseStepExecutionAnswerList(steps);
        AnswerItem response = new AnswerItem(testCaseExecution, tce.getResultMessage());
        return response;
    }

    @Override
    public TestCaseExecution convert(AnswerItem answerItem) throws CerberusException {
        if (answerItem.isCodeEquals(MessageEventEnum.DATA_OPERATION_OK.getCode())) {
            //if the service returns an OK message then we can get the item
            return (TestCaseExecution) answerItem.getItem();
        }
        throw new CerberusException(new MessageGeneral(MessageGeneralEnum.DATA_OPERATION_ERROR));
    }

    @Override
    public List<TestCaseExecution> convert(AnswerList answerList) throws CerberusException {
        if (answerList.isCodeEquals(MessageEventEnum.DATA_OPERATION_OK.getCode())) {
            //if the service returns an OK message then we can get the item
            return (List<TestCaseExecution>) answerList.getDataList();
        }
        throw new CerberusException(new MessageGeneral(MessageGeneralEnum.DATA_OPERATION_ERROR));
    }

    @Override
    public void convert(Answer answer) throws CerberusException {
        if (answer.isCodeEquals(MessageEventEnum.DATA_OPERATION_OK.getCode())) {
            //if the service returns an OK message then we can get the item
            return;
        }
        throw new CerberusException(new MessageGeneral(MessageGeneralEnum.DATA_OPERATION_ERROR));
    }

}

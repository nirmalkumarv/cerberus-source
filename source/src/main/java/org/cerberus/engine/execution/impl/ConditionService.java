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
package org.cerberus.engine.execution.impl;

import org.apache.log4j.Logger;
import org.cerberus.crud.entity.TestCaseCountryProperties;
import org.cerberus.crud.entity.TestCaseExecution;
import org.cerberus.crud.entity.TestCaseStepAction;
import org.cerberus.engine.entity.MessageEvent;
import org.cerberus.engine.execution.IConditionService;
import org.cerberus.enums.MessageEventEnum;
import org.cerberus.util.StringUtil;
import org.cerberus.util.answer.AnswerItem;
import org.springframework.stereotype.Service;

/**
 * {Insert class description here}
 *
 * @author vertigo17
 */
@Service
public class ConditionService implements IConditionService {

    /**
     * The associated {@link org.apache.log4j.Logger} to this class
     */
    private static final Logger LOG = Logger.getLogger(ConditionService.class);

    @Override
    public AnswerItem<Boolean> evaluateCondition(String conditionOper, String conditionValue1, String conditionValue2, TestCaseExecution tCExecution) {

        AnswerItem ans = new AnswerItem();
        /**
         * CONDITION Management is treated here. Checking if the
         * action/control/step/execution can be execued here depending on the
         * condition operator and value.
         */
        boolean execute_Action = true;
        LOG.debug("Starting Evaluation condition : " + conditionOper);
        MessageEvent mes = new MessageEvent(MessageEventEnum.CONDITION_PENDING);
        switch (conditionOper) {
            case TestCaseStepAction.CONDITIONOPER_ALWAYS:
            case "": // In case condition is not defined, it is considered as always.
                mes = new MessageEvent(MessageEventEnum.CONDITION_PENDING);
                execute_Action = true;
                break;

            case TestCaseStepAction.CONDITIONOPER_IFPROPERTYEXIST:
                ans = evaluateCondition_ifPropertyExist(conditionOper, conditionValue1, tCExecution);
                execute_Action = (Boolean) ans.getItem();
                mes = ans.getResultMessage();
                break;

            case TestCaseStepAction.CONDITIONOPER_NEVER:
                mes = new MessageEvent(MessageEventEnum.CONDITION_NEVER);
                mes.setDescription(mes.getDescription().replace("%COND%", conditionOper));
                execute_Action = false;
                break;

            default:
                mes = new MessageEvent(MessageEventEnum.CONDITION_UNKNOWN);
                mes.setDescription(mes.getDescription().replace("%COND%", conditionOper));
                execute_Action = false;
        }
        LOG.debug("Finished Evaluation condition : " + execute_Action);

        ans.setItem(execute_Action);
        ans.setResultMessage(mes);
        return ans;
    }

    private AnswerItem<Boolean> evaluateCondition_ifPropertyExist(String conditionOper, String conditionValue1, TestCaseExecution tCExecution) {
        if (LOG.isDebugEnabled()) {
            LOG.debug("Checking if property Exist");
        }
        AnswerItem ans = new AnswerItem();
        MessageEvent mes = new MessageEvent(MessageEventEnum.CONDITION_PENDING);

        boolean execute_Action = true;
        if (StringUtil.isNullOrEmpty(conditionValue1)) {
            mes = new MessageEvent(MessageEventEnum.CONDITION_IFPROPERTYEXIST_MISSINGPARAMETER);
            mes.setDescription(mes.getDescription().replace("%COND%", conditionOper));
            execute_Action = false;

        } else {
            String myCountry = tCExecution.getCountry();
            String myProperty = conditionValue1;
            execute_Action = false;
            for (TestCaseCountryProperties prop : tCExecution.getTestCaseCountryPropertyList()) {
                LOG.debug(prop.getCountry() + " - " + myCountry + " - " + prop.getProperty() + " - " + myProperty);
                if ((prop.getCountry().equals(myCountry)) && (prop.getProperty().equals(myProperty))) {
                    execute_Action = true;
                }
            }
            if (execute_Action == false) {
                mes = new MessageEvent(MessageEventEnum.CONDITION_IFPROPERTYEXIST_NOTEXIST);
                mes.setDescription(mes.getDescription().replace("%COND%", conditionOper));
                mes.setDescription(mes.getDescription().replace("%PROP%", conditionValue1));
                mes.setDescription(mes.getDescription().replace("%COUNTRY%", tCExecution.getCountry()));
            }
        }
        ans.setItem(execute_Action);
        ans.setResultMessage(mes);
        return ans;
    }

}

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
package org.cerberus.servlet.crud.testcampaign;

import org.cerberus.crud.entity.CampaignContent;
import org.cerberus.engine.entity.MessageEvent;
import org.cerberus.crud.factory.IFactoryCampaignContent;
import org.cerberus.crud.service.ICampaignContentService;
import org.cerberus.crud.service.ICampaignService;
import org.cerberus.crud.service.ILogEventService;
import org.cerberus.crud.service.impl.LogEventService;
import org.cerberus.enums.MessageEventEnum;
import org.cerberus.enums.MessageGeneralEnum;
import org.cerberus.exception.CerberusException;
import org.cerberus.util.ParameterParserUtil;
import org.cerberus.util.answer.Answer;
import org.cerberus.util.answer.AnswerItem;
import org.json.JSONException;
import org.json.JSONObject;
import org.owasp.html.PolicyFactory;
import org.owasp.html.Sanitizers;
import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.logging.Logger;

/**
 * @author memiks
 */
@WebServlet(name = "DeleteCampaignContent2", urlPatterns = {"/DeleteCampaignContent2"})
public class DeleteCampaignContent2 extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request  servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException      if an I/O error occurs
     */
    final void processRequest(final HttpServletRequest request, final HttpServletResponse response)
            throws ServletException, IOException, CerberusException, JSONException {
        JSONObject jsonResponse = new JSONObject();
        ApplicationContext appContext = WebApplicationContextUtils.getWebApplicationContext(this.getServletContext());
        Answer ans = new Answer();
        MessageEvent msg = new MessageEvent(MessageEventEnum.DATA_OPERATION_ERROR_UNEXPECTED);
        msg.setDescription(msg.getDescription().replace("%DESCRIPTION%", ""));
        ans.setResultMessage(msg);

        response.setContentType("text/html;charset=UTF-8");
        String charset = request.getCharacterEncoding();

        // Parameter that are already controled by GUI (no need to decode) --> We SECURE them
        // Parameter that needs to be secured --> We SECURE+DECODE them
        int id = ParameterParserUtil.parseIntegerParamAndDecode(request.getParameter("key"), 0, charset);
        // Parameter that we cannot secure as we need the html --> We DECODE them

        ICampaignContentService campaignContentService = appContext.getBean(ICampaignContentService.class);

        AnswerItem<CampaignContent> camp = campaignContentService.findCampaignContentByKey(id);
        if (camp.isCodeEquals(new MessageEvent(MessageEventEnum.DATA_OPERATION_OK).getCode())) {
            ans = campaignContentService.delete(camp.getItem());
        }

        /**
         * Adding Log entry.
         */
        ILogEventService logEventService = appContext.getBean(LogEventService.class);
        logEventService.createPrivateCalls("/CreateCampaign", "CREATE", "Create Campaign : " + id, request);


        /**
         * Formating and returning the json result.
         */
        jsonResponse.put("messageType", ans.getResultMessage().getMessage().getCodeString());
        jsonResponse.put("message", ans.getResultMessage().getDescription());

        response.getWriter().print(jsonResponse);
        response.getWriter().flush();
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">

    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request  servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException      if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            this.processRequest(request, response);
        } catch (CerberusException ex) {
            Logger.getLogger(DeleteCampaign2.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (JSONException ex) {
            Logger.getLogger(DeleteCampaign2.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request  servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException      if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            this.processRequest(request, response);
        } catch (CerberusException ex) {
            Logger.getLogger(DeleteCampaign2.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (JSONException ex) {
            Logger.getLogger(DeleteCampaign2.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>
}

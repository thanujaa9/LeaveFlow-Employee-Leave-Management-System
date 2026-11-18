package com.leaveflow.dto.request;

public class ApprovalDecisionRequest {
    private String comment;

    public ApprovalDecisionRequest() {}

    public ApprovalDecisionRequest(String comment) {
        this.comment = comment;
    }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}

package com.brassam.helper.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.ErrorResponseException;
import org.springframework.http.ProblemDetail;

public abstract class BrassamException extends RuntimeException {
    private final HttpStatus status;

    protected BrassamException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public ProblemDetail toProblemDetail() {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(status, getMessage());
        pd.setTitle(status.getReasonPhrase());
        return pd;
    }
}

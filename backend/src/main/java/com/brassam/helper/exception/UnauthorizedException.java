package com.brassam.helper.exception;

import org.springframework.http.HttpStatus;

public class UnauthorizedException extends BrassamException {
    public UnauthorizedException(String message) {
        super(message, HttpStatus.UNAUTHORIZED);
    }
}

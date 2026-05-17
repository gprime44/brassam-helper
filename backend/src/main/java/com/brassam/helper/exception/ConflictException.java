package com.brassam.helper.exception;

import org.springframework.http.HttpStatus;

public class ConflictException extends BrassamException {
    public ConflictException(String message) {
        super(message, HttpStatus.CONFLICT);
    }
}

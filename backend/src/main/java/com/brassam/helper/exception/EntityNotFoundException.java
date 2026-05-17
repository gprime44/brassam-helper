package com.brassam.helper.exception;

import org.springframework.http.HttpStatus;

public class EntityNotFoundException extends BrassamException {
    public EntityNotFoundException(String entity, Object id) {
        super(entity + " with ID " + id + " not found", HttpStatus.NOT_FOUND);
    }
}

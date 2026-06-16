package com.logistics.route_service.exception;

public class RouteNotFoundException extends  RuntimeException{
    public RouteNotFoundException(String msg){
        super(msg);
    }
    public RouteNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}


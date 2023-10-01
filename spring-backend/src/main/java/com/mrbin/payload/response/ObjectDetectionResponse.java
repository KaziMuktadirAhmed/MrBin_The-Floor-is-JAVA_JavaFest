package com.mrbin.payload.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ObjectDetectionResponse {
    private String query;
    private double min_price;
    private double max_price;
}

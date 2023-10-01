package com.mrbin.controllers;

import com.mrbin.service.ObjectDetectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController("/api/v1/detect")
@PreAuthorize("hasRole('USER')")
public class ObjectDetectionController {

    @Autowired
    private ObjectDetectionService objectDetectionService;

    @PostMapping(path = "/upload", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> uploadImageForObjectDetection(@RequestPart("file") MultipartFile file) {
        return objectDetectionService.getObjectNames(file);
    }
}

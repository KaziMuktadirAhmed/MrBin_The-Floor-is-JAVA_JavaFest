package com.mrbin.service;

import com.mrbin.models.Product;
import com.mrbin.payload.response.MessageResponse;
import com.mrbin.payload.response.ObjectDetectionResponse;
import com.mrbin.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@Service
public class ObjectDetectionService {

    @Autowired
    private ProductRepository productRepository;

    private final RestTemplate restTemplate;

    public ObjectDetectionService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public ResponseEntity<?> getObjectNames(MultipartFile file) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", file);

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        ResponseEntity<String> responseEntity = restTemplate.exchange("http://localhost:8000/object_detection", HttpMethod.POST, requestEntity, String.class);

        if(responseEntity.getStatusCode() == HttpStatus.OK) {
            List<ObjectDetectionResponse> responses = queryForProduct(Collections.singletonList(responseEntity.getBody()));
            return new ResponseEntity<>(responses, HttpStatus.OK);
        }
        return new ResponseEntity<>(new MessageResponse("Internal server error, ???"), HttpStatus.OK);
    }

    public ArrayList<ObjectDetectionResponse> queryForProduct(List<String> all_query) {
        ArrayList<ObjectDetectionResponse> productSuggestion = new ArrayList<>();

        for (String queryStr : all_query) {
            Optional<List<Product>> productQuery = productRepository.findAllByNameContainsIgnoreCase(queryStr);

            if(productQuery.isPresent()) {
                List<Product> probableProducts = productQuery.get();
                ArrayList<Double> minMaxPrice = findMinAndMaxPrice(probableProducts);
                ObjectDetectionResponse objectDetectionResponse = new ObjectDetectionResponse(queryStr, minMaxPrice.get(0), minMaxPrice.get(1));
                productSuggestion.add(objectDetectionResponse);
            }
        }
        return productSuggestion;
    }

    private ArrayList<Double> findMinAndMaxPrice(List<Product> products) {
        ArrayList<Double> result = new ArrayList<>();
        products.sort(Comparator.comparingDouble(Product::getAskingPrice));
        result.add(products.get(0).getAskingPrice());
        result.add(products.get(products.size()-1).getAskingPrice());
        return result;
    }
}

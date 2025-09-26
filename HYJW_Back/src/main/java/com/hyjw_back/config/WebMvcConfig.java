package com.hyjw_back.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    /* application.properties에 쓰인 파라미터 값을 읽어옴 */
    @Value("${uploadPath}")
    String uploadPath;

    /* 서버 컴퓨터의 파일 시스템에 위치하는 자원(사진)을 요청 url과 매핑해서 응답하도록 함 */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/images/**")
                .addResourceLocations(uploadPath);
    }
}

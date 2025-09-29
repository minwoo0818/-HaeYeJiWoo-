package com.hyjw_back.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    /* 💡 수정: application.properties의 itemImgLocation 값을 읽어옴 */
    @Value("${itemImgLocation}")
    String itemImgLocation;

    /* 서버 컴퓨터의 파일 시스템에 위치하는 자원(사진)을 요청 url과 매핑해서 응답하도록 함 */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        /* 💡 수정: 클라이언트 요청 경로를 '/files/**'로 변경하고, itemImgLocation 경로로 연결 */
        // 클라이언트의 /files/** 요청을 'file:///C:/typeapp/-HaYeJiWoo-/images/' 와 연결합니다.
        // itemImgLocation 변수 값에 'file:///' 접두사를 붙이고, 경로 끝에 '/'를 추가하여 사용합니다.
        registry.addResourceHandler("/files/**")
                .addResourceLocations("file:///" + itemImgLocation + "/");

        // 만약 기존 /images/ 경로도 필요하다면 아래 줄을 남겨두세요. (단, DB에 /images/로 저장된 파일이 없어야 함)
        // registry.addResourceHandler("/images/**")
        //         .addResourceLocations("file:///" + itemImgLocation + "/");
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
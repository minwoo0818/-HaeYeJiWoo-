package com.hyjw_back.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FileSettingsDto {
    private int file_max_num;
    private long file_size;
    private String file_type;
}

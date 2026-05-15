package com.docgia.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NovelRequest {
    private String title;
    private String description;
    private String author;
    private String genres;
    private String coverImageUrl;
    private Boolean isPublic;
}

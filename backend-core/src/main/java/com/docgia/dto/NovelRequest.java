package com.docgia.dto;

import lombok.Data;

@Data
public class NovelRequest {
    private String title;
    private String description;
    private String author;
    private String genres;
    private String coverImageUrl;
    private Boolean isPublic;
}

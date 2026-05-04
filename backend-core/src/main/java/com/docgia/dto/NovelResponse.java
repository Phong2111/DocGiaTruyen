package com.docgia.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class NovelResponse {
    private Long id;
    private String title;
    private String description;
    private String coverImageUrl;
    private String author;
    private String genres;
    private String uploaderUsername;
    private Long uploaderId;
    private Boolean isPublic;
    private Double rating;
    private Integer viewCount;
    private Integer chapterCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

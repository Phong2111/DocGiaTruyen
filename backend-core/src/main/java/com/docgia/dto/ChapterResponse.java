package com.docgia.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ChapterResponse {
    private Long id;
    private Long novelId;
    private Integer chapterNumber;
    private String title;
    private String content; // Content is usually returned in detail view, maybe exclude in list view, but for now we keep it
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

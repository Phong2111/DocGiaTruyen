package com.docgia.dto;

import lombok.Data;

@Data
public class ChapterRequest {
    private String title;
    private String content;
    private Integer chapterNumber; // optional, if null auto assign
}

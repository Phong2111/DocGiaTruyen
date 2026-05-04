package com.docgia.controller;

import com.docgia.dto.ChapterRequest;
import com.docgia.dto.ChapterResponse;
import com.docgia.service.ChapterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/novels/{novelId}/chapters")
@RequiredArgsConstructor
public class ChapterController {

    private final ChapterService chapterService;

    @PostMapping
    public ResponseEntity<ChapterResponse> createChapter(@PathVariable Long novelId, @RequestBody ChapterRequest request, Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(chapterService.createChapter(novelId, request, username));
    }

    @GetMapping
    public ResponseEntity<List<ChapterResponse>> getChaptersByNovelId(@PathVariable Long novelId) {
        return ResponseEntity.ok(chapterService.getChaptersByNovelId(novelId));
    }

    @GetMapping("/{chapterId}")
    public ResponseEntity<ChapterResponse> getChapterById(@PathVariable Long novelId, @PathVariable Long chapterId) {
        // Technically novelId might not be needed for fetching chapter by ID if chapterId is unique,
        // but it's part of the path.
        return ResponseEntity.ok(chapterService.getChapterById(chapterId));
    }

    @PutMapping("/{chapterId}")
    public ResponseEntity<ChapterResponse> updateChapter(@PathVariable Long novelId, @PathVariable Long chapterId, @RequestBody ChapterRequest request, Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(chapterService.updateChapter(chapterId, request, username));
    }

    @DeleteMapping("/{chapterId}")
    public ResponseEntity<?> deleteChapter(@PathVariable Long novelId, @PathVariable Long chapterId, Authentication authentication) {
        String username = authentication.getName();
        chapterService.deleteChapter(chapterId, username);
        return ResponseEntity.ok().build();
    }
}

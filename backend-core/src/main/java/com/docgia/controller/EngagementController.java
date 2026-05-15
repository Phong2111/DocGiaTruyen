package com.docgia.controller;

import com.docgia.dto.CommentResponse;
import com.docgia.dto.EngagementStatus;
import com.docgia.service.EngagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/engagement")
@RequiredArgsConstructor
public class EngagementController {

    private final EngagementService engagementService;

    @GetMapping("/comments/{novelId}")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long novelId) {
        return ResponseEntity.ok(engagementService.getComments(novelId));
    }

    @PostMapping("/comments/{novelId}")
    public ResponseEntity<CommentResponse> postComment(
            @PathVariable Long novelId,
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        String content = request.get("content");
        String username = authentication.getName();
        return ResponseEntity.ok(engagementService.postComment(novelId, content, username));
    }

    @PostMapping("/rate/{novelId}")
    public ResponseEntity<?> rateNovel(
            @PathVariable Long novelId,
            @RequestBody Map<String, Integer> request,
            Authentication authentication) {
        Integer score = request.get("score");
        String username = authentication.getName();
        engagementService.rateNovel(novelId, score, username);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/bookmark/{novelId}")
    public ResponseEntity<Map<String, Boolean>> toggleBookmark(
            @PathVariable Long novelId,
            Authentication authentication) {
        String username = authentication.getName();
        boolean isBookmarked = engagementService.toggleBookmark(novelId, username);
        return ResponseEntity.ok(Map.of("bookmarked", isBookmarked));
    }

    @GetMapping("/status/{novelId}")
    public ResponseEntity<EngagementStatus> getStatus(
            @PathVariable Long novelId,
            Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.ok(EngagementStatus.builder()
                    .isBookmarked(false)
                    .userRating(null)
                    .build());
        }
        String username = authentication.getName();
        return ResponseEntity.ok(engagementService.getEngagementStatus(novelId, username));
    }
}

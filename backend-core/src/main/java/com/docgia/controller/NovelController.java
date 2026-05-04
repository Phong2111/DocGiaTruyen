package com.docgia.controller;

import com.docgia.dto.NovelRequest;
import com.docgia.dto.NovelResponse;
import com.docgia.service.NovelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/novels")
@RequiredArgsConstructor
public class NovelController {

    private final NovelService novelService;

    @PostMapping
    public ResponseEntity<NovelResponse> createNovel(@RequestBody NovelRequest request, Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(novelService.createNovel(request, username));
    }

    @GetMapping("/my")
    public ResponseEntity<List<NovelResponse>> getMyNovels(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(novelService.getMyNovels(username));
    }

    @GetMapping
    public ResponseEntity<List<NovelResponse>> getPublicNovels() {
        return ResponseEntity.ok(novelService.getPublicNovels());
    }

    @GetMapping("/search")
    public ResponseEntity<List<NovelResponse>> searchPublicNovels(
            @RequestParam(name = "q", required = false) String keyword) {
        return ResponseEntity.ok(novelService.searchPublicNovels(keyword));
    }

    @GetMapping("/{id}")
    public ResponseEntity<NovelResponse> getNovelById(@PathVariable Long id) {
        return ResponseEntity.ok(novelService.getNovelById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NovelResponse> updateNovel(@PathVariable Long id, @RequestBody NovelRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(novelService.updateNovel(id, request, username));
    }

    @PostMapping("/cover")
    public ResponseEntity<?> uploadCover(@RequestParam("file") MultipartFile file) {
        try {
            String uploadDir = "uploads/covers";
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFileName = StringUtils
                    .cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "cover.jpg");
            String extension = "";
            int i = originalFileName.lastIndexOf('.');
            if (i > 0) {
                extension = originalFileName.substring(i);
            }
            String fileName = UUID.randomUUID().toString() + extension;

            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = "/uploads/covers/" + fileName;
            return ResponseEntity.ok(Map.of("url", fileUrl));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error: Could not upload file"));
        }
    }
}

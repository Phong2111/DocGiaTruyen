package com.docgia.service;

import com.docgia.dto.NovelRequest;
import com.docgia.dto.NovelResponse;
import com.docgia.model.Novel;
import com.docgia.model.User;
import com.docgia.repository.ChapterRepository;
import com.docgia.repository.NovelRepository;
import com.docgia.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NovelService {

    private final NovelRepository novelRepository;
    private final UserRepository userRepository;
    private final ChapterRepository chapterRepository;

    public NovelResponse createNovel(NovelRequest request, String username) {
        User uploader = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Novel novel = Novel.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .author(request.getAuthor())
                .genres(request.getGenres())
                .coverImageUrl(request.getCoverImageUrl())
                .uploader(uploader)
                .isPublic(request.getIsPublic() != null ? request.getIsPublic() : false)
                .rating(0.0)
                .viewCount(0)
                .build();

        Novel savedNovel = novelRepository.save(novel);
        return mapToResponse(savedNovel);
    }

    public List<NovelResponse> getMyNovels(String username) {
        User uploader = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return novelRepository.findByUploaderId(uploader.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<NovelResponse> getPublicNovels() {
        return novelRepository.findByIsPublicTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<NovelResponse> searchPublicNovels(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getPublicNovels();
        }
        return novelRepository.searchPublicNovels(keyword).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public NovelResponse getNovelById(Long id) {
        Novel novel = novelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Novel not found"));
        return mapToResponse(novel);
    }

    public NovelResponse updateNovel(Long id, NovelRequest request, String username) {
        Novel novel = novelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Novel not found"));

        if (!novel.getUploader().getUsername().equals(username)) {
            throw new RuntimeException("Not authorized to update this novel");
        }

        novel.setTitle(request.getTitle());
        novel.setDescription(request.getDescription());
        novel.setAuthor(request.getAuthor());
        novel.setGenres(request.getGenres());
        novel.setCoverImageUrl(request.getCoverImageUrl());
        if (request.getIsPublic() != null) {
            novel.setIsPublic(request.getIsPublic());
        }

        Novel updatedNovel = novelRepository.save(novel);
        return mapToResponse(updatedNovel);
    }

    private NovelResponse mapToResponse(Novel novel) {
        int chapterCount = chapterRepository.countByNovelId(novel.getId());
        return NovelResponse.builder()
                .id(novel.getId())
                .title(novel.getTitle())
                .description(novel.getDescription())
                .coverImageUrl(novel.getCoverImageUrl())
                .author(novel.getAuthor())
                .genres(novel.getGenres())
                .uploaderUsername(novel.getUploader().getUsername())
                .uploaderId(novel.getUploader().getId())
                .isPublic(novel.getIsPublic())
                .rating(novel.getRating())
                .viewCount(novel.getViewCount())
                .chapterCount(chapterCount)
                .createdAt(novel.getCreatedAt())
                .updatedAt(novel.getUpdatedAt())
                .build();
    }
}

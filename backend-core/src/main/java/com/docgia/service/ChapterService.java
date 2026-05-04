package com.docgia.service;

import com.docgia.dto.ChapterRequest;
import com.docgia.dto.ChapterResponse;
import com.docgia.model.Chapter;
import com.docgia.model.Novel;
import com.docgia.repository.ChapterRepository;
import com.docgia.repository.NovelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChapterService {

    private final ChapterRepository chapterRepository;
    private final NovelRepository novelRepository;

    public ChapterResponse createChapter(Long novelId, ChapterRequest request, String username) {
        Novel novel = novelRepository.findById(novelId)
                .orElseThrow(() -> new RuntimeException("Novel not found"));

        if (!novel.getUploader().getUsername().equals(username)) {
            throw new RuntimeException("Not authorized to add chapter to this novel");
        }

        int chapterCount = chapterRepository.countByNovelId(novelId);
        int chapterNumber = (request.getChapterNumber() != null) ? request.getChapterNumber() : chapterCount + 1;

        Chapter chapter = Chapter.builder()
                .novel(novel)
                .chapterNumber(chapterNumber)
                .title(request.getTitle())
                .content(request.getContent())
                .build();

        Chapter savedChapter = chapterRepository.save(chapter);
        return mapToResponse(savedChapter);
    }

    public List<ChapterResponse> getChaptersByNovelId(Long novelId) {
        return chapterRepository.findByNovelIdOrderByChapterNumberAsc(novelId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ChapterResponse getChapterById(Long chapterId) {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new RuntimeException("Chapter not found"));
        return mapToResponse(chapter);
    }

    public ChapterResponse updateChapter(Long chapterId, ChapterRequest request, String username) {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new RuntimeException("Chapter not found"));

        if (!chapter.getNovel().getUploader().getUsername().equals(username)) {
            throw new RuntimeException("Not authorized to update this chapter");
        }

        chapter.setTitle(request.getTitle());
        chapter.setContent(request.getContent());
        if (request.getChapterNumber() != null) {
            chapter.setChapterNumber(request.getChapterNumber());
        }

        Chapter updatedChapter = chapterRepository.save(chapter);
        return mapToResponse(updatedChapter);
    }

    public void deleteChapter(Long chapterId, String username) {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new RuntimeException("Chapter not found"));

        if (!chapter.getNovel().getUploader().getUsername().equals(username)) {
            throw new RuntimeException("Not authorized to delete this chapter");
        }

        chapterRepository.delete(chapter);
    }

    private ChapterResponse mapToResponse(Chapter chapter) {
        return ChapterResponse.builder()
                .id(chapter.getId())
                .novelId(chapter.getNovel().getId())
                .chapterNumber(chapter.getChapterNumber())
                .title(chapter.getTitle())
                .content(chapter.getContent())
                .createdAt(chapter.getCreatedAt())
                .updatedAt(chapter.getUpdatedAt())
                .build();
    }
}

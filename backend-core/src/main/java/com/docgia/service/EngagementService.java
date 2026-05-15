package com.docgia.service;

import com.docgia.dto.CommentResponse;
import com.docgia.dto.EngagementStatus;
import com.docgia.model.*;
import com.docgia.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EngagementService {

    private final CommentRepository commentRepository;
    private final RatingRepository ratingRepository;
    private final BookmarkRepository bookmarkRepository;
    private final NovelRepository novelRepository;
    private final UserRepository userRepository;

    public List<CommentResponse> getComments(Long novelId) {
        return commentRepository.findByNovelIdOrderByCreatedAtDesc(novelId).stream()
                .map(comment -> CommentResponse.builder()
                        .id(comment.getId())
                        .content(comment.getContent())
                        .username(comment.getUser().getUsername())
                        .userId(comment.getUser().getId())
                        .avatarUrl(comment.getUser().getAvatarUrl())
                        .createdAt(comment.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public CommentResponse postComment(Long novelId, String content, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Novel novel = novelRepository.findById(novelId)
                .orElseThrow(() -> new RuntimeException("Novel not found"));

        Comment comment = Comment.builder()
                .content(content)
                .user(user)
                .novel(novel)
                .build();

        Comment savedComment = commentRepository.save(comment);
        return CommentResponse.builder()
                .id(savedComment.getId())
                .content(savedComment.getContent())
                .username(user.getUsername())
                .userId(user.getId())
                .avatarUrl(user.getAvatarUrl())
                .createdAt(savedComment.getCreatedAt())
                .build();
    }

    @Transactional
    public void rateNovel(Long novelId, Integer score, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Novel novel = novelRepository.findById(novelId)
                .orElseThrow(() -> new RuntimeException("Novel not found"));

        Optional<Rating> existingRating = ratingRepository.findByUserIdAndNovelId(user.getId(), novelId);
        
        if (existingRating.isPresent()) {
            existingRating.get().setScore(score);
            ratingRepository.save(existingRating.get());
        } else {
            Rating rating = Rating.builder()
                    .score(score)
                    .user(user)
                    .novel(novel)
                    .build();
            ratingRepository.save(rating);
        }

        // Update average rating on novel
        Double avgRating = ratingRepository.getAverageRatingByNovelId(novelId);
        novel.setRating(avgRating != null ? avgRating : 0.0);
        novelRepository.save(novel);
    }

    @Transactional
    public boolean toggleBookmark(Long novelId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Novel novel = novelRepository.findById(novelId)
                .orElseThrow(() -> new RuntimeException("Novel not found"));

        Optional<Bookmark> existingBookmark = bookmarkRepository.findByUserIdAndNovelId(user.getId(), novelId);
        
        if (existingBookmark.isPresent()) {
            bookmarkRepository.delete(existingBookmark.get());
            return false; // Removed
        } else {
            Bookmark bookmark = Bookmark.builder()
                    .user(user)
                    .novel(novel)
                    .build();
            bookmarkRepository.save(bookmark);
            return true; // Added
        }
    }

    public EngagementStatus getEngagementStatus(Long novelId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        boolean isBookmarked = bookmarkRepository.existsByUserIdAndNovelId(user.getId(), novelId);
        Optional<Rating> rating = ratingRepository.findByUserIdAndNovelId(user.getId(), novelId);
        
        return EngagementStatus.builder()
                .isBookmarked(isBookmarked)
                .userRating(rating.map(Rating::getScore).orElse(null))
                .build();
    }
}

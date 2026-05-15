package com.docgia.repository;

import com.docgia.model.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    Optional<Bookmark> findByUserIdAndNovelId(Long userId, Long novelId);
    List<Bookmark> findByUserId(Long userId);
    boolean existsByUserIdAndNovelId(Long userId, Long novelId);
}

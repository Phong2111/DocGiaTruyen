package com.docgia.repository;

import com.docgia.model.Novel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;

@Repository
public interface NovelRepository extends JpaRepository<Novel, Long> {
    List<Novel> findByUploaderId(Long uploaderId);
    List<Novel> findByIsPublicTrue();
    List<Novel> findTop10ByIsPublicTrueOrderByViewCountDesc();
    List<Novel> findTop10ByIsPublicTrueOrderByCreatedAtDesc();

    @Query("SELECT n FROM Novel n WHERE n.isPublic = true AND (LOWER(n.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(n.author) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Novel> searchPublicNovels(@Param("keyword") String keyword);
}

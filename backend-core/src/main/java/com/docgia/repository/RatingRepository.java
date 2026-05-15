package com.docgia.repository;

import com.docgia.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    Optional<Rating> findByUserIdAndNovelId(Long userId, Long novelId);
    
    // Average rating for a novel
    @org.springframework.data.jpa.repository.Query("SELECT AVG(r.score) FROM Rating r WHERE r.novel.id = :novelId")
    Double getAverageRatingByNovelId(Long novelId);
}

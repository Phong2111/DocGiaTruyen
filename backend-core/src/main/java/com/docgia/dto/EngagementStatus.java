package com.docgia.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EngagementStatus {
    private boolean isBookmarked;
    private Integer userRating; // null if not rated
}

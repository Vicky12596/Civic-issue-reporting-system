package com.civicissue.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CommentRequest {
    @NotBlank
    private String content;
    private String imageUrl;
    private Long parentCommentId;
}

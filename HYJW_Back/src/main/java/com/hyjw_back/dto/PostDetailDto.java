package com.hyjw_back.dto;

import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

import com.hyjw_back.entity.Posts;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PostDetailDto {
    private Long postId;
    private Integer views;
    private Integer likesCount;
    private String title;
    private UserDto user; // 작성자 정보
    private Timestamp createdAt;
    private String content;
    private List<String> hashtags; // 해시태그 목록
    private List<FileDto> files; // 첨부파일 목록
    private List<CommentDto> comments; // 댓글 목록

    // Posts 엔티티를 인자로 받는 생성자 추가
    public PostDetailDto(Posts posts) {
        // 엔티티 필드를 DTO 필드에 매핑
        this.postId = posts.getPostId();
        this.views = posts.getViews();

        // 좋아요 수: PostLikes 컬렉션 크기로 계산한다고 가정 (실제 로직에 맞게 수정 필요)
        this.likesCount = posts.getPostLikes() != null ? posts.getPostLikes().size() : 0;

        this.title = posts.getTitle();

        // 작성자 정보 매핑 (UserDto 생성자에 Users 엔티티를 받아서 생성한다고 가정)
        this.user = new UserDto(posts.getUser());

        this.createdAt = posts.getCreatedAt();
        this.content = posts.getContent();

        // 해시태그 목록 매핑 (PostHashtags 컬렉션을 String 목록으로 변환)
        this.hashtags = posts.getPostHashtags().stream()
                .map(ph -> ph.getHashtag().getTag())
                .collect(Collectors.toList());

        // 파일 목록 매핑 (Files 컬렉션을 FileDto 목록으로 변환)
        this.files = posts.getFiles().stream()
                .map(FileDto::new) // FileDto 생성자에 Files 엔티티를 받아서 생성한다고 가정
                .collect(Collectors.toList());

        // 댓글 목록(comments)은 상세 조회 시 서비스에서 별도로 조회하여 DTO에 설정하는 경우가 많으므로 여기서는 비워두거나,
        // 엔티티의 comments 컬렉션을 변환하는 로직을 추가해야 합니다.
        // this.comments = posts.getComments().stream().map(CommentDto::new).collect(Collectors.toList());
    }
}
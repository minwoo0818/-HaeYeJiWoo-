package com.hyjw_back.entity;

import com.hyjw_back.constant.CategoryId;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Posts {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id")
    private Long postId;

    @Column(name = "title", nullable = false, length = 100)
    private String title;

    @Column(name = "content", length = 500)
    private String content;

    @Column(name = "views")
    @ColumnDefault("0")
    private Integer views = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    @Enumerated(EnumType.STRING)
    @Column(name = "category_id", nullable = false, length = 20)
    private CategoryId categoryId;

    // url 컬럼을 Posts 엔티티에 직접 복구
    @Column(name = "url", length = 250)
    private String url;

    @Column(name = "created_at", nullable = false)
    private Timestamp createdAt;

    @Column(name = "updated_at")
    private Timestamp updatedAt;

    // 게시글 삭제 여부 (false: 노출, true: 삭제 처리)
    // 실제 DB 컬럼명은 is_delete, 기본값은 0
    @Column(name = "is_delete", columnDefinition = "TINYINT(1) DEFAULT 0")
    private Boolean isDelete = false;

    // file
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Files> files = new ArrayList<>();

    // 게시글 내용 변경을 위한 메서드 추가
    public void updatePost(String title, String content ) {
        this.title = title;
        this.content = content;
        this.updatedAt = new Timestamp(System.currentTimeMillis());
    }

    // 좋아요 (PostLikes) 관계 매핑 필드 추가
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PostLikes> postLikes = new ArrayList<>();

    // 해시태그 (PostHashtags) 관계 매핑 필드 추가
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PostHashtags> postHashtags = new ArrayList<>();

    // 댓글 (Comments) 관계 매핑 필드 추가 (Comments 엔티티가 있다면 추가)
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comments> comments = new ArrayList<>();

    // ... (기존 updatePost 메서드)
//    public void updatePost(String title, String content /*, ...다른 필드 */) {
//        this.title = title;
//        this.content = content;
//        // 수정 시간 업데이트 로직도 추가하는 것이 좋습니다.
//        // this.updatedAt = new Timestamp(System.currentTimeMillis());
//    }

}
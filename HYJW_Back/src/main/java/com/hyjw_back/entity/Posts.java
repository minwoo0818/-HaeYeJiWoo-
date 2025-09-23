package com.hyjw_back.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import java.sql.Timestamp;

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
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", nullable = false)
    private Users user;

    @Column(name = "category_id", nullable = false, length = 20)
    private String categoryId;

    // url 컬럼을 Posts 엔티티에 직접 복구
    @Column(name = "url", length = 250)
    private String url;

    @Column(name = "created_at", nullable = false)
    private Timestamp createdAt;

    @Column(name = "updated_at")
    private Timestamp updatedAt;
}
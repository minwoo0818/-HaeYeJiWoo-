package com.hyjw_back.entity;

import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;

@Entity
@Table(name = "post_likes")
@IdClass(PostLikes.PostLikesId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostLikes {
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", referencedColumnName = "post_id", nullable = false)
    private Posts post;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", nullable = false)
    private Users user;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PostLikesId implements Serializable {
        private Long post;
        private Long user;
    }
}
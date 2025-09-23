package com.hyjw_back.entity;

import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;

@Entity
@Table(name = "post_hashtags")
@IdClass(PostHashtags.PostHashtagsId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostHashtags {
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", referencedColumnName = "post_id", nullable = false)
    private Posts post;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hashtags_id", referencedColumnName = "hashtags_id", nullable = false)
    private Hashtags hashtag;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PostHashtagsId implements Serializable {
        private Long post;
        private Long hashtag;
    }
}
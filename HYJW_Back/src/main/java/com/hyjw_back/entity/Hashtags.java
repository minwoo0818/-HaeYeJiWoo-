package com.hyjw_back.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "hashtags")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Hashtags {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hashtags_id")
    private Long hashtagsId;

    @Column(name = "tag", nullable = false, length = 100, unique = true)
    private String tag;
}
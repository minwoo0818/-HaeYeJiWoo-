package com.hyjw_back.entity.repository;

import com.hyjw_back.entity.PostHashtags;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostHashtagsRepository extends JpaRepository<PostHashtags, PostHashtags.PostHashtagsId> {
}
package com.hyjw_back.entity.repository;

import com.hyjw_back.entity.Hashtags;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HashtagsRepository extends JpaRepository<Hashtags, Long> {

    Optional<Hashtags> findByTag(String tagName);

}
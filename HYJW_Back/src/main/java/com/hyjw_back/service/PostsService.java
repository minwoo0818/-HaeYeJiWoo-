package com.hyjw_back.service;

import com.hyjw_back.constant.CategoryId;
import com.hyjw_back.dto.*;
import com.hyjw_back.entity.*;
import com.hyjw_back.entity.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostsService {

    @Autowired
    private PostsRepository postsRepository;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private HashtagsRepository hashtagRepository;

    @Autowired
    private PostHashtagsRepository postHashtagRepository;

    @Autowired
    private PostLikesRepository postLikesRepository;

    @Autowired
    private CommentsRepository commentRepository;

    @Autowired
    private FilesRepository filesRepository;

    @Transactional
    public PostDetailDto createPost(PostCreateDto postCreateDto, Long userId) {
        // 1. DTO로부터 게시글 엔티티 생성
        Users user = usersRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        Posts post = new Posts();
        post.setTitle(postCreateDto.getTitle());
        post.setContent(postCreateDto.getContent());
        post.setUser(user);
        post.setCategoryId(postCreateDto.getCategoryId());
        post.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        // URL은 첨부파일 DTO에서 첫 번째 파일의 URL을 가져와서 설정
        if (postCreateDto.getFiles() != null && !postCreateDto.getFiles().isEmpty()) {
            post.setUrl(postCreateDto.getFiles().get(0).getUrl());
        }
        Posts savedPost = postsRepository.save(post);

        // 2. 해시태그 저장 및 연결
        if (postCreateDto.getHashtags() != null) {
            for (String tag : postCreateDto.getHashtags()) {
                Hashtags hashtag = hashtagRepository.findByTag(tag)
                        .orElseGet(() -> {
                            Hashtags newTag = new Hashtags();
                            newTag.setTag(tag);
                            return hashtagRepository.save(newTag);
                        });
                PostHashtags postHashtag = new PostHashtags(savedPost, hashtag);
                postHashtagRepository.save(postHashtag);
            }
        }

        // 3. 첨부파일 저장
        if (postCreateDto.getFiles() != null) {
            for (FileCreateDto fileDto : postCreateDto.getFiles()) {
                Files file = new Files();
                file.setPost(savedPost);
                file.setFileOriginalName(fileDto.getFileOriginalName());
                file.setUrl(fileDto.getUrl());
                file.setFileType(fileDto.getFileType());
                file.setCreatedAt(new Timestamp(System.currentTimeMillis()));
                filesRepository.save(file);
            }
        }

        // 4. PostDetailDto로 변환하여 반환
        return convertToPostDetailDto(savedPost);
    }

    @Transactional(readOnly = true)
    public List<PostCardDto> getAllPosts() {
        List<Posts> posts = postsRepository.findByIsDeleteFalse();

        return posts.stream().map(post -> {
            PostCardDto dto = new PostCardDto();
            dto.setPostId(post.getPostId());
            dto.setTitle(post.getTitle());
            dto.setUserNickname(post.getUser().getUserNickname());
            dto.setUrl(post.getUrl());
            dto.setCategoryId(post.getCategoryId());
            dto.setCreatedAt(post.getCreatedAt());
            dto.setViews(post.getViews());

            // 해시태그 목록 조회 및 매핑
            List<String> hashtags = postHashtagRepository.findHashtagTagsByPostId(post.getPostId());
            dto.setHashtags(hashtags);

            // 좋아요 수 조회
            Integer likesCount = postLikesRepository.countByPost_PostId(post.getPostId());
            dto.setLikesCount(likesCount);

            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PostCardDto> getPostsByCategory(CategoryId categoryId) {
        List<Posts> posts = postsRepository.findByCategoryId(categoryId);

        return posts.stream().map(post -> {
            PostCardDto dto = new PostCardDto();
            dto.setPostId(post.getPostId());
            dto.setTitle(post.getTitle());
            dto.setUserNickname(post.getUser().getUserNickname());
            dto.setUrl(post.getUrl());
            dto.setCategoryId(post.getCategoryId());
            dto.setCreatedAt(post.getCreatedAt());
            dto.setViews(post.getViews());

            // 해시태그 목록 조회 및 매핑
            List<String> hashtags = postHashtagRepository.findHashtagTagsByPostId(post.getPostId());
            dto.setHashtags(hashtags);

            // 좋아요 수 조회
            Integer likesCount = postLikesRepository.countByPost_PostId(post.getPostId());
            dto.setLikesCount(likesCount);

            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public PostDetailDto getPostDetail(Long postId) {
        Posts post = postsRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // 조회수 증가
        post.setViews(post.getViews() + 1);
        postsRepository.save(post);

        return convertToPostDetailDto(post);
    }

    // 엔티티를 PostDetailDto로 변환하는 private 메서드
    private PostDetailDto convertToPostDetailDto(Posts post) {
        PostDetailDto dto = new PostDetailDto();
        dto.setPostId(post.getPostId());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setViews(post.getViews());
        dto.setCreatedAt(post.getCreatedAt());

        // 작성자 정보
        UserDto userDto = new UserDto();
        userDto.setUserId(post.getUser().getUserId());
        userDto.setUserNickname(post.getUser().getUserNickname());
        userDto.setEmail(post.getUser().getEmail());
        dto.setUser(userDto);

        // 해시태그 목록
        List<String> hashtags = postHashtagRepository.findHashtagTagsByPostId(post.getPostId());
        dto.setHashtags(hashtags);

        // 첨부파일 목록
        List<FileDto> files = filesRepository.findByPostId(post.getPostId()).stream()
                .map(file -> {
                    FileDto fileDto = new FileDto();
                    fileDto.setFileOriginalName(file.getFileOriginalName());
                    fileDto.setUrl(file.getUrl());
                    fileDto.setFileType(file.getFileType());
                    return fileDto;
                })
                .collect(Collectors.toList());
        dto.setFiles(files);

        // 댓글 목록
        List<CommentDto> comments = commentRepository.findByPostId(post.getPostId()).stream()
                .map(comment -> {
                    CommentDto commentDto = new CommentDto();
                    commentDto.setCommentsId(comment.getCommentsId());
                    commentDto.setContent(comment.getContent());
                    commentDto.setCreatedAt(comment.getCreatedAt());

                    UserDto commentUserDto = new UserDto();
                    commentUserDto.setUserId(comment.getUser().getUserId());
                    commentUserDto.setUserNickname(comment.getUser().getUserNickname());
                    commentUserDto.setEmail(comment.getUser().getEmail());
                    commentDto.setUser(commentUserDto);

                    return commentDto;
                })
                .collect(Collectors.toList());
        dto.setComments(comments);

        // 좋아요 수
        Integer likesCount = postLikesRepository.countByPost_PostId(post.getPostId());
        dto.setLikesCount(likesCount);

        return dto;
    }


    //유저 : 소프트 삭제 (isDelete = true) & 관리자 : 하드 삭제 (DB에서 완전히 삭제) 로직
    @Transactional
    public void softDeletePost(Long postId) {
        Posts post = postsRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setIsDelete(true); // 삭제 처리
        postsRepository.save(post);
    }

    @Transactional
    public void hardDeletePost(Long postId) {
        Posts post = postsRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        postsRepository.delete(post);
    }

    @Transactional(readOnly = true)
    public List<PostCardDto> getDeletedPosts() {
        List<Posts> posts = postsRepository.findByIsDeleteTrue(); // 삭제된 것만
        return posts.stream()
                .map(this::convertToPostCardDto)
                .collect(Collectors.toList());
    }

    // 변환 공통 메서드
    private PostCardDto convertToPostCardDto(Posts post) {
        PostCardDto dto = new PostCardDto();
        dto.setPostId(post.getPostId());
        dto.setTitle(post.getTitle());
        dto.setUserNickname(post.getUser().getUserNickname());
        dto.setUrl(post.getUrl());
        dto.setCategoryId(post.getCategoryId());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setViews(post.getViews());
        dto.setHashtags(postHashtagRepository.findHashtagTagsByPostId(post.getPostId()));
        dto.setLikesCount(postLikesRepository.countByPost_PostId(post.getPostId()));
        return dto;
    }
}
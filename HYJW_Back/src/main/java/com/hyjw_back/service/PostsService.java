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
            dto.setContent(post.getContent());

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
    public List<PostCardDto> getPostsByCategory(String type) { // <-- CategoryId -> String으로 변경
        System.out.println("PostsService.getPostsByCategory 호출, type: " + type);

        if ("all".equalsIgnoreCase(type)) {
            // all 타입일 경우 getAllPosts() 메서드를 재사용
            return getAllPosts();
        }

        CategoryId categoryId = CategoryId.valueOf(type.toUpperCase());
        List<Posts> posts = postsRepository.findByCategoryId(categoryId);

        // ... DTO 변환 및 반환
        return posts.stream().map(post -> {
            PostCardDto dto = new PostCardDto();
            dto.setPostId(post.getPostId());
            dto.setTitle(post.getTitle());
            dto.setUserNickname(post.getUser().getUserNickname());
            dto.setUrl(post.getUrl());
            dto.setCategoryId(post.getCategoryId());
            dto.setCreatedAt(post.getCreatedAt());
            dto.setViews(post.getViews());

            List<String> hashtags = postHashtagRepository.findHashtagTagsByPostId(post.getPostId());
            dto.setHashtags(hashtags);

            Integer likesCount = postLikesRepository.countByPost_PostId(post.getPostId());
            dto.setLikesCount(likesCount);

            return dto;
        }).collect(Collectors.toList());
    }

    public List<PostCardDto> searchPosts(String type, String searchType, String searchText) {

        List<Posts> searchResults;

        // "all" 카테고리 검색 로직
        if ("all".equalsIgnoreCase(type)) {
            switch (searchType) {
                case "title":
                    searchResults = postsRepository.findByTitleContaining(searchText);
                    break;
                case "content":
                    searchResults = postsRepository.findByContentContaining(searchText);
                    break;
                case "userId":
                    searchResults = postsRepository.findByUserUserNicknameContaining(searchText);
                    break;
                case "hashtag":
                    searchResults = postsRepository.findByTagContaining(searchText);
                    break;
                default:
                    throw new IllegalArgumentException("Invalid search type for all posts: " + searchType);
            }
        } else {
            // 특정 카테고리 검색 로직
            CategoryId categoryId = CategoryId.valueOf(type.toUpperCase());
            switch (searchType) {
                case "title":
                    searchResults = postsRepository.findByCategoryIdAndTitleContaining(categoryId, searchText);
                    break;
                case "content":
                    searchResults = postsRepository.findByCategoryIdAndContentContaining(categoryId, searchText);
                    break;
                case "userId":
                    searchResults = postsRepository.findByCategoryIdAndUserUserNicknameContaining(categoryId,
                            searchText);
                    break;
                case "hashtag":
                    searchResults = postsRepository.findByCategoryIdAndTagContaining(categoryId, searchText);
                    break;
                default:
                    throw new IllegalArgumentException("Invalid search type: " + searchType);
            }
        }

        // 검색 결과를 DTO로 변환하는 공통 로직
        return searchResults.stream().map(post -> {
            PostCardDto dto = new PostCardDto();
            dto.setPostId(post.getPostId());
            dto.setTitle(post.getTitle());
            dto.setUserNickname(post.getUser().getUserNickname());
            dto.setUrl(post.getUrl());
            dto.setCategoryId(post.getCategoryId());
            dto.setCreatedAt(post.getCreatedAt());
            dto.setViews(post.getViews());

            // 해시태그와 좋아요 수는 별도의 쿼리를 통해 가져와야 합니다.
            // 기존의 getAllPosts와 getPostsByCategory 메서드에 있는 로직을 재사용하세요.
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
                    fileDto.setFileSize(file.getFileSize());
                    fileDto.setDownloads(file.getDownloads());
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

    // 유저 : 소프트 삭제 (isDelete = true)
    @Transactional
    public void softDeletePost(Long postId) {
        Posts post = postsRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setIsDelete(true); // 삭제 처리
        postsRepository.save(post);
    }

    // 관리자 : 하드 삭제 (DB에서 완전히 삭제) 로직
    @Transactional
    public void hardDeletePost(Long postId) {
        Posts post = postsRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // 1. 좋아요 삭제
        postLikesRepository.deleteByPost(post);

        // 2. 해시태그 삭제
        postHashtagRepository.deleteByPost(post);

        // 3. 게시글 삭제
        postsRepository.delete(post);
    }

    @Transactional
    public void addLike(Long postId, String userEmail) {
        Posts post = postsRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));

        Users user = usersRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + userEmail));

        // Only add a like if it doesn't already exist
        postLikesRepository.findByPostAndUser(post, user).ifPresentOrElse(
                postLike -> {
                    // Like already exists, do nothing or log
                    System.out.println("User " + userEmail + " already liked post " + postId);
                },
                () -> {
                    // Like does not exist, create it
                    PostLikes newPostLike = new PostLikes();
                    newPostLike.setPost(post);
                    newPostLike.setUser(user);
                    postLikesRepository.save(newPostLike);
                });
    }

    @Transactional
    public void removeLike(Long postId, String userEmail) {
        Posts post = postsRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));

        Users user = usersRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + userEmail));

        // Only remove a like if it exists
        postLikesRepository.findByPostAndUser(post, user).ifPresent(
                postLike -> {
                    // Like exists, delete it
                    postLikesRepository.delete(postLike);
                });
    }

    @Transactional(readOnly = true)
    public boolean getPostLikeStatus(Long postId, String userEmail) {
        Posts post = postsRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));

        Users user = usersRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + userEmail));

        return postLikesRepository.findByPostAndUser(post, user).isPresent();
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
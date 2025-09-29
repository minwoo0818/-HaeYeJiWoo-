package com.hyjw_back.service;

import com.hyjw_back.constant.CategoryId;
import com.hyjw_back.dto.*;
import com.hyjw_back.entity.*;
import com.hyjw_back.entity.repository.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.sql.Timestamp;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostsService {
    @Value("${itemImgLocation}")
    String itemImgLocation;

    @Autowired
    private PostsRepository postsRepository;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private HashtagsRepository hashtagRepository;

    @Autowired
    private PostHashtagsRepository postHashtagsRepository;

    @Autowired
    private PostLikesRepository postLikesRepository;

    @Autowired
    private CommentsRepository commentRepository;

    @Autowired
    private FilesRepository filesRepository;

    private final EntityManager em;

    //========================================== 첨부파일포함 ==========================================
    @Transactional
    public PostDetailDto createPost(PostCreateIncludeFIleDto postCreateIncludeFIleDto, Long userId) {
        // 1. 게시글 엔티티 생성 및 저장
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Posts post = new Posts();
        post.setTitle(postCreateIncludeFIleDto.getTitle());
        post.setContent(postCreateIncludeFIleDto.getContent());
        post.setUser(user);

        // 여기가 중요
        if(postCreateIncludeFIleDto.getCategoryId() == null) {
            throw new IllegalArgumentException("카테고리를 선택하세요.");
        }
        post.setCategoryId(postCreateIncludeFIleDto.getCategoryId());

        post.setCreatedAt(new Timestamp(System.currentTimeMillis()));


        Posts savedPost = postsRepository.save(post);

        // 2. 해시태그 저장 및 연결
        if (postCreateIncludeFIleDto.getHashtags() != null) {
            for (String tag : postCreateIncludeFIleDto.getHashtags()) {
                Hashtags hashtag = hashtagRepository.findByTag(tag)
                        .orElseGet(() -> {
                            Hashtags newTag = new Hashtags();
                            newTag.setTag(tag);
                            return hashtagRepository.save(newTag);
                        });
                PostHashtags postHashtag = new PostHashtags(savedPost, hashtag);
                postHashtagsRepository.save(postHashtag);
            }
        }

//         3. 첨부파일 저장
        if (postCreateIncludeFIleDto.getFiles() != null) {
            for (MultipartFile multipartFile : postCreateIncludeFIleDto.getFiles()) {
                String originalFileName = multipartFile.getOriginalFilename();

                // UUID 생성
                UUID uuid = UUID.randomUUID();

                // 확장자 추출 (".png" 형태)
                String extension = originalFileName.substring(originalFileName.lastIndexOf("."));

                // 저장할 파일 이름
                String savedFileName = uuid.toString() + extension;

                // 실제 업로드 경로 (예: /uploads/uuid.png)
                String fileUploadFullUrl = itemImgLocation + "/" + savedFileName;

                // 파일 저장
                try (FileOutputStream fos = new FileOutputStream(fileUploadFullUrl)) {
                    // fileDto.getFiles()에서 실제 파일 byte[] 가져와서 write
                    byte[] fileData = multipartFile.getBytes();
                    fos.write(fileData);
                } catch (IOException e) {
                    e.printStackTrace();
                }

                // 💡 수정된 부분: DB에 저장되는 경로를 '/files/'로 통일
                String imgUrl = "/files/" + savedFileName;

                if(savedPost.getUrl()==null){
                    savedPost.setUrl(imgUrl);
                }

                Files file = new Files();
                file.setPost(savedPost);
                file.setFileOriginalName(originalFileName);
                file.setUrl(imgUrl);  //파일 저장 경로 => /files/ + 파일 uuid 이름
                file.setFileType(extension.substring(1));
                file.setCreatedAt(new Timestamp(System.currentTimeMillis()));
                file.setFileSize((int) multipartFile.getSize());
                filesRepository.save(file);
            }
        }

        // 4. PostDetailDto 생성 및 반환
        PostDetailDto dto = new PostDetailDto();
        dto.setPostId(savedPost.getPostId());
        dto.setTitle(savedPost.getTitle());
        dto.setContent(savedPost.getContent());
        dto.setCreatedAt(savedPost.getCreatedAt());
        dto.setViews(savedPost.getViews());
        dto.setLikesCount(0);
        dto.setUser(new UserDto(user));

        dto.setHashtags(postCreateIncludeFIleDto.getHashtags());
        // 첨부파일 DTO 변환
        List<FileDto> fileDtos = savedPost.getFiles().stream().map(f -> {
            FileDto fd = new FileDto();
            fd.setFileOriginalName(f.getFileOriginalName());
            fd.setUrl(f.getUrl());
            fd.setFileType(f.getFileType());
            return fd;
        }).collect(Collectors.toList());
        dto.setFiles(fileDtos);
        dto.setComments(Collections.emptyList());

        return dto;
    }

    //========================================= 첨부파일없음 =============================================
    @Transactional
    public PostDetailDto createPost(PostCreateDto postCreateDto, Long userId) {
        // 1. 게시글 엔티티 생성 및 저장
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Posts post = new Posts();
        post.setTitle(postCreateDto.getTitle());
        post.setContent(postCreateDto.getContent());
        post.setUser(user);

        // 여기가 중요
        if(postCreateDto.getCategoryId() == null) {
            throw new IllegalArgumentException("카테고리를 선택하세요.");
        }
        post.setCategoryId(postCreateDto.getCategoryId());

        post.setCreatedAt(new Timestamp(System.currentTimeMillis()));

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
                postHashtagsRepository.save(postHashtag);
            }
        }

        // 4. PostDetailDto 생성 및 반환
        PostDetailDto dto = new PostDetailDto();
        dto.setPostId(savedPost.getPostId());
        dto.setTitle(savedPost.getTitle());
        dto.setContent(savedPost.getContent());
        dto.setCreatedAt(savedPost.getCreatedAt());
        dto.setViews(savedPost.getViews());
        dto.setLikesCount(0);
        dto.setUser(new UserDto(user));

        dto.setHashtags(postCreateDto.getHashtags());

        dto.setFiles(Collections.emptyList());
        dto.setComments(Collections.emptyList());

        return dto;
    }



    @Transactional(readOnly = true)
    public List<PostCardDto> getAllPosts() {
        List<Posts> posts = postsRepository.findByIsDeleteFalse();
        return posts.stream().map(this::convertToPostCardDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PostCardDto> getDeletedPosts() {
        List<Posts> posts = postsRepository.findByIsDeleteTrue();

        return posts.stream()
                .map(this::convertToPostCardDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PostCardDto> getPostsByCategory(String type) {
        System.out.println("PostsService.getPostsByCategory 호출, type: " + type);

        if ("all".equalsIgnoreCase(type)) {
            return getAllPosts();
        }

        CategoryId categoryId = CategoryId.valueOf(type.toUpperCase());
        List<Posts> posts = postsRepository.findByCategoryId(categoryId);

        return posts.stream().map(this::convertToPostCardDto)
                .collect(Collectors.toList());
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

        return searchResults.stream().map(this::convertToPostCardDto)
                .collect(Collectors.toList());
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
        dto.setUpdatedAt(post.getUpdatedAt());

        // 작성자 정보
        UserDto userDto = new UserDto();
        userDto.setUserId(post.getUser().getUserId());
        userDto.setUserNickname(post.getUser().getUserNickname());
        userDto.setEmail(post.getUser().getEmail());
        dto.setUser(userDto);

        // 해시태그 목록
        List<String> hashtags = postHashtagsRepository.findHashtagTagsByPostId(post.getPostId());
        dto.setHashtags(hashtags);

        // 첨부파일 목록
        List<FileDto> files = filesRepository.findByPostId(post.getPostId()).stream()
                .map(file -> {
                    FileDto fileDto = new FileDto();
                    fileDto.setFileOriginalName(file.getFileOriginalName());

                    // 💡 수정된 부분: DB에 /images/로 저장된 경로를 /files/로 치환하여 클라이언트에 전달
                    String fileUrl = file.getUrl().replace("/images/", "/files/");
                    fileDto.setUrl(fileUrl);

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

    // 유저 : 소프트 삭제된 게시물 복구 (isDelete = false)
    @Transactional
    public void restorePost(Long postId) {
        Posts post = postsRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getIsDelete()) {
            throw new IllegalArgumentException("게시글이 삭제 상태가 아닙니다.");
        }
        post.setIsDelete(false); // 복구 처리
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
        postHashtagsRepository.deleteByPost(post);

        // 3. 게시글 삭제
        postsRepository.delete(post);
    }

    @Transactional
    public void addLike(Long postId, String userEmail) {
        System.out.println("addLike called with postId: " + postId + ", userEmail: " + userEmail);

        Posts post = postsRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));

        Users user = usersRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + userEmail));

        // Only add a like if it doesn't already exist
        postLikesRepository.findByPostAndUser(post, user).ifPresentOrElse(
                postLike -> {
                    // Like already exists, do nothing or log
                    System.out.println("User " + userEmail + " already liked post " + postId + ". Not adding new like.");
                },
                () -> {
                    // Like does not exist, create it
                    PostLikes newPostLike = new PostLikes();
                    newPostLike.setPost(post);
                    newPostLike.setUser(user);
                    postLikesRepository.save(newPostLike);
                    System.out.println("New like added for user " + userEmail + " on post " + postId);
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

        if ("anonymousUser".equals(userEmail)) {
            return false;
        }

        Users user = usersRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + userEmail));

        return postLikesRepository.findByPostAndUser(post, user).isPresent();
    }



    @Transactional
    public PostDetailDto updatePost(Long id, PostUpdateDto postUpdateDto) {

        // 1. 게시글 엔티티 조회 및 기본 필드 업데이트
        Posts postEntity = postsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다. id=" + id));

        postEntity.updatePost(
                postUpdateDto.getTitle(),
                postUpdateDto.getContent()
        );

        // 2. 해시태그 업데이트: 기존 연결 DB에서 삭제 후 새로 저장
        postHashtagsRepository.deleteByPost(postEntity); // ⭐️ DB에서 기존 연결 명시적 삭제
        em.flush();
        postEntity.getPostHashtags().clear();

        if (postUpdateDto.getHashtags() != null) {
            postUpdateDto.getHashtags().forEach(tagName -> {
                Hashtags hashtag = hashtagRepository.findByTag(tagName)
                        .orElseGet(() -> {
                            Hashtags newHashtag = new Hashtags();
                            newHashtag.setTag(tagName);
                            return hashtagRepository.save(newHashtag);
                        });

                PostHashtags postHashtag = new PostHashtags();
                postHashtag.setPost(postEntity);
                postHashtag.setHashtag(hashtag);

                postHashtagsRepository.save(postHashtag);
                postEntity.getPostHashtags().add(postHashtag);
            });
        }

        // 3-1. 기존 파일 삭제 처리 (서버 파일 및 DB 레코드)
        if (postUpdateDto.getFileIdsToDelete() != null && !postUpdateDto.getFileIdsToDelete().isEmpty()) {
            postUpdateDto.getFileIdsToDelete().forEach(fileId -> {
                Files fileEntity = filesRepository.findById(fileId)
                        .orElseThrow(() -> new EntityNotFoundException("삭제할 파일을 찾을 수 없습니다. File ID: " + fileId));

                // 💡 파일 삭제 경로 수정: DB URL의 /files/ 부분을 제거하여 로컬 파일 시스템 경로 생성
                String filePath = itemImgLocation + fileEntity.getUrl().replace("/files/", "");

                try {
                    File deleteFile = new File(filePath);
                    if (deleteFile.exists() && deleteFile.delete()) {
                        System.out.println("서버 파일 삭제 성공: " + filePath);
                    }
                } catch (Exception e) {
                    System.err.println("파일 삭제 중 오류 발생: " + e.getMessage());
                }
                filesRepository.delete(fileEntity);
            });
        }

        // 3-2. 새로 추가된 파일 처리 (서버 저장 및 DB 레코드 추가)
        if (postUpdateDto.getNewFiles() != null && !postUpdateDto.getNewFiles().isEmpty()) {
            for (MultipartFile newFile : postUpdateDto.getNewFiles()) {
                if (newFile.isEmpty()) continue;

                try {
                    String originalFileName = newFile.getOriginalFilename();
                    String extension = originalFileName != null && originalFileName.contains(".") ?
                            originalFileName.substring(originalFileName.lastIndexOf(".")) : "";
                    String savedFileName = UUID.randomUUID().toString() + extension;

                    File destinationFile = new File(itemImgLocation + savedFileName);
                    if (!destinationFile.getParentFile().exists()) {
                        destinationFile.getParentFile().mkdirs();
                    }
                    newFile.transferTo(destinationFile);

                    Files files = new Files();
                    files.setFileOriginalName(originalFileName);
                    files.setUrl("/files/" + savedFileName); // 💡 새 파일 저장 경로도 /files/로 통일
                    files.setFileType(extension.replace(".", ""));
                    files.setPost(postEntity);

                    filesRepository.save(files);
                    postEntity.getFiles().add(files);

                } catch (IOException | IllegalStateException e) {
                    throw new RuntimeException("파일 저장에 실패했습니다: " + newFile.getOriginalFilename(), e);
                }
            }
        }

        // 4. 변경된 엔티티를 DTO로 변환 후 반환
        return new PostDetailDto(postEntity);
    }

    // 변환 공통 메서드
    private PostCardDto convertToPostCardDto(Posts post) {
        PostCardDto dto = new PostCardDto();
        dto.setPostId(post.getPostId());
        dto.setTitle(post.getTitle());
        dto.setUserNickname(post.getUser().getUserNickname());

        // 💡 PostCardDto의 url 필드도 변환하여 전달 (썸네일 이미지라고 가정)
        String postUrl = post.getUrl() != null ? post.getUrl().replace("/images/", "/files/") : null;
        dto.setUrl(postUrl);

        dto.setCategoryId(post.getCategoryId());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setViews(post.getViews());
        dto.setUpdatedAt(post.getUpdatedAt());
        dto.setContent(post.getContent());
        dto.setHashtags(postHashtagsRepository.findHashtagTagsByPostId(post.getPostId()));
        dto.setLikesCount(postLikesRepository.countByPost_PostId(post.getPostId()));
        return dto;
    }
}
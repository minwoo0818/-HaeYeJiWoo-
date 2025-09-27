package com.hyjw_back.service;

import com.hyjw_back.constant.CategoryId;
import com.hyjw_back.dto.*;
import com.hyjw_back.entity.*;
import com.hyjw_back.entity.repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileOutputStream;
import java.io.IOException;
import java.sql.Timestamp;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
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
    private PostHashtagsRepository postHashtagRepository;

    @Autowired
    private PostLikesRepository postLikesRepository;

    @Autowired
    private CommentsRepository commentRepository;

    @Autowired
    private FilesRepository filesRepository;

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

//        if (postCreateDto.getFiles() != null && !postCreateDto.getFiles().isEmpty()) {
//            post.setUrl(postCreateDto.getFiles().getFirst().getUrl());
//        }


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
                postHashtagRepository.save(postHashtag);
            }
        }

//         3. 첨부파일 저장 (여기 부분은 그대로)
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
                    byte[] fileData = multipartFile.getBytes(); // MultipartFile이 1개라고 가정
                    fos.write(fileData);
                } catch (IOException e) {
                    e.printStackTrace();
                }

                String imgUrl = "/images/" + savedFileName;

                if(savedPost.getUrl()==null){
                    savedPost.setUrl(imgUrl);
                }

                Files file = new Files();
                file.setPost(savedPost);
                file.setFileOriginalName(originalFileName);
                file.setUrl(imgUrl);  //파일 저장 경로 => 파일 저장 폴더 이름 + 파일 uuid 이름
                file.setFileType(extension.substring(1));
                file.setCreatedAt(new Timestamp(System.currentTimeMillis()));
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
        dto.setLikesCount(0); // 새 게시글이므로 좋아요 0
        dto.setUser(new UserDto(
                user.getUserId(),
                user.getUserNickname(),
                user.getEmail()
        ));

        // UserDto 생성
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
        dto.setComments(Collections.emptyList()); // 새 글이므로 댓글 없음

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

//        if (postCreateDto.getFiles() != null && !postCreateDto.getFiles().isEmpty()) {
//            post.setUrl(postCreateDto.getFiles().getFirst().getUrl());
//        }

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

        // 4. PostDetailDto 생성 및 반환
        PostDetailDto dto = new PostDetailDto();
        dto.setPostId(savedPost.getPostId());
        dto.setTitle(savedPost.getTitle());
        dto.setContent(savedPost.getContent());
        dto.setCreatedAt(savedPost.getCreatedAt());
        dto.setViews(savedPost.getViews());
        dto.setLikesCount(0); // 새 게시글이므로 좋아요 0
        dto.setUser(new UserDto(
                user.getUserId(),
                user.getUserNickname(),
                user.getEmail()
        ));

        // UserDto 생성
        dto.setHashtags(postCreateDto.getHashtags());

        // 첨부파일 DTO 변환 (파일이 없으므로 빈 리스트로 설정)
        dto.setFiles(Collections.emptyList());
        // 혹은 savedPost.getFiles()가 빈 컬렉션을 반환하도록 설정되어 있다면
        // List<FileDto> fileDtos = savedPost.getFiles().stream().map(...).collect(...)을 사용해도 됩니다.
        // 여기서는 명시적으로 빈 리스트를 반환합니다.
        dto.setComments(Collections.emptyList()); // 새 글이므로 댓글 없음

        return dto;
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

            List<String> hashtags = postHashtagRepository.findHashtagTagsByPostId(post.getPostId());
            dto.setHashtags(hashtags);

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
                    searchResults = postsRepository.findByCategoryIdAndUserUserNicknameContaining(categoryId, searchText);
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

    //유저 : 소프트 삭제 (isDelete = true)
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

    @Transactional(readOnly = true)
    public List<PostCardDto> getDeletedPosts() {
        List<Posts> posts = postsRepository.findByIsDeleteTrue(); // 삭제된 것만
        return posts.stream()
                .map(this::convertToPostCardDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public PostDetailDto updatePost(Long id, PostUpdateDto postUpdateDto) {

        // 1. DB에서 Posts 엔티티 조회 -> findById는 Optional을 반환하므로, orElseThrow를 사용해 없으면 예외를 발생
        Posts postEntity = postsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다. id=" + id));

        // 2. 수정 권한 검사 (나중에 시큐리티 등록후)
        // 예: if (!postEntity.getUser().getUserId()
        // .equals(currentUserId)) { throw new AccessDeniedException(); }

        // 3. 엔티티의 update 메서드를 호출하여 DTO의 값으로 엔티티 필드를 변경
        postEntity.updatePost(
                postUpdateDto.getTitle(),
                postUpdateDto.getContent()
                // DTO에 파일 수정 로직이 있다면 여기서 추가
        );

        // 4. 변경된 엔티티 -> DTO 변환 후 반환
        return new PostDetailDto(postEntity);
        // PostDetailDto 생성자에 Posts 엔티티를 받아 DTO로 변환하는 로직이 있다고 가정
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

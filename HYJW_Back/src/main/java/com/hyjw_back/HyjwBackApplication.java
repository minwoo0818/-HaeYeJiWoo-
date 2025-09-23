package com.hyjw_back;

import com.hyjw_back.entity.*;
import com.hyjw_back.entity.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.sql.Timestamp;

@SpringBootApplication
public class HyjwBackApplication implements CommandLineRunner {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PostsRepository postRepository;

    @Autowired
    private FilesRepository fileRepository;

    @Autowired
    private HashtagsRepository hashtagRepository;

    @Autowired
    private PostHashtagsRepository postHashtagRepository;

    @Autowired
    private CommentsRepository commentRepository;

    @Autowired
    private PostLikesRepository postLikesRepository;

    @Autowired
    private FileRuleRepository fileRuleRepository;

    public static void main(String[] args) {
        SpringApplication.run(HyjwBackApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Starting dummy data initialization...");

        // FileRule 더미 데이터 (단 하나의 행)
        FileRule fileRule = new FileRule();
        fileRule.setFileMaxNum(5);
        fileRule.setFileSize(10240);
        fileRule.setFileType("jpg,png,gif,pdf");
        fileRuleRepository.save(fileRule);

        // Users 더미 데이터
        Users user1 = new Users();
        user1.setUserNickname("개발자A");
        user1.setEmail("devA@example.com");
        user1.setHashedPassword("password_hash_a");
        usersRepository.save(user1);

        Users user2 = new Users();
        user2.setUserNickname("디자이너B");
        user2.setEmail("designB@example.com");
        user2.setHashedPassword("password_hash_b");
        usersRepository.save(user2);

        // Posts 더미 데이터
        Posts post1 = new Posts();
        post1.setTitle("첫 번째 게시글 제목");
        post1.setContent("첫 번째 게시글 본문입니다.");
        post1.setUser(user1);
        post1.setCategoryId("tech");
        post1.setUrl("https://image.com/post1.jpg");
        post1.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        postRepository.save(post1);

        Posts post2 = new Posts();
        post2.setTitle("두 번째 게시글 제목");
        post2.setContent("두 번째 게시글 본문입니다.");
        post2.setUser(user1);
        post2.setCategoryId("daily");
        post2.setUrl("https://image.com/post2.png");
        post2.setCreatedAt(new Timestamp(System.currentTimeMillis() - 86400000));
        postRepository.save(post2);

        // Files 더미 데이터
        Files file1 = new Files();
        file1.setPost(post1);
        file1.setFileOriginalName("photo.jpg");
        file1.setUrl("https://storage.com/file_post1_photo.jpg");
        file1.setFileType("image/jpeg");
        file1.setFileSize(500);
        file1.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        fileRepository.save(file1);

        // Hashtags 더미 데이터
        Hashtags tag1 = new Hashtags();
        tag1.setTag("스프링");
        hashtagRepository.save(tag1);

        Hashtags tag2 = new Hashtags();
        tag2.setTag("개발");
        hashtagRepository.save(tag2);

        // PostHashtags 더미 데이터
        PostHashtags postTag1 = new PostHashtags(post1, tag1);
        postHashtagRepository.save(postTag1);

        PostHashtags postTag2 = new PostHashtags(post1, tag2);
        postHashtagRepository.save(postTag2);

        // Comments 더미 데이터
        Comments comment1 = new Comments();
        comment1.setPost(post1);
        comment1.setUser(user2);
        comment1.setContent("게시글 잘 봤습니다!");
        comment1.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        commentRepository.save(comment1);

        Comments comment2 = new Comments();
        comment2.setPost(post1);
        comment2.setUser(user1);
        comment2.setContent("감사합니다!");
        comment2.setParentComment(comment1);
        comment2.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        commentRepository.save(comment2);

        // PostLikes 더미 데이터
        PostLikes like1 = new PostLikes(post1, user2);
        postLikesRepository.save(like1);

        PostLikes like2 = new PostLikes(post2, user1);
        postLikesRepository.save(like2);

        System.out.println("Dummy data initialization complete.");
    }
}
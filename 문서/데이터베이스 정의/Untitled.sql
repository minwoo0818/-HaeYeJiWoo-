CREATE TABLE `users` (
  `user_id` integer PRIMARY KEY AUTO_INCREMENT,
  `user_nickname` varchar(10) UNIQUE NOT NULL,
  `email` varchar(255) UNIQUE NOT NULL,
  `hashed_password` varchar(200) NOT NULL
);

CREATE TABLE `posts` (
  `post_id` integer PRIMARY KEY AUTO_INCREMENT,
  `title` varchar(30) NOT NULL,
  `content` varchar(500) NOT NULL,
  `views` integer,
  `user_id` integer NOT NULL,
  `category_id` integer NOT NULL,
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `files` (
  `files_id` integer PRIMARY KEY AUTO_INCREMENT,
  `post_id` integer NOT NULL,
  `file_originalname` varchar(255) NOT NULL,
  `url` text NOT NULL,
  `file_size` integer,
  `created_at` timestamp
);

CREATE TABLE `hashtags` (
  `hashtags_id` integer PRIMARY KEY AUTO_INCREMENT,
  `tag` varchar(100) UNIQUE NOT NULL
);

CREATE TABLE `post_hashtags` (
  `post_id` integer NOT NULL,
  `hashtag_id` integer NOT NULL,
  PRIMARY KEY (`post_id`, `hashtag_id`)
);

CREATE TABLE `comments` (
  `comments_id` integer PRIMARY KEY AUTO_INCREMENT,
  `post_id` integer NOT NULL,
  `user_id` integer NOT NULL,
  `content` varchar(1000) NOT NULL,
  `parent_comment_id` integer,
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `post_likes` (
  `post_id` integer NOT NULL,
  `user_id` integer NOT NULL,
  PRIMARY KEY (`post_id`, `user_id`)
);

CREATE TABLE `file_role` (
  `file_max_num` integer NOT NULL,
  `file_size` integer NOT NULL,
  `file_type` varchar(20) NOT NULL
);

ALTER TABLE `posts` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

ALTER TABLE `files` ADD FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`);

ALTER TABLE `post_hashtags` ADD FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`);

ALTER TABLE `post_hashtags` ADD FOREIGN KEY (`hashtag_id`) REFERENCES `hashtags` (`hashtags_id`);

ALTER TABLE `comments` ADD FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`);

ALTER TABLE `comments` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

ALTER TABLE `comments` ADD FOREIGN KEY (`parent_comment_id`) REFERENCES `comments` (`comments_id`);

ALTER TABLE `post_likes` ADD FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`);

ALTER TABLE `post_likes` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

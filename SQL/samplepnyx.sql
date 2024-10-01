-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 01, 2024 at 04:14 PM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `samplepnyx`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `category_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `options`
--

CREATE TABLE `options` (
  `id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `option_text` varchar(255) DEFAULT NULL,
  `tally` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `options`
--

INSERT INTO `options` (`id`, `question_id`, `option_text`, `tally`) VALUES
(23, 34, '1', 0),
(24, 34, '2', 0),
(25, 41, 'here', 0),
(26, 41, 'there', 0),
(27, 44, 'what?', 0),
(28, 44, 'why?', 0),
(29, 46, '1', 0),
(30, 46, '2', 0),
(31, 46, '3', 0),
(32, 47, '1', 0),
(33, 47, '2', 0),
(34, 47, '3', 0),
(35, 49, 'here 1', 0),
(36, 49, 'here 2', 0),
(37, 54, 'yes', 0),
(38, 54, 'no', 0);

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `id` int(11) NOT NULL,
  `survey_id` int(11) NOT NULL,
  `question_text` text NOT NULL,
  `question_type` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`id`, `survey_id`, `question_text`, `question_type`) VALUES
(33, 27, 'Feedback', 'paragraph'),
(34, 28, 'what is bigger', 'multiple_choice'),
(35, 30, 'test ', 'paragraph'),
(36, 31, 'What is the color of your shirt', 'paragraph'),
(37, 32, 'what is your password', 'paragraph'),
(38, 33, 'Where are you?', 'paragraph'),
(39, 33, 'How was our service?', 'feedback'),
(40, 34, 'Where are you?', 'paragraph'),
(41, 34, 'Where did you go', 'multiple_choice'),
(42, 34, 'How was your day?', 'feedback'),
(43, 35, 'Where are you?', 'paragraph'),
(44, 35, 'what', 'multiple_choice'),
(45, 35, 'Are you satisfied?', 'feedback'),
(46, 36, 'Biggest Number', 'multiple_choice'),
(47, 36, 'Smalles Number', 'multiple_choice'),
(48, 37, 'what', 'paragraph'),
(49, 37, 'where', 'multiple_choice'),
(50, 38, 'what are you?', 'paragraph'),
(51, 39, 'test 12', 'paragraph'),
(52, 39, 'test 12', 'paragraph'),
(53, 40, 'What coffee do you like?', 'paragraph'),
(54, 40, 'Was it good?', 'multiple_choice'),
(55, 40, 'Are you satisfied with our product', 'feedback'),
(56, 40, 'would you recommend our establishment', 'feedback'),
(57, 40, 'would you order again our product', 'feedback');

-- --------------------------------------------------------

--
-- Table structure for table `surveys`
--

CREATE TABLE `surveys` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` enum('approved','pending','declined') DEFAULT 'pending',
  `comment` varchar(255) NOT NULL,
  `category_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `surveys`
--

INSERT INTO `surveys` (`id`, `title`, `description`, `user_id`, `status`, `comment`, `category_id`) VALUES
(27, 'Sample 1', '1', 18, 'approved', '', NULL),
(28, 'sample 2', '1', 18, 'approved', '', NULL),
(30, 'Sample 3', 'test', 13, 'declined', 'test comment', NULL),
(31, 'Sample 5', 'test', 19, 'declined', '', NULL),
(32, 'Sample 6', '123456', 17, 'declined', '', NULL),
(33, 'Sample 7', 'Extremely long description', 13, 'declined', 'test 2', NULL),
(34, 'Sample 8', 'test ', 13, 'approved', '', NULL),
(35, 'Sample 9', 'test case', 13, 'approved', '', NULL),
(36, 'Sample 10', 'example', 13, 'approved', '', NULL),
(37, 'Sample 11', 'Test', 17, 'approved', '', NULL),
(38, 'Sample 11', 'hehe', 13, 'approved', '', NULL),
(39, 'Sample 12', 'testing', 13, 'approved', '', NULL),
(40, 'Coffee cafe', 'Cafe that nevers serves coffee', 13, 'approved', '', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `survey_categories`
--

CREATE TABLE `survey_categories` (
  `id` int(11) NOT NULL,
  `survey_id` int(11) NOT NULL,
  `category_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `survey_interactions`
--

CREATE TABLE `survey_interactions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `survey_id` int(11) NOT NULL,
  `interaction_type` enum('viewed','completed','liked','rated') NOT NULL,
  `rating` int(11) DEFAULT NULL,
  `interaction_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `survey_responses`
--

CREATE TABLE `survey_responses` (
  `id` int(11) NOT NULL,
  `survey_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `question_type` varchar(255) NOT NULL,
  `answer` text NOT NULL,
  `sentiment_score` decimal(5,2) NOT NULL DEFAULT 0.00,
  `option_score` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `survey_responses`
--

INSERT INTO `survey_responses` (`id`, `survey_id`, `question_id`, `question_type`, `answer`, `sentiment_score`, `option_score`) VALUES
(11, 34, 40, 'paragraph', 'here', '0.00', 0),
(12, 34, 41, 'multiple_choice', 'here', '0.00', 0),
(13, 34, 42, 'feedback', '', '0.00', 0),
(14, 34, 40, 'paragraph', 'somewhere out there', '0.00', 0),
(15, 34, 41, 'multiple_choice', 'here', '0.00', 0),
(16, 34, 42, 'feedback', '', '2.00', 0),
(17, 34, 40, 'paragraph', 'der', '0.00', 0),
(18, 34, 41, 'multiple_choice', 'there', '0.00', 0),
(19, 34, 42, 'feedback', '', '0.00', 0),
(20, 34, 40, 'paragraph', 'over here', '0.00', 0),
(21, 34, 41, 'multiple_choice', 'here', '0.00', 1),
(22, 34, 42, 'feedback', '', '3.00', 0),
(23, 34, 40, 'paragraph', 'in the walls', '0.00', 0),
(24, 34, 41, 'multiple_choice', 'here', '0.00', 1),
(25, 34, 42, 'feedback', '', '0.00', 0),
(26, 36, 46, 'multiple_choice', '3', '0.00', 1),
(27, 36, 47, 'multiple_choice', '1', '0.00', 1),
(28, 35, 43, 'paragraph', 'Here at SM', '0.00', 0),
(29, 35, 44, 'multiple_choice', 'why?', '0.00', 1),
(30, 35, 45, 'feedback', '', '0.00', 0),
(31, 35, 43, 'paragraph', 'Here', '0.00', 0),
(32, 35, 44, 'multiple_choice', 'what?', '0.00', 1),
(33, 35, 45, 'feedback', '', '3.00', 0),
(34, 39, 51, 'paragraph', 'sample answer 1', '0.00', 0),
(35, 39, 52, 'paragraph', 'sample answer 2', '0.00', 0),
(36, 40, 53, 'paragraph', 'anything', '0.00', 0),
(37, 40, 54, 'multiple_choice', 'yes', '0.00', 1),
(38, 40, 55, 'feedback', '', '-3.00', 0),
(39, 40, 56, 'feedback', '', '3.00', 0),
(40, 40, 57, 'feedback', '', '1.00', 0),
(41, 40, 53, 'paragraph', 'Decaf', '0.00', 0),
(42, 40, 54, 'multiple_choice', 'yes', '0.00', 1),
(43, 40, 55, 'feedback', '', '3.00', 0),
(44, 40, 56, 'feedback', '', '-1.00', 0),
(45, 40, 57, 'feedback', '', '1.00', 0),
(46, 40, 53, 'paragraph', 'anything', '0.00', 0),
(47, 40, 54, 'multiple_choice', 'no', '0.00', 1),
(48, 40, 55, 'feedback', '', '1.00', 0),
(49, 40, 56, 'feedback', '', '1.00', 0),
(50, 40, 57, 'feedback', '', '-1.00', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(25) NOT NULL,
  `firstname` varchar(25) NOT NULL,
  `lastname` varchar(25) NOT NULL,
  `gender` varchar(25) NOT NULL,
  `birthdate` date NOT NULL,
  `email` varchar(25) NOT NULL,
  `password` varchar(255) NOT NULL,
  `reward_points` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `firstname`, `lastname`, `gender`, `birthdate`, `email`, `password`, `reward_points`) VALUES
(11, 'user1', 'user', '1', 'Female', '2000-02-29', 'user1@gmail.com', '$2y$10$YCw7ZFH6eq.7w/JKOa', 0),
(12, 'user2', 'user', '2', 'Male', '3333-01-02', 'user2@gmail.com', '$2y$10$Vb9ui0ZV1W/gfwxLHk', 0),
(13, 'Nath', 'Nathan', 'Aqu', 'Male', '2000-10-29', 'nataquino29@gmail.com', '$2y$10$dT5p9cMo0CiGz0qfKAjC3udyJEETUrUaicMGA6LSxFOosK3EWeIn.', 0),
(14, 'Jerz', 'Jerzeil', 'Lira', 'Male', '1999-01-01', 'jerzeil@gmail.com', '$2y$10$Zlb2aoQK2n44dYT5wzJXueSDpKYfUGQP5povfsNWrlnZ9OeFcqtGq', 0),
(15, 'a', 'a', 'a', 'Male', '2024-07-09', 'a@gmail.com', '$2y$10$JtcN3KVq1ssTu/L/Xw1MReSLPN1SxnoVhYYY1KDRJsg9DYx0u4UUK', 0),
(16, 'b', 'b', 'b', 'Female', '2024-07-09', 'b@gmail.com', '$2y$10$7pGnP1aKYjHRC2VvZU0LtuZrQrSqr77yZMPo28HZPjC6Swepk5/Q.', 0),
(17, 'Steven', 'Steven', 'Absalon', 'Male', '1999-01-05', 'steven@gmail.com', '$2y$10$.JBsdRTnZMnY9cYimiB28.jYpKWYfNgzlb7513eu.7B9jDwclxx62', 0),
(18, 'Nathan', 'Nathaniel', 'Aquino', 'Male', '2000-10-29', 'nataquino@gmail.com', '$2y$10$sxmd8Xddotuh470ixq9W5uGHZUwa8QFJVEnG3SGoe49ERzUZD1Zem', 0),
(19, 'Juan', 'Juan', 'De la cruz', 'Male', '2024-02-15', 'juan@gmail.com', '$2y$10$VVvAJW//nerMBUH3/PmSKu2R0ZA4wrG3e52YSYdm9PwJsWRXy.PgK', 0),
(20, 'Harold', 'Harold', 'Halg', 'Male', '2024-09-18', 'harold@gmail.com', '$2y$10$Ge4irOLSEOj9c/quglY.tueS4WQKcADA4q3RegZMB0pGsZYs/FPpW', 0),
(21, 'Xenon', 'Carl Daniel', 'Aquino', 'Male', '2015-06-08', 'xeonix@gmail.com', '$2y$10$rAMydR0CVXeV18B.vxEDvu.KXVBDZ3iYzK5ydUw4RbQhRHDpQO1iu', 0),
(22, 'Hokage999', 'Ritchard', 'Constatine', 'Female', '2010-06-23', 'rits@gmail.com', '$2y$10$UpeK.t4XcxOnpXQlHfWMoOADcLaUptRNQpZHD437u68uzccdKqSQS', 0),
(23, 'DavidRox', 'David', 'Ross', 'Male', '2010-02-17', 'davidRoss19@gmail.com', '$2y$10$UQ1wPt80EtpYScmVpgALcezP8Ym.U7POeIOl2MEa6qvOSzzm2V82m', 0);

-- --------------------------------------------------------

--
-- Table structure for table `user_preferences`
--

CREATE TABLE `user_preferences` (
  `user_id` int(11) NOT NULL,
  `category` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_preferences`
--

INSERT INTO `user_preferences` (`user_id`, `category`) VALUES
(23, 'Academic'),
(23, 'Art'),
(23, 'Books');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `options`
--
ALTER TABLE `options`
  ADD PRIMARY KEY (`id`),
  ADD KEY `question_id` (`question_id`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `survey_id` (`survey_id`);

--
-- Indexes for table `surveys`
--
ALTER TABLE `surveys`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `survey_categories`
--
ALTER TABLE `survey_categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `survey_id` (`survey_id`);

--
-- Indexes for table `survey_interactions`
--
ALTER TABLE `survey_interactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `survey_id` (`survey_id`);

--
-- Indexes for table `survey_responses`
--
ALTER TABLE `survey_responses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_preferences`
--
ALTER TABLE `user_preferences`
  ADD PRIMARY KEY (`user_id`,`category`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `options`
--
ALTER TABLE `options`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `surveys`
--
ALTER TABLE `surveys`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `survey_categories`
--
ALTER TABLE `survey_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `survey_interactions`
--
ALTER TABLE `survey_interactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `survey_responses`
--
ALTER TABLE `survey_responses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `options`
--
ALTER TABLE `options`
  ADD CONSTRAINT `options_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`);

--
-- Constraints for table `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`survey_id`) REFERENCES `surveys` (`id`);

--
-- Constraints for table `surveys`
--
ALTER TABLE `surveys`
  ADD CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `survey_categories`
--
ALTER TABLE `survey_categories`
  ADD CONSTRAINT `survey_categories_ibfk_1` FOREIGN KEY (`survey_id`) REFERENCES `surveys` (`id`);

--
-- Constraints for table `survey_interactions`
--
ALTER TABLE `survey_interactions`
  ADD CONSTRAINT `survey_interactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `survey_interactions_ibfk_2` FOREIGN KEY (`survey_id`) REFERENCES `surveys` (`id`);

--
-- Constraints for table `user_preferences`
--
ALTER TABLE `user_preferences`
  ADD CONSTRAINT `user_preferences_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 07, 2025 at 12:19 PM
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

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `category_name`) VALUES
(2, 'Sports'),
(3, 'Food'),
(4, 'Art'),
(5, 'Academic'),
(6, 'Politics'),
(7, 'News'),
(8, 'Business'),
(9, 'Football'),
(10, 'Iloilo City'),
(11, 'Telecommunications');

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
(37, 54, 'yes', 0),
(38, 54, 'no', 0),
(39, 60, 'Yes', 0),
(40, 60, 'No', 0),
(41, 62, 'FC barcelona', 0),
(42, 62, 'MC United', 0),
(43, 63, 'Great teamwork and collaboration between players', 0),
(44, 63, 'Outstanding individual performances', 0),
(45, 63, 'Strategic plays and formations', 0),
(46, 66, 'Yes', 0),
(47, 66, 'No', 0),
(48, 68, 'Yes', 0),
(49, 68, 'No', 0);

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
(53, 40, 'What coffee do you like?', 'paragraph'),
(54, 40, 'Was it good?', 'multiple_choice'),
(55, 40, 'Are you satisfied with our product', 'feedback'),
(56, 40, 'would you recommend our establishment', 'feedback'),
(57, 40, 'would you order again our product', 'feedback'),
(58, 41, 'What are your thoughts about his actions?', 'feedback'),
(59, 41, 'Do you think he did the right thing?', 'feedback'),
(60, 41, 'Do you agree with his action?', 'multiple_choice'),
(61, 42, 'Describe your thoughts on the match between MC United and FC Barcelona. What aspects of the teams\' performances stood out to you, and how do you think the match influenced the overall dynamics of their respective seasons? Please include any memorable moments or player performances that caught your attention.', 'paragraph'),
(62, 42, 'Which team are you rooting for?', 'multiple_choice'),
(63, 42, '\"What aspects of the match between MC United and FC Barcelona did you enjoy? (Select all that apply)\"', 'checkbox'),
(64, 43, 'Do you think what she\'s doing is Ethical?', 'feedback'),
(65, 44, 'Why do you think the project is still going after 5 years?', 'paragraph'),
(66, 44, 'Does it bother you', 'multiple_choice'),
(67, 44, 'What is your opinion of the problem it causes?', 'feedback'),
(68, 45, 'Are you aware of the Iloilo City government’s deadline for telecommunication companies to remove their wires from Calle Real?', 'multiple_choice'),
(69, 45, 'How important do you think it is to remove overhead wires in heritage areas like Calle Real?', 'paragraph'),
(70, 45, 'Do you support the city’s initiative to impose penalties on non-compliant telecommunication companies?', 'feedback');

-- --------------------------------------------------------

--
-- Table structure for table `redemptions`
--

CREATE TABLE `redemptions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `reward_id` int(11) NOT NULL,
  `voucher_code` varchar(255) NOT NULL,
  `redeemed_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `redemptions`
--

INSERT INTO `redemptions` (`id`, `user_id`, `reward_id`, `voucher_code`, `redeemed_at`) VALUES
(1, 13, 1, '34A5180D357D', '2025-01-07 10:21:27');

-- --------------------------------------------------------

--
-- Table structure for table `rewards`
--

CREATE TABLE `rewards` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `points_required` int(11) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `expiry_date` datetime DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `rewards`
--

INSERT INTO `rewards` (`id`, `name`, `description`, `points_required`, `stock`, `expiry_date`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Jollibee Free Drink', 'Jollibee free selective drink: Coke,Sprite,Royal', 20, 50, '2025-01-01 00:00:00', 'active', '2024-12-16 20:59:01', '2024-12-16 20:59:01');

-- --------------------------------------------------------

--
-- Table structure for table `surveys`
--

CREATE TABLE `surveys` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` enum('approved','pending','declined','activated','expired') DEFAULT 'pending',
  `comment` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `expiry_date` date DEFAULT NULL,
  `passcode` varchar(255) DEFAULT NULL,
  `is_locked` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `surveys`
--

INSERT INTO `surveys` (`id`, `title`, `description`, `user_id`, `status`, `comment`, `created_at`, `expiry_date`, `passcode`, `is_locked`) VALUES
(40, 'Coffee cafe', 'Cafe that nevers serves coffee', 26, 'activated', '', '2024-10-16 10:12:10', '2025-01-12', NULL, 0),
(41, 'Mayor Treñas stand on Illegal online gaming', 'In line with the directives from the President, the League of Cities of the Philippines (LCP) has issued Advisory No. 2024-0906, reinforcing our commitment to addressing the winding down of Philippine Offshore Gaming Operations (POGO) and tackling illegal online gaming activities in our cities.', 27, 'activated', '', '2024-10-16 10:12:10', '2025-01-14', NULL, 0),
(42, 'FC Barcelona vs MC United', 'In an electrifying clash, MC United takes on the legendary FC Barcelona in a highly anticipated friendly match that promises to showcase the best of football. Both teams are eager to test their mettle ahead of the upcoming season, bringing together a mix of seasoned veterans and promising newcomers.', 26, 'activated', '', '2024-10-16 11:27:08', NULL, '123', 1),
(43, 'Alice Guo running for Mayor Ulit?!', 'Alice Guo issue for running candidate ', 13, 'activated', '', '2024-10-17 13:36:03', '2025-01-12', '111111', 1),
(44, 'Ungka Flyover Wala gyapon natapos?', 'Ungka flyover still ongoing repairs for 5 years', 32, 'activated', '', '2024-12-16 19:49:07', '2025-01-16', '121212', 1),
(45, 'Telcos Face December Deadline to Remove Wires', 'The Iloilo City government has set a December 16, 2024, deadline for telecommunication companies to remove their wires from poles along Calle Real. This survey aims to gather opinions on this initiative and its potential impact on the community.', 32, 'activated', '', '2024-12-17 07:29:15', '2025-01-16', NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `survey_categories`
--

CREATE TABLE `survey_categories` (
  `id` int(11) NOT NULL,
  `survey_id` int(11) NOT NULL,
  `category_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `survey_categories`
--

INSERT INTO `survey_categories` (`id`, `survey_id`, `category_name`) VALUES
(1, 42, 'Sports'),
(2, 42, 'Football'),
(3, 42, 'Football'),
(4, 43, 'Politics'),
(5, 43, 'News'),
(6, 44, 'Iloilo City'),
(7, 44, 'Iloilo City'),
(8, 45, 'News'),
(9, 45, 'Iloilo City'),
(10, 45, 'Telecommunications'),
(11, 45, 'Telecommunications');

-- --------------------------------------------------------

--
-- Table structure for table `survey_interactions`
--

CREATE TABLE `survey_interactions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `survey_id` int(11) NOT NULL,
  `interaction_type` enum('completed','rated') NOT NULL,
  `rating` int(11) DEFAULT NULL,
  `interaction_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `survey_interactions`
--

INSERT INTO `survey_interactions` (`id`, `user_id`, `survey_id`, `interaction_type`, `rating`, `interaction_date`) VALUES
(1, 13, 42, 'rated', 5, '2024-12-12 18:43:36'),
(2, 13, 40, 'rated', 5, '2024-12-15 21:00:12'),
(3, 26, 41, 'rated', 3, '2024-12-15 21:02:23'),
(4, 26, 43, 'rated', 3, '2024-12-15 21:02:54'),
(5, 32, 40, 'rated', 4, '2024-12-16 19:44:41'),
(6, 32, 41, 'rated', 3, '2024-12-16 19:45:04'),
(7, 27, 45, 'rated', 4, '2024-12-17 08:42:35'),
(8, 28, 45, 'rated', 2, '2024-12-17 08:45:22'),
(9, 13, 44, 'rated', 4, '2025-01-06 15:45:58'),
(10, 32, 44, 'rated', 5, '2025-01-06 16:22:03'),
(11, 32, 44, 'rated', 5, '2025-01-06 16:23:01');

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
(14, 34, 40, 'paragraph', 'somewhere out there', '0.00', 0),
(15, 34, 41, 'multiple_choice', 'here', '0.00', 0),
(17, 34, 40, 'paragraph', 'der', '0.00', 0),
(18, 34, 41, 'multiple_choice', 'there', '0.00', 0),
(20, 34, 40, 'paragraph', 'over here', '0.00', 0),
(21, 34, 41, 'multiple_choice', 'here', '0.00', 1),
(23, 34, 40, 'paragraph', 'in the walls', '0.00', 0),
(24, 34, 41, 'multiple_choice', 'here', '0.00', 1),
(26, 36, 46, 'multiple_choice', '3', '0.00', 1),
(27, 36, 47, 'multiple_choice', '1', '0.00', 1),
(28, 35, 43, 'paragraph', 'Here at SM', '0.00', 0),
(29, 35, 44, 'multiple_choice', 'why?', '0.00', 1),
(31, 35, 43, 'paragraph', 'Here', '0.00', 0),
(32, 35, 44, 'multiple_choice', 'what?', '0.00', 1),
(34, 39, 51, 'paragraph', 'sample answer 1', '0.00', 0),
(35, 39, 52, 'paragraph', 'sample answer 2', '0.00', 0),
(36, 40, 53, 'paragraph', 'anything', '0.00', 0),
(37, 40, 54, 'multiple_choice', 'yes', '0.00', 1),
(41, 40, 53, 'paragraph', 'Decaf', '0.00', 0),
(42, 40, 54, 'multiple_choice', 'yes', '0.00', 1),
(43, 40, 55, 'feedback', '', '3.00', 0),
(44, 40, 56, 'feedback', '', '-1.00', 0),
(45, 40, 57, 'feedback', '', '1.00', 0),
(46, 40, 53, 'paragraph', 'anything', '0.00', 0),
(47, 40, 54, 'multiple_choice', 'no', '0.00', 1),
(48, 40, 55, 'feedback', '', '1.00', 0),
(49, 40, 56, 'feedback', '', '1.00', 0),
(50, 40, 57, 'feedback', '', '-1.00', 0),
(51, 41, 58, 'feedback', '', '0.00', 0),
(52, 41, 59, 'feedback', '', '-2.00', 0),
(53, 41, 60, 'multiple_choice', 'Yes', '0.00', 1),
(54, 40, 53, 'paragraph', 'Mocha Coffe', '0.00', 0),
(55, 40, 54, 'multiple_choice', 'yes', '0.00', 1),
(56, 40, 55, 'feedback', 'Yes it was tasty!', '1.00', 0),
(57, 40, 56, 'feedback', 'Yes it was good', '4.00', 0),
(58, 40, 57, 'feedback', 'Maybe in the near future', '0.00', 0),
(59, 42, 61, 'paragraph', 'The match between MC United and FC Barcelona was a thrilling encounter that showcased both teams\' strengths and weaknesses. MC United displayed impressive defensive organization, particularly from their center-backs, who effectively neutralized Barcelona’s attacking threats. Meanwhile, Barcelona\'s midfield creativity shone through, with their playmaker orchestrating key passes that opened up MC United\'s defense.\n\nA standout moment was MC United’s early goal, which set the tone for an intense match. The equalizer from Barcelona later in the first half demonstrated their resilience and attacking prowess, highlighting their ability to bounce back under pressure.\n\nOverall, this match significantly impacted both teams\' seasons. For MC United, it instilled confidence and solidified their defensive strategy, while for Barcelona, it emphasized the need for more clinical finishing and depth in their squad. Memorable player performances included the MC United goalkeeper, who made several crucial saves, and Barcelona’s winger, whose dribbling and pace consistently troubled the defense. This match will be a defining moment for both teams as they look to build momentum moving forward.', '0.00', 0),
(60, 42, 62, 'multiple_choice', 'MC United', '0.00', 1),
(61, 42, 63, 'checkbox', '43', '0.00', 0),
(62, 42, 63, 'checkbox', '44', '0.00', 0),
(63, 41, 58, 'feedback', 'His action were right and just', '0.00', 0),
(64, 41, 59, 'feedback', 'Yes it was correct', '1.00', 0),
(65, 41, 60, 'multiple_choice', 'Yes', '0.00', 1),
(66, 41, 58, 'feedback', 'yes', '1.00', 0),
(67, 41, 59, 'feedback', 'yes', '1.00', 0),
(68, 41, 60, 'multiple_choice', 'No', '0.00', 1),
(69, 41, 58, 'feedback', 'No bad', '-4.00', 0),
(70, 41, 59, 'feedback', 'Not right', '0.00', 0),
(71, 41, 60, 'multiple_choice', 'No', '0.00', 1),
(72, 40, 53, 'paragraph', 'Black', '0.00', 0),
(73, 40, 54, 'multiple_choice', 'no', '0.00', 1),
(74, 40, 55, 'feedback', 'yes i am satisfied but its very bitter', '1.00', 0),
(75, 40, 56, 'feedback', 'no because its too far and in a dark alley', '-1.00', 0),
(76, 40, 57, 'feedback', 'sure', '0.00', 0),
(77, 43, 64, 'feedback', 'I dont trust her anymore', '-1.00', 0),
(78, 43, 64, 'feedback', 'she lost all her merits because of the recent problem', '-5.00', 0),
(79, 43, 64, 'feedback', 'No one trust her anymore so I dont think this is relevant anymore', '0.00', 0),
(80, 41, 58, 'feedback', 'I think its a bold move against the owners of these kind of services specially since they are part of a big company', '5.00', 0),
(81, 41, 59, 'feedback', 'yes he is doing his best to improve the city and for its people', '6.00', 0),
(82, 41, 60, 'multiple_choice', 'Yes', '0.00', 1),
(83, 40, 53, 'paragraph', 'anything', '0.00', 0),
(84, 40, 54, 'multiple_choice', 'yes', '0.00', 1),
(85, 40, 55, 'feedback', 'yes', '1.00', 0),
(86, 40, 56, 'feedback', 'probably', '0.00', 0),
(87, 40, 57, 'feedback', 'yes sure why not', '1.00', 0),
(88, 42, 61, 'paragraph', 'A memorable moment to anticipate would be how both teams\' midfielders battle for dominance, as City often relies on their fluid passing and possession, while Barcelona is known for their potent, direct offensive play. This match could not only impact the outcome of their group stages but also serve as a psychological boost for the winner heading into the latter part of the season. The result of this encounter might provide valuable insights into how these two top European clubs are shaping up for the knockout rounds.', '0.00', 0),
(89, 42, 62, 'multiple_choice', 'FC barcelona', '0.00', 1),
(90, 42, 63, 'checkbox', 'Great teamwork and collaboration between players', '0.00', 0),
(91, 42, 61, 'paragraph', 'testing testing', '0.00', 0),
(92, 42, 62, 'multiple_choice', 'FC barcelona', '0.00', 1),
(93, 42, 63, 'checkbox', 'Outstanding individual performances', '0.00', 0),
(94, 42, 61, 'paragraph', 'test', '0.00', 0),
(95, 42, 62, 'multiple_choice', 'FC barcelona', '0.00', 1),
(96, 42, 63, 'checkbox', 'Outstanding individual performances', '0.00', 0),
(97, 40, 53, 'paragraph', 'any', '0.00', 0),
(98, 40, 54, 'multiple_choice', 'yes', '0.00', 1),
(99, 40, 55, 'feedback', 'Maybe', '0.00', 0),
(100, 40, 56, 'feedback', 'yeah sure', '1.00', 0),
(101, 40, 57, 'feedback', 'no', '-1.00', 0),
(102, 41, 58, 'feedback', 'yes', '1.00', 0),
(103, 41, 59, 'feedback', 'yes', '1.00', 0),
(104, 41, 60, 'multiple_choice', 'Yes', '0.00', 1),
(105, 43, 64, 'feedback', 'I dont know', '0.00', 0),
(106, 40, 53, 'paragraph', 'Latte', '0.00', 0),
(107, 40, 54, 'multiple_choice', 'yes', '0.00', 1),
(108, 40, 55, 'feedback', 'Yes', '1.00', 0),
(109, 40, 56, 'feedback', 'Yes', '1.00', 0),
(110, 40, 57, 'feedback', 'No', '-1.00', 0),
(111, 41, 58, 'feedback', 'His doings were correct and just', '0.00', 0),
(112, 41, 59, 'feedback', 'Yes', '1.00', 0),
(113, 41, 60, 'multiple_choice', 'No', '0.00', 1),
(114, 45, 68, 'multiple_choice', 'Yes', '0.00', 1),
(115, 45, 69, 'paragraph', 'It is important because of the damages that it can cause', '0.00', 0),
(116, 45, 70, 'feedback', 'If designed well, such an initiative could be a step toward better service and equity. A collaborative approach that combines penalties with positive incentives might strike the right balance.', '3.00', 0),
(117, 45, 68, 'multiple_choice', 'Yes', '0.00', 1),
(118, 45, 69, 'paragraph', 'Hahahahahahah', '0.00', 0),
(119, 45, 70, 'feedback', 'Slightly good and might be bad but not too sure', '0.00', 0),
(120, 44, 65, 'paragraph', 'Structure problem', '0.00', 0),
(121, 44, 66, 'multiple_choice', 'No', '0.00', 1),
(122, 44, 67, 'feedback', 'The problem is that it causes traffic and the people are getting frustrated on waiting time just to pass', '-4.00', 0),
(123, 44, 65, 'paragraph', 'Politics maybe?', '0.00', 0),
(124, 44, 66, 'multiple_choice', 'Yes', '0.00', 1),
(125, 44, 67, 'feedback', 'It is still on construction for years and its causing problems to the local inhabitants', '-2.00', 0);

-- --------------------------------------------------------

--
-- Table structure for table `survey_similarities`
--

CREATE TABLE `survey_similarities` (
  `id` int(11) NOT NULL,
  `survey_id_1` int(11) DEFAULT NULL,
  `survey_id_2` int(11) DEFAULT NULL,
  `similarity_score` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `survey_similarities`
--

INSERT INTO `survey_similarities` (`id`, `survey_id_1`, `survey_id_2`, `similarity_score`) VALUES
(1, 42, 40, 1),
(2, 41, 43, 1),
(3, 40, 41, 1),
(4, 42, 44, 1),
(5, 40, 44, 1),
(6, 41, 44, 1);

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
  `bio` varchar(255) NOT NULL,
  `avatar` varchar(255) NOT NULL,
  `otp` varchar(6) DEFAULT NULL,
  `otp_expiry` datetime DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `reward_points` int(11) NOT NULL,
  `is_verified` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `firstname`, `lastname`, `gender`, `birthdate`, `email`, `bio`, `avatar`, `otp`, `otp_expiry`, `password`, `reward_points`, `is_verified`) VALUES
(11, 'user1', 'user', '1', 'Female', '2000-02-29', 'user1@gmail.com', '', '', NULL, NULL, '$2y$10$YCw7ZFH6eq.7w/JKOa', 0, 0),
(12, 'user2', 'user', '2', 'Male', '3333-01-02', 'user2@gmail.com', '', '', NULL, NULL, '$2y$10$Vb9ui0ZV1W/gfwxLHk', 0, 0),
(13, 'Nath', 'Nathan', 'Aqu', 'Male', '2000-10-29', 'nataquino29@gmail.com', 'I\\\'m just your typical average person in the web', '', NULL, '2024-10-16 10:36:37', '$2y$10$dT5p9cMo0CiGz0qfKAjC3udyJEETUrUaicMGA6LSxFOosK3EWeIn.', 20, 1),
(14, 'Jerz', 'Jerzeil', 'Lira', 'Male', '1999-01-01', 'jerzeil@gmail.com', '', '', NULL, NULL, '$2y$10$Zlb2aoQK2n44dYT5wzJXueSDpKYfUGQP5povfsNWrlnZ9OeFcqtGq', 0, 0),
(15, 'a', 'a', 'a', 'Male', '2024-07-09', 'a@gmail.com', '', '', NULL, NULL, '$2y$10$JtcN3KVq1ssTu/L/Xw1MReSLPN1SxnoVhYYY1KDRJsg9DYx0u4UUK', 0, 0),
(16, 'b', 'b', 'b', 'Female', '2024-07-09', 'b@gmail.com', '', '', NULL, NULL, '$2y$10$7pGnP1aKYjHRC2VvZU0LtuZrQrSqr77yZMPo28HZPjC6Swepk5/Q.', 0, 0),
(17, 'Steven', 'Steven', 'Absalon', 'Male', '1999-01-05', 'steven@gmail.com', '', '', NULL, NULL, '$2y$10$.JBsdRTnZMnY9cYimiB28.jYpKWYfNgzlb7513eu.7B9jDwclxx62', 0, 0),
(18, 'Nathan', 'Nathaniel', 'Aquino', 'Male', '2000-10-29', 'nataquino@gmail.com', '', '', NULL, NULL, '$2y$10$sxmd8Xddotuh470ixq9W5uGHZUwa8QFJVEnG3SGoe49ERzUZD1Zem', 0, 0),
(19, 'Juan', 'Juan', 'De la cruz', 'Male', '2024-02-15', 'juan@gmail.com', '', '', NULL, NULL, '$2y$10$VVvAJW//nerMBUH3/PmSKu2R0ZA4wrG3e52YSYdm9PwJsWRXy.PgK', 0, 0),
(20, 'Harold', 'Harold', 'Halg', 'Male', '2024-09-18', 'harold@gmail.com', '', '', NULL, NULL, '$2y$10$Ge4irOLSEOj9c/quglY.tueS4WQKcADA4q3RegZMB0pGsZYs/FPpW', 0, 0),
(21, 'Xenon', 'Carl Daniel', 'Aquino', 'Male', '2015-06-08', 'xeonix@gmail.com', '', '', NULL, NULL, '$2y$10$rAMydR0CVXeV18B.vxEDvu.KXVBDZ3iYzK5ydUw4RbQhRHDpQO1iu', 0, 0),
(22, 'Hokage999', 'Ritchard', 'Constatine', 'Female', '2010-06-23', 'rits@gmail.com', '', '', NULL, NULL, '$2y$10$UpeK.t4XcxOnpXQlHfWMoOADcLaUptRNQpZHD437u68uzccdKqSQS', 0, 0),
(23, 'DavidRox', 'David', 'Ross', 'Male', '2010-02-17', 'davidRoss19@gmail.com', '', '', NULL, NULL, '$2y$10$UQ1wPt80EtpYScmVpgALcezP8Ym.U7POeIOl2MEa6qvOSzzm2V82m', 0, 0),
(24, 'Ruben27', 'Ruben', 'Beguas', 'Male', '2000-03-21', 'rubenbeguas27@gmail.com', '', '', '745471', NULL, '$2y$10$CNnZPMlsgUs8XGLZi3SYW.JQjTTMlRXSmDWqT2Cub4UH/p2dNQzki', 0, 0),
(25, 'Rod16', 'Rod', 'Mag-aso', 'Female', '0000-00-00', 'rodEliMagaso@gmail.com', '', '', '924021', NULL, '$2y$10$wZg50dLSGles5tdE0bPweOORVF74JdkNbt5y.qNZQZ.IdqXXmJccK', 0, 0),
(26, 'Nath1', 'nathaniel', 'Aquino', 'Male', '2000-10-29', 'nath1@gmail.com', '', '', '137681', NULL, '$2y$10$vadBz/1Lgz3Km1cVSm3FJuba1OWtZLOU6CJbRWMi36Fuu.Ooz0gNC', 0, 1),
(27, 'Nath2', 'nathaniel', 'Aquino', 'Female', '2001-10-29', 'nath2@gmail.com', '', '', '309079', NULL, '$2y$10$o1fYyo6iyq1zUGR2o5MxXOfWeQyDAdBmPHawtwGSvcYnoyyTx0h4G', 0, 1),
(28, 'Nath3', 'Nathan', 'Absalon', 'Male', '0000-00-00', 'nath3@gmail.com', '', '', '254206', NULL, '$2y$10$MYtcoLLFsHCUPjbLuH3CMelMtfpf3kCWjuiiRwgO/3mVZj00K/0fi', 0, 1),
(29, 'Nath4', 'Nat', 'Aquino', 'Male', '2222-02-22', 'nath4@gmail.com', '', '', '282147', NULL, '$2y$10$PqIkxs.E/COv.mSTbE17Q.hNDTy9lsEc4cos9tJbzFmfYX4x2IU4W', 0, 1),
(30, 'Aquino Nathaniel', 'nathaniel', 'Aquino', 'Male', '2000-10-29', 'nathaniel.aquino-19@cpu.e', '', '', '511160', NULL, '$2y$10$X3q4LIig0hm1eEovAThkheJmAozvjXZ5uiXc5cOIV22QIzT.sL8X2', 0, 1),
(31, 'NathanAquino', 'nathaniel', 'Aquino', '', '0000-00-00', 'nathaniel.aquino-18@cpu.e', '', '', '679183', NULL, '$2y$10$pLu2SA/nyCs1q5x8vY1O6.0rvAdeY4Ev1iTy4h6P3ED74JCEof24m', 0, 1),
(32, 'Nath5', 'nathaniel5', 'Aquino', 'Female', '2000-10-29', 'nathaniel5@gmail.com', '', '', '588259', NULL, '$2y$10$Ywjxh2UWRm9CUwHPV2182eUv2GZ6nlurq2JY9y1CX0RH6ieFDSYLS', 0, 1),
(33, 'Josheph25', 'Joseph', 'Joses', 'Male', '2003-02-23', 'josejoses25@gmail.com', '', '', '359536', NULL, '$2y$10$EKz.yuGoO0jJW0gBy2rnd.xUn5E065Pdsu7YRfSy6vKCwYFobmtaK', 0, 1),
(34, 'Stevenc', 'Steb', 'Asalon', 'Male', '2024-12-11', 'stevenc@gmail.com', '', '', '145928', NULL, '$2y$10$w13VNlooAFxv7gc5fmhpYuxB1PoxvyeR2Btgs7TSNssy6hNxRcZiC', 0, 0),
(35, 'Stevenc', 'Steb', 'Asalon', 'Male', '2024-12-11', 'stevenc@gmail.com', '', '', '690982', NULL, '$2y$10$j7kez4uR19/METz4cC9iLupYzvm3J0k3MLnnhN19.OzGmIuY6lyFW', 0, 0),
(36, 'Steve', 'steh', 'ben', 'Male', '2000-02-09', 'stehben@gmail.com', '', '', '927442', NULL, '$2y$10$NRdjQcWYgeF/Akd0/QcSo.IWqjDMCn42ZA8NsxMe70FgcplQ26PCm', 0, 0),
(37, 'Steve', 'steh', 'ben', 'Male', '2000-02-09', 'stehben@gmail.com', '', '', '122298', NULL, '$2y$10$19fm1PsKdAYm5cdD8/CIHevfR83xQnrC8.11SrLe2mAL8k3OZFu1u', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `user_preferences`
--

CREATE TABLE `user_preferences` (
  `user_id` int(11) NOT NULL,
  `category` varchar(255) NOT NULL,
  `preference_strength` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_preferences`
--

INSERT INTO `user_preferences` (`user_id`, `category`, `preference_strength`) VALUES
(23, 'Academic', 1),
(23, 'Art', 1),
(23, 'Books', 1),
(31, 'Academic', 1),
(31, 'Art', 1),
(31, 'Books', 1),
(31, 'Business', 1),
(31, 'Food', 1),
(31, 'News', 1),
(31, 'Politics', 1),
(31, 'Sports', 1),
(32, 'Art', 1),
(32, 'Food', 1),
(32, 'Iloilo City', 10),
(32, 'News', 1),
(33, 'Academic', 1),
(33, 'Business', 1),
(33, 'Food', 1);

-- --------------------------------------------------------

--
-- Table structure for table `user_rewards`
--

CREATE TABLE `user_rewards` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `reward_id` int(11) NOT NULL,
  `redemption_date` datetime DEFAULT current_timestamp(),
  `status` enum('redeemed','pending','expired') NOT NULL DEFAULT 'pending',
  `voucher_code` varchar(100) DEFAULT NULL,
  `description` varchar(255) NOT NULL,
  `expiry_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_rewards`
--

INSERT INTO `user_rewards` (`id`, `user_id`, `reward_id`, `redemption_date`, `status`, `voucher_code`, `description`, `expiry_date`) VALUES
(1, 13, 1, '2025-01-07 10:45:08', 'redeemed', '866BFEFBE061', '', '0000-00-00 00:00:00'),
(2, 13, 1, '2025-01-07 12:04:50', 'redeemed', '3D601A4243A8', '', '2025-01-07 12:04:50'),
(3, 13, 1, '2025-01-07 19:11:12', 'redeemed', '691ABE00981F', '', '2025-02-06 19:11:12');

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
-- Indexes for table `redemptions`
--
ALTER TABLE `redemptions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `voucher_code` (`voucher_code`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `reward_id` (`reward_id`);

--
-- Indexes for table `rewards`
--
ALTER TABLE `rewards`
  ADD PRIMARY KEY (`id`);

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
-- Indexes for table `survey_similarities`
--
ALTER TABLE `survey_similarities`
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
-- Indexes for table `user_rewards`
--
ALTER TABLE `user_rewards`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `reward_id` (`reward_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `options`
--
ALTER TABLE `options`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT for table `redemptions`
--
ALTER TABLE `redemptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `rewards`
--
ALTER TABLE `rewards`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `surveys`
--
ALTER TABLE `surveys`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `survey_categories`
--
ALTER TABLE `survey_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `survey_interactions`
--
ALTER TABLE `survey_interactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `survey_responses`
--
ALTER TABLE `survey_responses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=126;

--
-- AUTO_INCREMENT for table `survey_similarities`
--
ALTER TABLE `survey_similarities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `user_rewards`
--
ALTER TABLE `user_rewards`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
-- Constraints for table `redemptions`
--
ALTER TABLE `redemptions`
  ADD CONSTRAINT `redemptions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `redemptions_ibfk_2` FOREIGN KEY (`reward_id`) REFERENCES `rewards` (`id`) ON DELETE CASCADE;

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

--
-- Constraints for table `user_rewards`
--
ALTER TABLE `user_rewards`
  ADD CONSTRAINT `user_rewards_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_rewards_ibfk_2` FOREIGN KEY (`reward_id`) REFERENCES `rewards` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

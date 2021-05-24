-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3308
-- Generation Time: May 24, 2021 at 11:22 PM
-- Server version: 8.0.18
-- PHP Version: 7.3.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `parfait`
--

-- --------------------------------------------------------

--
-- Table structure for table `event`
--

DROP TABLE IF EXISTS `event`;
CREATE TABLE IF NOT EXISTS `event` (
  `eventID` int(16) UNSIGNED NOT NULL AUTO_INCREMENT,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `startTime` time NOT NULL,
  `endTime` time NOT NULL,
  `eventName` varchar(255) NOT NULL,
  `eventDescription` varchar(1025) DEFAULT NULL,
  `repeatFrequency` varchar(30) DEFAULT NULL,
  `repeatUntil` date DEFAULT NULL,
  `groupID` int(10) UNSIGNED NOT NULL,
  `repeatEventKey` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`eventID`),
  KEY `fk_groupevent` (`groupID`)
) ENGINE=InnoDB AUTO_INCREMENT=450 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `event`
--

INSERT INTO `event` (`eventID`, `startDate`, `endDate`, `startTime`, `endTime`, `eventName`, `eventDescription`, `repeatFrequency`, `repeatUntil`, `groupID`, `repeatEventKey`) VALUES
(53, '2021-05-18', '2021-05-18', '08:30:00', '14:30:00', 'Tafe', 'Catch up class', 'Weekly', '2021-06-26', 0, NULL),
(54, '2021-05-17', '2021-05-17', '15:10:00', '17:15:00', 'Play date with Lincoln and Tye', 'Melrose Park', 'null', '0000-00-00', 0, NULL),
(55, '2021-05-17', '2021-05-17', '08:00:00', '14:00:00', 'Tafe', 'Class with John', 'null', '0000-00-00', 0, NULL),
(56, '2021-05-19', '2021-05-19', '09:00:00', '15:30:00', 'Tafe', 'Class with John', NULL, '2021-06-25', 0, NULL),
(57, '2021-05-22', '2021-05-22', '08:09:00', '12:09:00', 'Random event', 'Aint nobody got time for dat', 'null', '0000-00-00', 0, NULL),
(58, '2021-05-21', '2021-05-21', '07:00:00', '09:00:00', 'Another event', 'Eventish', 'null', '0000-00-00', 0, NULL),
(287, '2021-05-17', '2021-05-17', '08:00:00', '14:00:00', 'Tafe', 'Class with John', 'Weekly', '2021-06-26', 0, '1621261431247'),
(288, '2021-05-24', '2021-05-24', '08:00:00', '14:00:00', 'Tafe', 'Class with John', 'Weekly', '2021-06-26', 0, '1621261431247'),
(289, '2021-05-31', '2021-05-31', '08:00:00', '14:00:00', 'Tafe', 'Class with John', 'Weekly', '2021-06-26', 0, '1621261431247'),
(290, '2021-06-07', '2021-06-07', '08:00:00', '14:00:00', 'Tafe', 'Class with John', 'Weekly', '2021-06-26', 0, '1621261431247'),
(291, '2021-06-14', '2021-06-14', '08:00:00', '14:00:00', 'Tafe', 'Class with John', 'Weekly', '2021-06-26', 0, '1621261431247'),
(292, '2021-06-21', '2021-06-21', '08:00:00', '14:00:00', 'Tafe', 'Class with John', 'Weekly', '2021-06-26', 0, '1621261431247'),
(293, '2021-05-18', '2021-05-18', '08:30:00', '14:30:00', 'Tafe', 'Catch up class', 'Weekly', '2021-06-26', 0, '1621302086075'),
(294, '2021-05-25', '2021-05-25', '08:30:00', '14:30:00', 'Tafe', 'Catch up class', 'Weekly', '2021-06-26', 0, '1621302086075'),
(295, '2021-06-01', '2021-06-01', '08:30:00', '14:30:00', 'Tafe', 'Catch up class', 'Weekly', '2021-06-26', 0, '1621302086075'),
(296, '2021-06-08', '2021-06-08', '08:30:00', '14:30:00', 'Tafe', 'Catch up class', 'Weekly', '2021-06-26', 0, '1621302086075'),
(297, '2021-06-15', '2021-06-15', '08:30:00', '14:30:00', 'Tafe', 'Catch up class', 'Weekly', '2021-06-26', 0, '1621302086075'),
(298, '2021-06-22', '2021-06-22', '08:30:00', '14:30:00', 'Tafe', 'Catch up class', 'Weekly', '2021-06-26', 0, '1621302086075'),
(299, '2021-05-22', '2021-05-22', '08:58:00', '12:09:00', 'Random event', 'Aint nobody got time for dat', 'null', '0000-00-00', 0, '1621698241723'),
(300, '2021-05-22', '2021-05-22', '08:58:00', '12:09:00', 'Random event', 'Aint nobody got time for dat', 'Daily', '2021-05-30', 0, '1621698292310'),
(302, '2021-05-24', '2021-05-24', '08:58:00', '12:09:00', 'Random event', 'Aint nobody got time for dat', 'Daily', '2021-05-30', 0, '1621698292310'),
(303, '2021-05-25', '2021-05-25', '08:58:00', '12:09:00', 'Random event', 'Aint nobody got time for dat', 'Daily', '2021-05-30', 0, '1621698292310'),
(304, '2021-05-26', '2021-05-26', '08:58:00', '12:09:00', 'Random event', 'Aint nobody got time for dat', 'Daily', '2021-05-30', 0, '1621698292310'),
(305, '2021-05-27', '2021-05-27', '08:58:00', '12:09:00', 'Random event', 'Aint nobody got time for dat', 'Daily', '2021-05-30', 0, '1621698292310'),
(306, '2021-05-28', '2021-05-28', '08:58:00', '12:09:00', 'Random event', 'Aint nobody got time for dat', 'Daily', '2021-05-30', 0, '1621698292310'),
(307, '2021-05-29', '2021-05-29', '08:58:00', '12:09:00', 'Random event', 'Aint nobody got time for dat', 'Daily', '2021-05-30', 0, '1621698292310'),
(308, '2021-05-30', '2021-05-30', '08:58:00', '12:09:00', 'Random event', 'Aint nobody got time for dat', 'Daily', '2021-05-30', 0, '1621698292310'),
(309, '2021-06-29', '2021-06-29', '11:00:00', '12:00:00', 'Steak sandwiches', '', 'null', '0000-00-00', 0, NULL),
(310, '2021-05-27', '2021-05-27', '17:15:00', '18:30:00', 'Football training', 'Brendale', 'Weekly', '2021-09-30', 0, NULL),
(312, '2021-06-04', '2021-06-04', '18:00:00', '23:00:00', 'Friday 2nd attempt', 'starting 4th repeating weekly until aug', 'Weekly', '2021-08-19', 0, '1621734038620'),
(313, '2021-06-11', '2021-06-11', '18:00:00', '23:00:00', 'Friday 2nd attempt', 'starting 4th repeating weekly until aug', 'Weekly', '2021-08-19', 0, '1621734038620'),
(314, '2021-06-18', '2021-06-18', '18:00:00', '23:00:00', 'Friday 2nd attempt', 'starting 4th repeating weekly until aug', 'Weekly', '2021-08-19', 0, '1621734038620'),
(315, '2021-06-25', '2021-06-25', '18:00:00', '23:00:00', 'Friday 2nd attempt', 'starting 4th repeating weekly until aug', 'Weekly', '2021-08-19', 0, '1621734038620'),
(316, '2021-07-02', '2021-07-02', '18:00:00', '23:00:00', 'Friday 2nd attempt', 'starting 4th repeating weekly until aug', 'Weekly', '2021-08-19', 0, '1621734038620'),
(317, '2021-07-09', '2021-07-09', '18:00:00', '23:00:00', 'Friday 2nd attempt', 'starting 4th repeating weekly until aug', 'Weekly', '2021-08-19', 0, '1621734038620'),
(318, '2021-07-16', '2021-07-16', '18:00:00', '23:00:00', 'Friday 2nd attempt', 'starting 4th repeating weekly until aug', 'Weekly', '2021-08-19', 0, '1621734038620'),
(319, '2021-07-23', '2021-07-23', '18:00:00', '23:00:00', 'Friday 2nd attempt', 'starting 4th repeating weekly until aug', 'Weekly', '2021-08-19', 0, '1621734038620'),
(320, '2021-07-30', '2021-07-30', '18:00:00', '23:00:00', 'Friday 2nd attempt', 'starting 4th repeating weekly until aug', 'Weekly', '2021-08-19', 0, '1621734038620'),
(321, '2021-08-06', '2021-08-06', '18:00:00', '23:00:00', 'Friday 2nd attempt', 'starting 4th repeating weekly until aug', 'Weekly', '2021-08-19', 0, '1621734038620'),
(322, '2021-08-13', '2021-08-13', '18:00:00', '23:00:00', 'Friday 2nd attempt', 'starting 4th repeating weekly until aug', 'Weekly', '2021-08-19', 0, '1621734038620'),
(323, '2021-06-02', '2021-06-02', '00:00:00', '23:59:00', 'Tim birthday', 'U B 40', 'null', '0000-00-00', 0, '1621734265031'),
(324, '2021-05-23', '2021-05-23', '13:00:00', '17:00:00', 'Dylans birthday', 'Kalinga park', 'null', '0000-00-00', 0, '1621735828923'),
(325, '2021-06-05', '2021-06-05', '17:00:00', '23:00:00', 'Triva night', 'Trivia night for Mum', 'null', '0000-00-00', 0, '1621762640586'),
(326, '2021-05-23', '2021-05-23', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(327, '2021-05-24', '2021-05-24', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(328, '2021-05-25', '2021-05-25', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(329, '2021-05-26', '2021-05-26', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(330, '2021-05-27', '2021-05-27', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(331, '2021-05-28', '2021-05-28', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(332, '2021-05-29', '2021-05-29', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(333, '2021-05-30', '2021-05-30', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(334, '2021-05-31', '2021-05-31', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(335, '2021-06-01', '2021-06-01', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(336, '2021-06-02', '2021-06-02', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(337, '2021-06-03', '2021-06-03', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(338, '2021-06-04', '2021-06-04', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(339, '2021-06-05', '2021-06-05', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(340, '2021-06-06', '2021-06-06', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(341, '2021-06-07', '2021-06-07', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(342, '2021-06-08', '2021-06-08', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(343, '2021-06-09', '2021-06-09', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(344, '2021-06-10', '2021-06-10', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(345, '2021-06-11', '2021-06-11', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(346, '2021-06-12', '2021-06-12', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(347, '2021-06-13', '2021-06-13', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(348, '2021-06-14', '2021-06-14', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(349, '2021-06-15', '2021-06-15', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(350, '2021-06-16', '2021-06-16', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(351, '2021-06-17', '2021-06-17', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(352, '2021-06-18', '2021-06-18', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(353, '2021-06-19', '2021-06-19', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(354, '2021-06-20', '2021-06-20', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(355, '2021-06-21', '2021-06-21', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(356, '2021-06-22', '2021-06-22', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(357, '2021-06-23', '2021-06-23', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(358, '2021-06-24', '2021-06-24', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(359, '2021-06-25', '2021-06-25', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(360, '2021-06-26', '2021-06-26', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(361, '2021-06-27', '2021-06-27', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(362, '2021-06-28', '2021-06-28', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(363, '2021-06-29', '2021-06-29', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(364, '2021-06-30', '2021-06-30', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(365, '2021-07-01', '2021-07-01', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(366, '2021-07-02', '2021-07-02', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(367, '2021-07-03', '2021-07-03', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(368, '2021-07-04', '2021-07-04', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(369, '2021-07-05', '2021-07-05', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(370, '2021-07-06', '2021-07-06', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(371, '2021-07-07', '2021-07-07', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(372, '2021-07-08', '2021-07-08', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(373, '2021-07-09', '2021-07-09', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(374, '2021-07-10', '2021-07-10', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(375, '2021-07-11', '2021-07-11', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(376, '2021-07-12', '2021-07-12', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(377, '2021-07-13', '2021-07-13', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(378, '2021-07-14', '2021-07-14', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(379, '2021-07-15', '2021-07-15', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(380, '2021-07-16', '2021-07-16', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(381, '2021-07-17', '2021-07-17', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(382, '2021-07-18', '2021-07-18', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(383, '2021-07-19', '2021-07-19', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(384, '2021-07-20', '2021-07-20', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(385, '2021-07-21', '2021-07-21', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(386, '2021-07-22', '2021-07-22', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(387, '2021-07-23', '2021-07-23', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(388, '2021-07-24', '2021-07-24', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(389, '2021-07-25', '2021-07-25', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(390, '2021-07-26', '2021-07-26', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(391, '2021-07-27', '2021-07-27', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(392, '2021-07-28', '2021-07-28', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(393, '2021-07-29', '2021-07-29', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(394, '2021-07-30', '2021-07-30', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(395, '2021-07-31', '2021-07-31', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(396, '2021-08-01', '2021-08-01', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(397, '2021-08-02', '2021-08-02', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(398, '2021-08-03', '2021-08-03', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(399, '2021-08-04', '2021-08-04', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(400, '2021-08-05', '2021-08-05', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(401, '2021-08-06', '2021-08-06', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(402, '2021-08-07', '2021-08-07', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(403, '2021-08-08', '2021-08-08', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(404, '2021-08-09', '2021-08-09', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(405, '2021-08-10', '2021-08-10', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(406, '2021-08-11', '2021-08-11', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(407, '2021-08-12', '2021-08-12', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(408, '2021-08-13', '2021-08-13', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(409, '2021-08-14', '2021-08-14', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(410, '2021-08-15', '2021-08-15', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(411, '2021-08-16', '2021-08-16', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(412, '2021-08-17', '2021-08-17', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(413, '2021-08-18', '2021-08-18', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(414, '2021-08-19', '2021-08-19', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(415, '2021-08-20', '2021-08-20', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(416, '2021-08-21', '2021-08-21', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(417, '2021-08-22', '2021-08-22', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(418, '2021-08-23', '2021-08-23', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(419, '2021-08-24', '2021-08-24', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(420, '2021-08-25', '2021-08-25', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(421, '2021-08-26', '2021-08-26', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(422, '2021-08-27', '2021-08-27', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(423, '2021-08-28', '2021-08-28', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(424, '2021-08-29', '2021-08-29', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(425, '2021-08-30', '2021-08-30', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(426, '2021-08-31', '2021-08-31', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(427, '2021-09-01', '2021-09-01', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(428, '2021-09-02', '2021-09-02', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(429, '2021-09-03', '2021-09-03', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(430, '2021-09-04', '2021-09-04', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(431, '2021-09-05', '2021-09-05', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(432, '2021-09-06', '2021-09-06', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(433, '2021-09-07', '2021-09-07', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(434, '2021-09-08', '2021-09-08', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(435, '2021-09-09', '2021-09-09', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(436, '2021-09-10', '2021-09-10', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(437, '2021-09-11', '2021-09-11', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(438, '2021-09-12', '2021-09-12', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(439, '2021-09-13', '2021-09-13', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(440, '2021-09-14', '2021-09-14', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(441, '2021-09-15', '2021-09-15', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(442, '2021-09-16', '2021-09-16', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(443, '2021-09-17', '2021-09-17', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(444, '2021-09-18', '2021-09-18', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(445, '2021-09-19', '2021-09-19', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(446, '2021-09-20', '2021-09-20', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(447, '2021-09-21', '2021-09-21', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(448, '2021-09-22', '2021-09-22', '05:00:00', '06:30:00', 'gym session', 'gym session', 'Daily', '2021-09-22', 0, '1621766398480'),
(449, '2021-05-22', '2021-05-25', '07:00:00', '19:00:00', 'Weekend away', '', 'null', '0000-00-00', 0, '1621770183614');

-- --------------------------------------------------------

--
-- Table structure for table `eventmember`
--

DROP TABLE IF EXISTS `eventmember`;
CREATE TABLE IF NOT EXISTS `eventmember` (
  `eventMemberID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `eventID` int(16) UNSIGNED NOT NULL,
  `memberID` int(10) UNSIGNED NOT NULL,
  `acceptedFlag` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`eventMemberID`),
  KEY `fk_event` (`eventID`),
  KEY `fk_member` (`memberID`)
) ENGINE=InnoDB AUTO_INCREMENT=266 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `eventmember`
--

INSERT INTO `eventmember` (`eventMemberID`, `eventID`, `memberID`, `acceptedFlag`) VALUES
(47, 53, 21, 1),
(48, 54, 21, 1),
(49, 55, 21, 1),
(50, 56, 21, 1),
(51, 57, 21, 1),
(52, 58, 21, 1),
(103, 287, 21, 1),
(104, 288, 21, 1),
(105, 289, 21, 1),
(106, 290, 21, 1),
(107, 291, 21, 1),
(108, 292, 21, 1),
(109, 293, 21, 1),
(110, 294, 21, 1),
(111, 295, 21, 1),
(112, 296, 21, 1),
(113, 297, 21, 1),
(114, 298, 21, 1),
(115, 299, 21, 1),
(116, 300, 21, 1),
(118, 302, 21, 1),
(119, 303, 21, 1),
(120, 304, 21, 1),
(121, 305, 21, 1),
(122, 306, 21, 1),
(123, 307, 21, 1),
(124, 308, 21, 1),
(125, 309, 21, 1),
(126, 310, 21, 1),
(128, 312, 21, 1),
(129, 313, 21, 1),
(130, 314, 21, 1),
(131, 315, 21, 1),
(132, 316, 21, 1),
(133, 317, 21, 1),
(134, 318, 21, 1),
(135, 319, 21, 1),
(136, 320, 21, 1),
(137, 321, 21, 1),
(138, 322, 21, 1),
(139, 323, 21, 1),
(140, 324, 21, 1),
(141, 325, 21, 1),
(142, 326, 114, 1),
(143, 327, 114, 1),
(144, 328, 114, 1),
(145, 329, 114, 1),
(146, 330, 114, 1),
(147, 331, 114, 1),
(148, 332, 114, 1),
(149, 333, 114, 1),
(150, 334, 114, 1),
(151, 335, 114, 1),
(152, 336, 114, 1),
(153, 337, 114, 1),
(154, 338, 114, 1),
(155, 339, 114, 1),
(156, 340, 114, 1),
(157, 341, 114, 1),
(158, 342, 114, 1),
(159, 343, 114, 1),
(160, 344, 114, 1),
(161, 345, 114, 1),
(162, 346, 114, 1),
(163, 347, 114, 1),
(164, 348, 114, 1),
(165, 349, 114, 1),
(166, 350, 114, 1),
(167, 351, 114, 1),
(168, 352, 114, 1),
(169, 353, 114, 1),
(170, 354, 114, 1),
(171, 355, 114, 1),
(172, 356, 114, 1),
(173, 357, 114, 1),
(174, 358, 114, 1),
(175, 359, 114, 1),
(176, 360, 114, 1),
(177, 361, 114, 1),
(178, 362, 114, 1),
(179, 363, 114, 1),
(180, 364, 114, 1),
(181, 365, 114, 1),
(182, 366, 114, 1),
(183, 367, 114, 1),
(184, 368, 114, 1),
(185, 369, 114, 1),
(186, 370, 114, 1),
(187, 371, 114, 1),
(188, 372, 114, 1),
(189, 373, 114, 1),
(190, 374, 114, 1),
(191, 375, 114, 1),
(192, 376, 114, 1),
(193, 377, 114, 1),
(194, 378, 114, 1),
(195, 379, 114, 1),
(196, 380, 114, 1),
(197, 381, 114, 1),
(198, 382, 114, 1),
(199, 383, 114, 1),
(200, 384, 114, 1),
(201, 385, 114, 1),
(202, 386, 114, 1),
(203, 387, 114, 1),
(204, 388, 114, 1),
(205, 389, 114, 1),
(206, 390, 114, 1),
(207, 391, 114, 1),
(208, 392, 114, 1),
(209, 393, 114, 1),
(210, 394, 114, 1),
(211, 395, 114, 1),
(212, 396, 114, 1),
(213, 397, 114, 1),
(214, 398, 114, 1),
(215, 399, 114, 1),
(216, 400, 114, 1),
(217, 401, 114, 1),
(218, 402, 114, 1),
(219, 403, 114, 1),
(220, 404, 114, 1),
(221, 405, 114, 1),
(222, 406, 114, 1),
(223, 407, 114, 1),
(224, 408, 114, 1),
(225, 409, 114, 1),
(226, 410, 114, 1),
(227, 411, 114, 1),
(228, 412, 114, 1),
(229, 413, 114, 1),
(230, 414, 114, 1),
(231, 415, 114, 1),
(232, 416, 114, 1),
(233, 417, 114, 1),
(234, 418, 114, 1),
(235, 419, 114, 1),
(236, 420, 114, 1),
(237, 421, 114, 1),
(238, 422, 114, 1),
(239, 423, 114, 1),
(240, 424, 114, 1),
(241, 425, 114, 1),
(242, 426, 114, 1),
(243, 427, 114, 1),
(244, 428, 114, 1),
(245, 429, 114, 1),
(246, 430, 114, 1),
(247, 431, 114, 1),
(248, 432, 114, 1),
(249, 433, 114, 1),
(250, 434, 114, 1),
(251, 435, 114, 1),
(252, 436, 114, 1),
(253, 437, 114, 1),
(254, 438, 114, 1),
(255, 439, 114, 1),
(256, 440, 114, 1),
(257, 441, 114, 1),
(258, 442, 114, 1),
(259, 443, 114, 1),
(260, 444, 114, 1),
(261, 445, 114, 1),
(262, 446, 114, 1),
(263, 447, 114, 1),
(264, 448, 114, 1),
(265, 449, 27, 1);

-- --------------------------------------------------------

--
-- Table structure for table `groupmember`
--

DROP TABLE IF EXISTS `groupmember`;
CREATE TABLE IF NOT EXISTS `groupmember` (
  `groupMemberID` int(16) UNSIGNED NOT NULL AUTO_INCREMENT,
  `groupID` int(10) UNSIGNED NOT NULL,
  `memberID` int(10) UNSIGNED NOT NULL,
  `activeFlag` tinyint(1) NOT NULL DEFAULT '0',
  `adminFlag` tinyint(1) NOT NULL,
  PRIMARY KEY (`groupMemberID`),
  KEY `fk_groupmembergroup` (`groupID`),
  KEY `fk_groupmember` (`memberID`)
) ENGINE=InnoDB AUTO_INCREMENT=374 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `groupmember`
--

INSERT INTO `groupmember` (`groupMemberID`, `groupID`, `memberID`, `activeFlag`, `adminFlag`) VALUES
(73, 65, 19, 0, 0),
(79, 68, 19, 1, 1),
(88, 73, 24, 1, 0),
(89, 73, 26, 1, 0),
(91, 75, 19, 1, 0),
(92, 75, 24, 1, 0),
(93, 75, 26, 1, 0),
(298, 145, 19, 1, 0),
(302, 147, 27, 1, 0),
(322, 157, 110, 1, 0),
(323, 157, 27, 1, 0),
(325, 158, 21, 1, 0),
(326, 158, 27, 1, 0),
(328, 158, 110, 1, 1),
(329, 159, 21, 1, 0),
(330, 159, 19, 1, 0),
(331, 159, 27, 1, 0),
(333, 159, 110, 1, 1),
(334, 160, 24, 1, 0),
(335, 160, 19, 1, 0),
(337, 160, 110, 1, 1),
(339, 161, 19, 1, 0),
(340, 161, 24, 1, 0),
(341, 161, 26, 1, 0),
(342, 161, 27, 1, 0),
(343, 161, 110, 1, 0),
(344, 161, 21, 1, 1),
(353, 163, 24, 1, 0),
(354, 163, 110, 1, 0),
(356, 164, 24, 1, 0),
(357, 164, 19, 1, 0),
(358, 164, 21, 1, 1),
(359, 165, 27, 1, 0),
(360, 165, 21, 1, 1),
(361, 166, 21, 1, 0),
(362, 166, 110, 1, 0),
(363, 166, 112, 1, 1),
(364, 169, 24, 1, 0),
(365, 169, 26, 1, 0),
(366, 169, 21, 1, 1),
(367, 170, 112, 1, 0),
(368, 170, 110, 1, 0),
(369, 170, 27, 1, 0),
(370, 170, 113, 1, 1),
(371, 171, 110, 1, 0),
(372, 171, 21, 1, 0),
(373, 171, 114, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
CREATE TABLE IF NOT EXISTS `member` (
  `memberID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `fname` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `lname` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(10) NOT NULL,
  `password` varchar(255) NOT NULL,
  `userType` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `profilePicPath` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `activeFlag` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`memberID`)
) ENGINE=InnoDB AUTO_INCREMENT=115 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `member`
--

INSERT INTO `member` (`memberID`, `fname`, `lname`, `email`, `phone`, `password`, `userType`, `profilePicPath`, `activeFlag`) VALUES
(19, 'Bob', 'Jane', 'bob@hotmail.com', '0422222223', 'SBgazSKz7a68ikR4aKfffOYpkgo=', 'Admin', 'http://res.cloudinary.com/parfait/image/upload/v1620825937/emciiaevlfhadad9jiro.jpg', 1),
(21, 'Fiona', 'Wrigley', 'fionaholt@hotmail.com', '0437777778', 'axY/o7rUemJHSvy4H7nye8tUnYI=', 'Admin', 'http://res.cloudinary.com/parfait/image/upload/v1620873029/x4xpngtcbxhgfzc0w7ir.jpg', 1),
(24, 'Penny', 'Showman', 'penny@fakeemail.com', '0444444422', 'nJad30VAeePUOZc7urY+piM+QIc=', 'Member', '', 1),
(26, 'Gillian', 'Wrigley', 'gill@hotmail.com', '0488888888', 'u+tP7dGfd/adAx8zOVWy9EXW+pc=', 'Member', 'http://res.cloudinary.com/parfait/image/upload/v1620826152/netr9ngx5x4hnyiyj1l5.jpg', 1),
(27, 'Timothy', 'Wrigley', 'tim@hotmail.com', '0436666666', 's2b9bqzsJoVT0i+GUoMZtV3MbEo=', 'Member', 'http://res.cloudinary.com/parfait/image/upload/v1620826083/vnxket35hdkz6dfvcnqk.jpg', 1),
(110, 'Lachlan', 'Stephan', 'lachlan@hotmail.com', '0444111111', 'u+tP7dGfd/adAx8zOVWy9EXW+pc=', 'Member', 'http://res.cloudinary.com/parfait/image/upload/v1620825721/pmtx8fnydieda8r0j6my.jpg', 1),
(112, 'Marcello', 'Marshmellow', 'marcello@hotmail.com', '4880507568', 'u+tP7dGfd/adAx8zOVWy9EXW+pc=', 'Admin', 'http://res.cloudinary.com/parfait/image/upload/v1620825889/p5geh7us9eg34ew617uu.jpg', 1),
(113, 'Ashton', 'Wrigley', 'ashton@hotmail.com', '0411111111', 'u+tP7dGfd/adAx8zOVWy9EXW+pc=', 'Member', 'http://res.cloudinary.com/parfait/image/upload/v1620829396/zqordcucaajbq6hgqdie.jpg', 1),
(114, 'Kim', 'Woodfield', 'kim@hotmail.com', '0988877766', 'u+tP7dGfd/adAx8zOVWy9EXW+pc=', 'Member', '', 1);

-- --------------------------------------------------------

--
-- Table structure for table `parfaitgroup`
--

DROP TABLE IF EXISTS `parfaitgroup`;
CREATE TABLE IF NOT EXISTS `parfaitgroup` (
  `groupID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `groupName` varchar(255) NOT NULL,
  `groupDescription` varchar(1024) NOT NULL,
  PRIMARY KEY (`groupID`)
) ENGINE=InnoDB AUTO_INCREMENT=172 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `parfaitgroup`
--

INSERT INTO `parfaitgroup` (`groupID`, `groupName`, `groupDescription`) VALUES
(0, '0', ''),
(5, 'Coffee Mums', 'Coffee with the school mums'),
(6, 'TAFE Crew', 'The A team'),
(7, 'Fam Bam', 'Date night'),
(8, 'Rodents', 'Rats, mice, etc.'),
(65, 'Coffee Queens', 'Coffffeeeee Baaaaabbbbby'),
(68, 'Pub pals', 'Anyone fancy a beer?'),
(73, 'Group A', 'Group A description'),
(75, 'tst group', 'gggg'),
(145, 'John&#x27;s javascripters', 'A bunch of rogue programmers'),
(147, 'Big Love', 'Big love'),
(157, 'Group a doop', 'Test group'),
(158, 'Rodents', 'Rando rodents'),
(159, 'TAFE chums', 'TAFE chums'),
(160, 'Randos', 'A bunch of randoms'),
(161, 'Big mama', 'Testing multi members'),
(163, 'Squad', ''),
(164, 'bottom feeder', ''),
(165, 'Date night', 'Sexy time with the boo'),
(166, 'Squad', 'Randos from Tafe'),
(167, '0', ''),
(169, 'catshowadmin3', 'bbb'),
(170, 'Fight Club', 'Rule 1. No talking about fight club'),
(171, 'Tafe buddies', '');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('m0Ff_woED3Hj3JDOdovF6Vt46PKAx0BH', 1622002917, '{\"cookie\":{\"originalMaxAge\":172800000,\"expires\":\"2021-05-26T04:04:35.933Z\",\"secure\":false,\"httpOnly\":false,\"path\":\"/\",\"sameSite\":\"lax\"},\"userID\":21,\"userType\":\"Admin\"}');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `event`
--
ALTER TABLE `event`
  ADD CONSTRAINT `fk_groupevent` FOREIGN KEY (`groupID`) REFERENCES `parfaitgroup` (`groupID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `eventmember`
--
ALTER TABLE `eventmember`
  ADD CONSTRAINT `fk_event` FOREIGN KEY (`eventID`) REFERENCES `event` (`eventID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_member` FOREIGN KEY (`memberID`) REFERENCES `member` (`memberID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `groupmember`
--
ALTER TABLE `groupmember`
  ADD CONSTRAINT `fk_groupmember` FOREIGN KEY (`memberID`) REFERENCES `member` (`memberID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_groupmembergroup` FOREIGN KEY (`groupID`) REFERENCES `parfaitgroup` (`groupID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

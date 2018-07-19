/*
 Navicat MySQL Data Transfer

 Source Server         : tap4fun
 Source Server Type    : MySQL
 Source Server Version : 80011
 Source Host           : localhost:3306
 Source Schema         : tap4fun

 Target Server Type    : MySQL
 Target Server Version : 80011
 File Encoding         : 65001

 Date: 19/07/2018 14:51:45
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for authCode
-- ----------------------------
DROP TABLE IF EXISTS `authCode`;
CREATE TABLE `authCode` (
  `testNum` int(255) DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `count` int(255) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`count`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for cmtInfo
-- ----------------------------
DROP TABLE IF EXISTS `cmtInfo`;
CREATE TABLE `cmtInfo` (
  `imgID` int(255) NOT NULL,
  `comment` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `phone` varchar(255) NOT NULL,
  `cmtLikesNum` int(255) NOT NULL,
  `count` int(255) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`count`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for imgInfo
-- ----------------------------
DROP TABLE IF EXISTS `imgInfo`;
CREATE TABLE `imgInfo` (
  `phone` varchar(255) NOT NULL,
  `imgID` int(5) NOT NULL,
  `img` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `imgLikesNum` int(255) NOT NULL,
  `imgLables` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`imgID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for lableInfo
-- ----------------------------
DROP TABLE IF EXISTS `lableInfo`;
CREATE TABLE `lableInfo` (
  `imgID` int(255) NOT NULL,
  `lable` varchar(255) NOT NULL,
  `count` int(255) NOT NULL,
  PRIMARY KEY (`count`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for likesInfo
-- ----------------------------
DROP TABLE IF EXISTS `likesInfo`;
CREATE TABLE `likesInfo` (
  `phone` varchar(255) NOT NULL,
  `imgLikesID` int(11) NOT NULL,
  `count` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`count`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for userInfo
-- ----------------------------
DROP TABLE IF EXISTS `userInfo`;
CREATE TABLE `userInfo` (
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `phone` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `signature` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of userInfo
-- ----------------------------
BEGIN;
INSERT INTO `userInfo` VALUES ('黄花鱼', '12549856214', 'jkfdsh334', NULL, '啊啊啊啊饿饿饿', NULL);
INSERT INTO `userInfo` VALUES ('李刚', '13984657946', '111111yezi', NULL, NULL, NULL);
INSERT INTO `userInfo` VALUES ('王发发', '18954786215', '27366aaa', NULL, '你好我是王发发', NULL);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;

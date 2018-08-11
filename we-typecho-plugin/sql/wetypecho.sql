CREATE TABLE `typecho_wetypecho` (
  `id`                int(10) unsigned NOT NULL auto_increment,
  `openid`            varchar(255)     default ''  ,
  `createtime`        int(10)          default 0   ,
  `lastlogin`         int(10)          default 0   ,
  `nickname`          varchar(255)     default ''  ,
  `avatarUrl`         varchar(255)      default ''  ,
  `city`              varchar(255)      default ''  ,
  `country`           varchar(255)      default ''  ,
  `gender`            varchar(255)      default ''  ,
  `province`          varchar(255)     default ''  ,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
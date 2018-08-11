CREATE TABLE `typecho_wetypecholike` (
  `id`                int(10) unsigned NOT NULL auto_increment,
  `openid`            varchar(255)     default ''  ,
  `cid`               int(10)          default 0   ,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
<?php
if (!defined('__TYPECHO_ROOT_DIR__')) exit;
/**
 * 微信小程序WeTypechoAPI接口插件
 *
 * @package WeTypecho
 * @author  成都第七帅
 * @version 0.1
 * @link https://2012.pro
 */
class WeTypecho_Plugin implements Typecho_Plugin_Interface
{
    public static function activate()
    {
        //添加访问接口
        Helper::addRoute('jsonp', '/api/[type]', 'WeTypecho_Action');
        Helper::addAction('json', 'WeTypecho_Action');
        Helper::removePanel(1, 'WeTypecho/users.php');
        Helper::addPanel(1, 'WeTypecho/Users.php', 'WeTypecho', '我的用户', 'administrator');
        $db = Typecho_Db::get();
        $prefix = $db->getPrefix();
        Typecho_Plugin::factory('Widget_Archive')->beforeRender = array('WeTypecho_Plugin','view_count');
        //创建用户数据库
        $scripts = file_get_contents('usr/plugins/WeTypecho/sql/wetypecho.sql');
        $scripts = str_replace('typecho_', $prefix, $scripts);
        $scripts = explode(';', $scripts);
        try {
            if (!$db->fetchRow($db->query("SHOW TABLES LIKE '{$prefix}wetypecho';", Typecho_Db::READ))) {
                foreach ($scripts as $script) {
                    $script = trim($script);
                    if ($script) {
                        $db->query($script, Typecho_Db::WRITE);
                    }
                }
            }
        } catch (Typecho_Db_Exception $e) {
            throw new Typecho_Plugin_Exception(_t('数据表建立失败，插件启用失败，错误信息：%s。', $e->getMessage()));
        } catch (Exception $e) {
            throw new Typecho_Plugin_Exception($e->getMessage());
        }
        //创建赞数据库
        $scriptslike = file_get_contents('usr/plugins/WeTypecho/sql/wetypecholike.sql');
        $scriptslike = str_replace('typecho_', $prefix, $scriptslike);
        $scriptslike = explode(';', $scriptslike);
        try {
            if (!$db->fetchRow($db->query("SHOW TABLES LIKE '{$prefix}wetypecholike';", Typecho_Db::READ))) {
                foreach ($scriptslike as $script) {
                    $script = trim($script);
                    if ($script) {
                        $db->query($script, Typecho_Db::WRITE);
                    }
                }
            }
        } catch (Typecho_Db_Exception $e) {
            throw new Typecho_Plugin_Exception(_t('数据表建立失败，插件启用失败，错误信息：%s。', $e->getMessage()));
        } catch (Exception $e) {
            throw new Typecho_Plugin_Exception($e->getMessage());
        }
        //创建赞数据库
        try {
            //增加点赞和阅读量
            if (!array_key_exists('views', $db->fetchRow($db->select()->from('table.contents'))))
            {
                $db->query(
                    'ALTER TABLE `' . $prefix
                    . 'contents` ADD `views` INT DEFAULT 0;'
                );
            }
            if (!array_key_exists('likes', $db->fetchRow($db->select()->from('table.contents'))))
            {
                $db->query(
                    'ALTER TABLE `' . $prefix
                    . 'contents` ADD `likes` INT DEFAULT 0;'
                );
            }
            if (!array_key_exists('authorImg', $db->fetchRow($db->select()->from('table.comments'))))
            {
                $db->query(
                    'ALTER TABLE `' . $prefix
                    . 'comments` ADD `authorImg` varchar(500) DEFAULT NULL;'
                );
            }
        } catch (Exception $e) {
            echo($e->getMessage());
        }
    }

    public static function deactivate()
    {
        Helper::removeRoute('jsonp');
        Helper::removeAction('json');
        Helper::removePanel(1, 'WeTypecho/Users.php');
    }

    public static function config(Typecho_Widget_Helper_Form $form)
    {        
        $swipePosts = new Typecho_Widget_Helper_Form_Element_Text('swipePosts', NULL, '1,2', _t('滑动文章列表'),  _t('要在滑动列表里面显示的文章的cid值，用英文逗号隔开。'));
        $form->addInput($swipePosts);
        $apiSecret = new Typecho_Widget_Helper_Form_Element_Text('apiSecret', NULL, 'xxx', _t('API密钥'),  _t('要与小程序端config.js中API_SECRET字段保持一致，否则无法从服务器读取数据'));
        $form->addInput($apiSecret);
        $appID = new Typecho_Widget_Helper_Form_Element_Text('appid', NULL, 'xxx', _t('微信小程序的APPID'),  _t('小程序的APP ID'));
        $form->addInput($appID);
        $appSecret = new Typecho_Widget_Helper_Form_Element_Text('appsecret', NULL, 'xxx', _t('微信小程序的APP secret ID'),  _t('小程序的APP secret ID'));
        $form->addInput($appSecret);
        $aboutCid = new Typecho_Widget_Helper_Form_Element_Text('aboutCid', NULL, '1', _t('关于页面CID'),  _t('小程序关于页面显示内容'));
        $form->addInput($aboutCid);
        $monitorOid = new Typecho_Widget_Helper_Form_Element_Text('monitorOid', NULL, '1', _t('资源监控所允许的微信openid'),  _t('资源监控所允许的微信openid，可在wetypecho控制台查看自己Openid来添加'));
        $form->addInput($monitorOid);
        $hiddenmid = new Typecho_Widget_Helper_Form_Element_Text('hiddenmid', NULL, NULL, _t('要在小程序端显示的分类的mid(其余隐藏)，为了过微信审核你懂的^-^，可在过审核后取消隐藏（不填写则不隐藏任何分类）。'),  _t('可在Typecho后台分类管理中查看分类的mid，以英文逗号隔开。不填写则不隐藏任何分类'));
        $form->addInput($hiddenmid);
        $hiddenShare = new Typecho_Widget_Helper_Form_Element_Radio('hiddenShare', array ('0' => '禁用', '1' => '启用'), '1', _t('是否开启小程序端分享，转发功能，1为开启，0为关闭。为了过微信审核你懂的^-^，可在过审核后打开该功能'),  _t('审核时建议关闭，防止微信判定小程序有诱导用户分享的嫌疑，审核通过后再开启。'));
        $form->addInput($hiddenShare);
    }

    public static function personalConfig(Typecho_Widget_Helper_Form $form){}

    public static function render(){}
    public static function view_count($archive)
    {
        if ($archive->is('single')) 
        {
            $cid = $archive->cid;
            $db = Typecho_Db::get();
            $row = $db->fetchRow($db->select('views')->from('table.contents')->where('cid = ?', $cid));
            $db->query($db->update('table.contents')->rows(array('views' => (int)$row['views']+1))->where('cid = ?', $cid));
        }
    }
}
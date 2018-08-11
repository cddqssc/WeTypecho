<?php
error_reporting(E_ALL);
include 'header.php';
include 'menu.php';

date_default_timezone_set('PRC');

$stat = Typecho_Widget::widget('Widget_Stat');

$db = Typecho_Db::get();
$prefix = $db->getPrefix();

//计算分页
$pageSize = 30;
$currentPage = isset($_REQUEST['p']) ? ($_REQUEST['p'] + 0) : 1;

$users = $db->fetchAll($db->select()->from('table.wetypecho')
    ->order('table.wetypecho.createtime', Typecho_Db::SORT_DESC));

$pageCount = ceil( count($users)/$pageSize );

$userpage = $db->fetchAll($db->select()->from('table.wetypecho')
    ->page($currentPage, $pageSize)
    ->order('table.wetypecho.createtime', Typecho_Db::SORT_DESC));

//计算分组
$options = Helper::options();

$pages = $db->fetchAll($db->select()->from('table.contents')
    ->where('table.contents.status = ?', 'publish')
    ->where('table.contents.created < ?', $options->gmtTime)
    ->where('table.contents.type = ?', 'page')
    ->order('table.contents.created', Typecho_Db::SORT_DESC));

$articles = $db->fetchAll($db->select()->from('table.contents')
    ->where('table.contents.status = ?', 'publish')
    ->where('table.contents.created < ?', $options->gmtTime)
    ->where('table.contents.type = ?', 'post')
    ->order('table.contents.created', Typecho_Db::SORT_DESC));

$count = count($pages) + count($articles);

?>
<div class="main">
    <div class="body container">
        <?php include 'page-title.php'; ?>
        <div class="row typecho-page-main" role="main">
            <div class="col-mb-12 typecho-list">
                <div class="typecho-list-operate clearfix">
                    <form method="POST" action="<?php $options->adminUrl('extending.php?panel=WeTypecho%2FUsers.php'); ?>">
                        <div class="search" role="search">
                            <select name="p">
                                <?php for($i=1;$i<=$pageCount;$i++): ?>
                                    <option value="<?php echo $i; ?>"<?php if($i == $currentPage): ?> selected="true"<?php endif; ?>>第<?php echo $i; ?>页</option>
                                <?php endfor; ?>
                            </select>

                            <button type="submit" class="btn btn-s"><?php _e('跳转'); ?></button>
                            <?php if(isset($request->uid)): ?>
                                <input type="hidden" value="<?php echo htmlspecialchars($request->get('uid')); ?>" name="uid" />
                            <?php endif; ?>
                        </div>
                    </form>
                </div><!-- end .typecho-list-operate -->

                <form method="post" name="manage_posts" class="operate-form">
                    <div class="typecho-table-wrap">
                        <table class="typecho-list-table">
                            <colgroup>
                                <col width="12.5%"/>
                                <col width="10%"/>
                                <col width="15%"/>
                                <col width="15%"/>
                                <col width="10%"/>
                                <col width="5%"/>
                                <col width="27.5%"/>
                                <col width="5%"/>
                            </colgroup>
                            <thead>
                            <tr>
                                <th><?php _e('用户名'); ?></th>
                                <th><?php _e('头像'); ?></th>
                                <th><?php _e('创建时间'); ?></th>
                                <th><?php _e('最后访问时间'); ?></th>
                                <th><?php _e('地区'); ?></th>
                                <th><?php _e('性别'); ?></th>
                                <th><?php _e('OpenID'); ?></th>
                                <th><?php _e('赞'); ?></th>
                            </tr>
                            </thead>
                            <tbody>
                                <?php foreach($userpage as $user): ?>
                                    <tr>
                                        <td><?php echo $user['nickname']; ?></td>                                        
                                        <td><?php echo sprintf("<img width=48 height=48 src='%s'>",$user['avatarUrl']); ?></td>
                                        <td><?php echo date('Y-m-d H:i:s', $user['createtime']); ?></td>
                                        <td><?php echo date('Y-m-d H:i:s', $user['lastlogin']); ?></td>
                                        <td><?php echo $user['province']; ?></td>
                                        <td><?php if($user['gender'] == '1') echo '男'; else if($user['gender'] == '0') echo '女'; else echo '未知'; ?></td>
                                        <td><?php echo $user['openid']; ?></td>
                                    </tr>
                                <?php endforeach;?>
                            </tbody>
                        </table>
                    </div>
                </form><!-- end .operate-form -->


            </div><!-- end .typecho-list -->
        </div><!-- end .typecho-page-main -->
    </div>
</div>



<?php
include 'copyright.php';
include 'common-js.php';
include 'table-js.php';
?>
<script>
$(function(){
    var show = $('.show-hide')
    var pre = $('.org-value')

    show.css('color', 'blue');
    show.css('cursor', 'cursor');
    $('.org-value pre').css('background-color', '#E3FFDA');

    pre.hide();

    show.on('click', function(){
        $(this).hide().parent().find('.org-value').show();
    });

    pre.on('click', function(){
        $(this).hide().parent().find('.show-hide').show();
    });
});
</script>
<?php
include 'footer.php';
?>

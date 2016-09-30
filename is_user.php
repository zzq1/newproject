<?php
    //导入配置文件
	require 'config.php';
	//查询
    $query = mysql_query("SELECT user FROM user WHERE user='{$_POST['user']}'") or die('SQL错误！');
    //判断用户名是否已经存在
    if(mysql_fetch_array($query,MYSQL_ASSOC)){
        echo 'false';
    }else{
        echo 'true';
	}
    //断开数据库连接
    mysql_close();
?>
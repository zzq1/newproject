$( function(){
	
	//初始化隐藏用户和登出
	$( "#member,#logout" ).hide();

    //选项卡UI
    $( "#tabs" ).tabs( {
    	heightStyle:"content",
    } );
    
    //折叠菜单UI
    $( "#accordion" ).accordion( {
    	header:"h3",
    	collapsible:true,
    	active:true,
    } );
    
    //ajax远程加载数据库数据显示
    $.ajax( {
    	url:"show_content.php",
    	type:"POST",
    	success:function( response,status,xhr ){
    	    var json = $.parseJSON( response );
    	    var html = "";
    	    var arr = [];
    	    var summary = [];
    	    
    	    $.each( json,function( index,value ){
    	    	html += "<h4>"+ value.user +"发表于"+ value.date +"</h4><h3>"+ value.title +"</h3><div class='editor'>"+ value.content +"</div><div class='bottom'><span class='comment' data-id='"+value.id+"'>0条评论</span><span class='up'>收起</span></div><hr noshade='noshade' size='1' /><div class='comment_list'></div>";                                          
    	    } );
    	    
    	    $( ".content" ).append( html );
    	    
    	    $.each( $( ".editor" ),function( index,value ){
    	    	arr[index] = $( value ).html();
    	    	summary[index] = arr[index].substr( 0,200 );  //从开头截取200个字符
    	    	
    	    	if( summary[index].substring( 199,200 ) == "<" ){
    	    		summary[index] = replaceText( summary[index],200,'' );
    	    	}
    	    	if( summary[index].substring( 198,200 ) == "</" ){
    	    		summary[index] = replaceText( summary[index],200,'' );
    	    		summary[index] = replaceText( summary[index],199,'' );
    	    	}
    	    	
    	    	if( arr[index].length > 200 ){
    	    		summary[index] += "<span class='down'>...显示全部</span>";
    	    		$( value ).html( summary[index] );
    	    	}
    	    } );
    	    
    	    $( ".bottom .up" ).hide();
    	    //展示按钮功能
    	    $.each( $( ".editor" ),function( index,value ){
    	    	$( this ).on( "click",".down",function(){     //事件委托
    	    		$( ".editor" ).eq( index ).html( arr[index] );
    	    		$( this ).hide();
    	    		$( ".bottom .up" ).show();
    	    	} );
    	    } );
    	    
    	    //收起按钮功能
    	    $.each( $( ".bottom .up" ),function( index,value ){
    	    	$( this ).click( function(){
    	    		$( ".editor" ).eq( index ).html( summary[index] );
    	    		$( this ).hide();
    	    		$( ".editor" ).find( ".down" ).show();
    	    	} );
    	    } );
    	    
    	    //字符串特殊字符置空
    	    function replaceText( strObj,pos,replaceText ){
    	    	return strObj.substr( 0,pos-1 ) + replaceText + strObj.substring( pos,strObj.length );
    	    }
  	    
  	        //点击评论
    	    $.each( $( ".bottom" ),function( index,value ){
    	    	$( this ).on( "click",".comment",function(){
    	    		if( $.cookie( "user" ) ){
    	    			if( !$( ".comment_list" ).eq( index ).has( "form" ).length ){
    	    				$( ".comment_list" ).eq( index ).append( "<form><dl class='comment_add'><dt><textarea name='content'></textarea></dt><dd><input type='text' name='titleid' value='"+$(this).attr('data-id')+"'/><input type='text' name='user' value='"+$.cookie("user")+"'/><input type='button' value='发表'/></dd></dl></form>" );
    	    			}
    	    			if( $( ".comment_list" ).eq( index ).is( ":hidden" ) ){
    	    				$( ".comment_list" ).eq( index ).show();
    	    			}else{
    	    				$( ".comment_list" ).eq( index ).hide();
    	    			}
    	    			
    	    			//发表按钮触发事件
    	    			$( ".comment_list" ).eq( index ).find( "input[type='button']" ).button();
    	    			$( ".comment_list" ).eq( index ).find( "input[type='button']" ).click( function(){
    	    				var _this = this;
    	    				
    	    				$( ".comment_list" ).eq( index ).find( "form" ).ajaxSubmit( {
    	    					url:"add_comment.php",
    	    					type:"POST",
    	    					beforeSubmit:function( formData,jqXHR,options ){
    								$('#loading').dialog('open');
    								$( _this ).button( "disable" );
    							},
    							success:function( responseText,statusText ){
		    						if( responseText ){
		    							$( _this ).button( "enable" );
		    							$( "#loading" ).css('background','url(images/success.gif) no-repeat 20px center').html('数据新增成功...');
		    							 
		    							setTimeout( function(){
		    								$( "#loading" ).dialog( "close" );
		    								$( ".comment_list" ).eq( index ).find( "form" ).resetForm();
		    								$( "#loading" ).css('background','url(images/loading.gif) no-repeat 20px center').html('数据交互中...');
		    							},1000 );
		    						}
    					        },
    	    				} );
    	    			} );
    	    			
					}else{
						$( "#error" ).dialog( "open" );
						setTimeout( function(){
							$( "#error" ).dialog( "close" );
							$( "#login" ).dialog( "open" );
						},1000 );
					}
    	    	} );
    	    } );
  	    
    	},
    } );

	//如果存在用户cookie,则显示用户和登出，隐藏注册和登录
	if( $.cookie( "user" ) ){
		$( "#member,#logout" ).show();
		$( "#login_a,#reg_a" ).hide();
	}else{
		$( "#member,#logout" ).hide();
		$( "#login_a,#reg_a" ).show();
	}
	
	//设置用户登出
	$( "#logout" ).click( function(){
		$.removeCookie( "user" );
		window.location.href = "http://localhost/web_know/index.html";
	} );
	
	//搜索按钮UI
	$( "#search_button" ).button( {
		icons:{
			primary:"ui-icon-search",
		},
	} );
	
	//查询按钮UI
	$( "#question_button" ).button( {
		icons:{
			primary:"ui-icon-lightbulb",
		},
	} ).click( function(){
		if( $.cookie( "user" ) ){
			$( "#question" ).dialog( "open" );
		}else{
			$( "#error" ).dialog( "open" );
			setTimeout( function(){
				$( "#error" ).dialog( "close" );
				$( "#login" ).dialog( "open" );
			},1000 );
		}
	} );
	
	//error提问登录对话框
	$( "#error" ).dialog( {
		autoOpen:false,
		modal:true,
		closeOnnEscape:false,
		resizable:false,
		draggable:false,
		width:180,
		height:50,
	} ).parent().find( ".ui-widget-header" ).hide();
	
	//提问问题对话框
	$( "#question" ).dialog( {
		autoOpen:false,
    	width:500,
    	height:370,
    	modal:true,
    	resizable:false,
    	draggable:false,
    	buttons:[ 
    		{
    			text:"发布",
    			click:function(){
    				$( this ).ajaxSubmit( {
    					url:"add_content.php",
    					type:"POST",
    					data:{
    						user:$.cookie( "user" ),
    						content:$('.uEditorIframe').contents().find('#iframeBody').html(),
    					},
    					beforeSubmit:function( formData,jqXHR,options ){
    						$('#loading').dialog('open');
    					},
    					success:function( responseText,statusText ){
    						if( responseText ){
    							$( "#question" ).dialog( "widget" ).find( "button" ).eq( 1 ).button( "enable" );
    							$( "#loading" ).css('background','url(images/success.gif) no-repeat 20px center').html('数据新增成功...');
    							
    							setTimeout( function(){
    								$( "#loading" ).dialog( "close" );
    								$( "#question" ).dialog( "close" );
    								$( "#question" ).resetForm();
    								$( ".uEditorIframe" ).contents().find('#iframeBody').html('请输入问题描述！');
    								$( "#loading" ).css('background','url(images/loading.gif) no-repeat 20px center').html('数据交互中...');
    							},1000 );
    						}
    					},
    				} );
    			},
    		}
    	],
	} );
	
	//html编辑器实例化
	$( ".uEditorCustom" ).uEditor();
	
    //注册表单对话框
    $( "#reg_a" ).on( "click",function(){
    	$( "#reg" ).dialog( {
	    	autoOpen:true,
	    	width:320,
	    	height:340,
	    	modal:true,
	    	resizable:false,
	    	draggable:false,
	    	buttons:[ 
	    		{
	    			text:"提交",
	    			click:function(){
	    				$( this ).submit();
	    			}
	    		}
	    	]
	    } ).buttonset();
    } );
    //注册表单验证插件
    $( "#reg" ).validate( {
    	//将错误信息统一放置在顶部
    	errorLabelContainer:"ol.reg_error",
    	wrapper:"li",
    	//高度自动调整
    	showErrors:function( errorMap,errorList ){
    		var errors = this.numberOfInvalids();
    		if( errors>0 ){
    			$( "#reg" ).dialog( "option","height",errors*20 + 340 );
    		}else{
    			$( "#reg" ).dialog( "option","height",340 );
    		}
    		this.defaultShowErrors();
    	},
    	//验证成功正常取消高亮显示
    	unhighlight:function( element,errorClass ){
    		$( element ).css( "border","1px solid #ccc" );
    		$( element ).parent().find( "span" ).html("&nbsp;").addClass( "succ" );
    	},
    	//阻止默认提交
    	submitHandler:function( form ){
    		$( form ).ajaxSubmit( {
    			url:"add.php",
    			type:"POST",
    			beforeSubmit:function( formData,jqForm,option ){
    				$( "#loading" ).dialog( "open" );
    				$( "#reg" ).dialog( "widget" ).find( "button" ).eq( 1 ).button( "disable" );
    			},
    			success:function( responseText,statusText ){
    				$( "#reg" ).dialog( "widget" ).find( "button" ).eq( 1 ).button( "enable" );
    				//成功后设置用户cookie
    				$.cookie( "user",$( "#user" ).val() );
    				//如果响应数据库响应值为1
    				if( responseText ){
    					$( "#loading" ).css( "background","url('images/success.gif') no-repeat 20px center" ).html( "数据提交成功" );
    					setTimeout( function(){
    						$( "#member,#logout" ).show();
    						$( "#login_a,#reg_a" ).hide();
    						$( "#member" ).html( $.cookie( "user" ) );
    						$( "#loading" ).dialog( "close" );
    						$( "#loading" ).css( "background","url( images/loading.gif ) no-repeat 20px center" ).html( "数据交互中" );
    						$( "#reg" ).dialog( "close" );
    						$( "#reg" ).resetForm();
    						$( "#reg span.star" ).html('*').removeClass('success');
    					},1000 );
    				}
    			},
    		} );
    	},
    	rules:{
	    	user:{
	    		required:true,
	    		minlength:2,
	    		remote:{
	    			url:"is_user.php",
	    			type:"POST",
	    		},
	    	},
	    	pass:{
	    		required:true,
	    		minlength:6,
	    	},
	    	email:{
	    		required:true,
	    		email:true,
	    	},
	    },
	    messages:{
	    	user:{
	    		required:"账号不能为空",
	    		minlength:"长度不少于2位",
	    		remote:"账号被占用",
	    	},
	    	pass:{
	    		required:"密码不能为空",
	    		minlength:"长度不少于6位",
	    	},
	    	email:{
	    		required:"邮箱不能为空",
	    		email:"请输入合法的邮箱",
	    	},
	    }
    } );
    
    //邮箱自动补全插件
 	$( "#email" ).autocomplete( {
   		delay:0,    //延迟为0s;
   		autoFocus:true,
   		source:function( request,response ){
			//定义域名原始数据源
			var hosts = ["163.com","126.com","qq.com","gmail.com","hotmail.com"],
				term = request.term,    
				ix = term.indexOf( "@" ),  
				name = term,       
				host = "",         
				result = [];   
			
		    result.push( term );   //将用户输入的内容拼接上去
		    //如果用户输入了@符号,重新赋值邮箱用户名和后缀
		    if( ix>-1 ){
		    	name = term.slice( 0,ix );  //邮箱用户名
		    	host = term.slice( ix+1 );  //邮箱密码
		    }
		    //如果用户输入邮箱用户名非空
		    if( name ){
		    	var findedHosts = [];
		    	//如果用户输入邮箱域名非空
		    	if( host ){
		    		findedHosts = $.grep( hosts,function( element,index ){   //邮箱域名数组筛选
		    			return element.indexOf( host ) >-1;
		    		} );
		    	}else{
		    		findedHosts = hosts;   //展示全部域名
		    	}
		    	//加入用户输入的邮箱用户名	
		    	var findedResult = []; 	
		    	findedResult = $.map( findedHosts,function( element,index ){
		    		return name + "@" + element;
		    	} );
		    }
		    result = result.concat( findedResult ); //拼接结果集
		    response( result );   //返回补全数据
   		},
 	} );
    
    //出生年月功能激活
    $( "#birthday" ).datepicker( {
    	changeYear:true,
    	changeMonth:true,
    	yearSuffix:"",
    	yearRange:"1950:2020",
    	maxDate:0,
    } );
   
    //loading数据交互中
    $( "#loading" ).dialog( {
    	autoOpen:false,
    	resizable:false,
    	draggable:false,
    	modal:true,
    	closeOnEscape:false,
    	width:180,
    	height:50,
    } ).parent().find( ".ui-widget-header" ).hide();

    //登录表单对话框
    $( "#login" ).dialog( {
	    	autoOpen:false,
	    	width:320,
	    	height:255,
	    	modal:true,
	    	resizable:false,
	    	draggable:false,
	    	buttons:[ 
	    		{
	    			text:"登录",
	    			click:function(){
	    				$( this ).submit();
	    			}
	    		}
	    	],
	    } );
    $( "#login_a" ).on( "click",function(){
    	$( "#login" ).dialog( "open" );
    } );
    //登录表单验证
    $( "#login" ).validate( {
    	//将错误信息统一放置在顶部
    	errorLabelContainer:"ol.login_error",
    	wrapper:"li",
    	//高度自动调整
    	showErrors:function( errorMap,errorList ){
    		var errors = this.numberOfInvalids();
    		if( errors>0 ){
    			$( "#login" ).dialog( "option","height",errors*20 + 240 );
    		}else{
    			$( "#login" ).dialog( "option","height",240 );
    		}
    		this.defaultShowErrors();
    	},
    	//验证成功正常取消高亮显示
    	unhighlight:function( element,errorClass ){
    		$( element ).css( "border","1px solid #ccc" );
    		$( element ).parent().find( "span" ).html("&nbsp;").addClass( "succ" );
    	},
    	//阻止默认提交
    	submitHandler:function( form ){
    		$( form ).ajaxSubmit( {
    			url:"login.php",
    			type:"POST",
    			beforeSubmit:function( formData,jqForm,option ){
    				$( "#loading" ).dialog( "open" );
    				$( "#login" ).dialog( "widget" ).find( "button" ).eq( 1 ).button( "disable" );
    			},
    			success:function( responseText,statusText ){
    				$( "#login" ).dialog( "widget" ).find( "button" ).eq( 1 ).button( "enable" );
    				//成功后设置用户cookie
    				if( $( "#expires" ).is( ":checked" ) ){
    					$.cookie( "user",$( "#login_user" ).val(),{
    						expires:7,
    					} );
    				}else{
    					$.cookie( "user",$( "#login_user" ).val() );
    				}
    				
    				//如果响应数据库响应值为1
    				if( responseText ){
    					$( "#loading" ).css( "background","url('images/success.gif') no-repeat 20px center" ).html( "登录成功" );
    					setTimeout( function(){
    						$( "#member,#logout" ).show();
    						$( "#login_a,#reg_a" ).hide();
    						$( "#member" ).html( $.cookie( "user" ) );
    						$( "#loading" ).dialog( "close" );
    						$( "#loading" ).css( "background","url( images/loading.gif ) no-repeat 20px center" ).html( "数据交互中" );
    						$( "#login" ).dialog( "close" );
    						$( "#login" ).resetForm();
    						$( "#login span.star" ).html('*').removeClass('success');
                            window.location.href="http://localhost:8080/H/main.jsp";
    					},1000 );
    				}
    			},
    		} );
    	},
    	rules:{
	    	login_user:{
	    		required:true,
	    		minlength:2,
	    	},
	    	login_pass:{
	    		required:true,
	    		minlength:6,
	    		remote:{
	    			url:"login.php",
	    			type:"POST",
	    			data:{
	    				login_user:function(){
	    					return $( "#login_user" ).val();
	    				},
	    			},
	    		},
	    	},
	    },
	    messages:{
	    	login_user:{
	    		required:"账号不能为空",
	    		minlength:"长度不少于2位",
	    	},
	    	login_pass:{
	    		required:"密码不能为空",
	    		minlength:"长度不少于6位",
	    		remote:"账号或密码不正确",
	    	},
	    }
    } );

    
     
} );












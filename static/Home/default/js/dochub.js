/*
 * Author:	皇虫(TruthHun)
 * Email:	TruthHun@QQ.COM
 * Date:	2016-12-28
 * */
//'use strict';
$(function(){
    console.log("Designed By 通信团");

    
    $(".go-top").click(function(){
        $('html,body').animate({scrollTop:0}, 200);
    });


    //休眠
    function Sleep(ms) {
        var expire=new Date().getTime()+ms;
        while (true){
            if(new Date().getTime()>expire){
                return true;
            }
        }
    }

    function isIE(){
        if(window.ActiveXObject || "ActiveXObject" in window){
            return true;
        }else{
            return false;
        }
    }


    if(isIE()){
        $(".wenku-header").before('<div style="background-color: #FFFF22;">系统检测到您正在使用IE内核浏览器，请切换至Chrome浏览器，Firefox浏览器或使用360浏览器开启极速模式才能正常使用！</div>');
    }
    
    $('#wenku-carousel').carousel({
        interval: 3000,
	})
    var PageId=$("body").attr("id");


    //搜索页面
    if (PageId=="wenku-search"){
        var _this = $(this),
            searchToolDept = _this.find(".document-dept").eq(0),
            showSearchTool = _this.find(".show-search-tool").eq(0),
            hideSearchTool = _this.find(".hide-search-tool").eq(0),
            helpBlock = _this.find(".help-block").eq(0);
        showSearchTool.on("click", function() {
            helpBlock.animate({top: "0px"}, 250);
        });

        hideSearchTool.on("click", function() {
            helpBlock.animate({top: "-40px"}, 250);
        });

        console.log(_this.find(".hidden-input-dept").val());
        console.log(_this.find(".hidden-input-span").val());

        //如果搜索条件不为空，显示搜索条
        if(_this.find(".hidden-input-dept").val() !== "all" || _this.find(".hidden-input-span").val()){
            helpBlock.animate({top: "0px"}, 0);
        }

        searchToolDept.on("change", function () {
            //console.log(searchToolDept.val());
            _this.find(".hidden-input-dept").val(searchToolDept.val());
        });

        laydate.render({
            elem: '#document-year' //指定元素
            ,type: 'year'
            ,range: true
            ,done: function(value, date, endDate){
                console.log(value); //得到日期生成的值，如：2017-08-18
                //console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                //console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
                _this.find(".hidden-input-span").val(value);
            }
        });
    }
	
	//注册页面
	if (PageId=="wenku-reg") {


		//获取邮箱验证码
		$(".btn-sendmail").click(function(){
			var _this=$(this),form=_this.parents("form"),email=form.find("input[name=email]");
			if(_this.hasClass("disabled")){
				return false;
			}
			if (email.val()==""){
				wenku_alert("danger","请输入注册邮箱",3000,"");
				email.focus();
				return false;
			}else{
				$.get(_this.attr("data-url"),{email:email.val()},function(rt){
					if (rt.status==1){
						_this.addClass("disabled");
						wenku_alert("success",rt.msg,3000,"");
						var ori_text=_this.text();
						var i=60
						var interval=setInterval(function(){
							_this.text(ori_text+"("+i+")")
							i--
							if (i==0){
								clearInterval(interval);
								_this.text(ori_text)
								_this.removeClass("disabled");
							}
						},1000);
						return true;
					}else{
						wenku_alert("danger",rt.msg,3000,"");
						return false;
					}
				});
			}
		});
		
		//会员注册
		$(".btn-reg").click(function(){
			var _this=$(this),form=_this.parents("form"),inputs=form.find("input[required=required]");
			if(_this.hasClass("disabled")) return false;
			_this.addClass("disabled");
			$.each(inputs, function() {    
				if($(this).val()==""){
					$(this).focus();
					_this.removeClass("disabled");
					return false;
				}
			});
			$.post(form.attr("action"),form.serialize(),function(rt){
				if (rt.status==1){
					wenku_alert("success",rt.msg,3000,form.attr("data-redirect"));
				}else{
					wenku_alert("danger",rt.msg,3000,"");
				}
				_this.removeClass("disabled");
			});
		});



	}

	//兼容IE
    function NewDate(str)
    {
        str=str.split('-');
        var date=new Date();
        date.setUTCFullYear(str[0], str[1]-1, str[2]);
        date.setUTCHours(0, 0, 0, 0);
        return date;
    }
	
	//文库文件上传
	if (PageId=="wenku-upload"){
		var obj=eval("("+$("#wenku-cates").text()+")"),cates=obj;
		$(".wenku-form-upload select[name=Chanel]").append(options(0,cates));

        //渲染date控件
        laydate.render({
                elem: '#date1' //指定元素
                ,theme: 'molv'
                ,calendar: true
                ,showBottom: false
                ,done: function(value, date, endDate){
                    console.log(value); //得到日期生成的值，如：2017-08-18
                    console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                    console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
                }
            });
        laydate.render({
            elem: '#date2' //指定元素
            ,theme: 'molv'
            ,calendar: true
            ,showBottom: false
            ,done: function(value, date, endDate){
                console.log(value);
                console.log(date);
                console.log(endDate);
            }
        });

        //选择上传文件
		$(document).on("change",".wenku-form-upload input[type=file]",function(){
            $(".wenku-form-upload [name=Md5]").val("");
            var _this=$(this),
			filename=_this[0]["files"][0]["name"],//文件名
			arr=filename.split("."),
			accept=_this.attr("data-accept").split(","),
			size=_this[0]["files"][0]["size"],
			maxsize=_this.attr("data-maxsize"),
			ext=arr.pop(),
			flag=false;
			$(".wenku-form-upload [name=Title]").val("");
			//检测文件大小是否符合要求
			if(size>maxsize){
				_this.val("");
				wenku_alert("danger","您上传的文件超过了规定大小",3000,"");
				return false;
			}

			//检验上传的文件是否符合要求
			$.each(accept, function(i,v) {    
				if(ext.toLowerCase()==v){
					flag=true;
					return true;
				}
			});

			if(!flag){
				_this.val("");
				wenku_alert("danger","您上传的文件格式不符合要求",3000,"");
				return false;
			}else{
				//去掉文件扩展名的标题
				$(".wenku-form-upload [name=Title]").val(arr.join("."));
                $(".wenku-form-upload [name=Filename]").val(filename);
                //获取分词
                $.get("/segwd",{word:arr.join(".")},function (ret) {
                    $(".wenku-form-upload [name=Tags]").val(ret.data);
                });
			}

			//以下是计算文件md5
            var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
                file = _this[0]["files"][0],
                chunkSize = 10240000,                             // Read in chunks of 10MB
                chunks = Math.ceil(file.size / chunkSize),
                currentChunk = 0,
                spark = new SparkMD5.ArrayBuffer(),
                fileReader = new FileReader();

				fileReader.onload = function (e) {
					// console.log('read chunk nr', currentChunk + 1, 'of', chunks);
					spark.append(e.target.result);                   // Append array buffer
					currentChunk++;
					if (currentChunk < chunks) {
						loadNext();
					} else {
                        $(".wenku-form-upload [name=Md5]").val(spark.end());
						// console.log('finished loading');
						// console.info('computed hash', spark.end());  // Compute hash
					}
				};

				fileReader.onerror = function () {
					wenku_alert("danger","亲，您的浏览器不支持HTML5，推荐您使用谷歌浏览器");
					// console.warn('oops, something went wrong.');
				};

				function loadNext() {
					var start = currentChunk * chunkSize,
						end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
					fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
				}

				loadNext();

		});

		//根据频道生成文件分类选择
        var pid = $(".wenku-form-upload .form-chanel select").val();
        $(".form-level-one select").append(options(pid,cates));

		//根据文件分类选择事件，填写隐藏的CID
		$(".wenku-form-upload .form-level-one select").change(function(){
			var _this=$(this),pid=_this.val();
            if(pid){
                $(".form-level-two input").val(pid);
            }
		});
	

		//执行文件上传操作
		$(".wenku-form-upload [type=submit]").click(function(e){
			e.preventDefault();

			var _this=$(this),form=_this.parents("form"),url_checklogin=form.attr("data-login"),requireds=form.find("[required=required]"),req_len=requireds.length;
			var unixtimeStart = NewDate($(".form-date .demo-input-start").val()).getTime()/1000;
            var unixtimeEnd   = NewDate($(".form-date .demo-input-end").val()).getTime()/1000;
            if (unixtimeEnd && unixtimeEnd <= unixtimeStart){
                wenku_alert("danger","失效日期必须大于生效日期",3000,"");
                return;
            }

            _this.addClass("disabled");

            if (req_len>0){
				$.each(requireds, function() {    
					if($(this).val()==""){
						$(this).focus();
						var err=$(this).attr("data-err");
						wenku_alert("danger",err,3000,"");
						return false;
					}else{
						req_len--;
					}
				});
			}
			if(req_len==0){
				$.get(url_checklogin,function(ret){
					if(ret.status==0){
						wenku_alert("danger","您当前未登录，请先登录",3000,"");
						_this.removeClass("disabled");
					}else{
						//检测文件是否已经存在，存在了则直接提交表单
						$.get(form.attr("data-doccheck"),{md5:form.find("[name=Md5]").val()},function (ret) {
							//文件已在文件库中存在
							// if(ret.status==1){
							// 	$.post(form.attr("action"),form.serialize()+"&Exist=1",function (ret) {
							// 		if(ret.status==1){
                            //             wenku_alert("success",ret.msg,5000,"/user");
							// 		}else{
							// 			wenku_alert("danger",ret.msg,3000,"");
                            //             _this.removeClass("disabled");
							// 		}
                            //     });
							// }else
							{
                                _this.addClass("disabled");
                                var tips='<div class="wenku-progress">\n' +
                                    '\t\t<div class="text-center">\n' +
                                    '\t\t\t<img src="/static/Home/default/img/run.gif" class="thumbnail thumbnail-avatar" alt="玩命上传中" style="width: 200px;margin: 0px auto 15px;">\n' +
                                    '\t\t\t<h3 class="help-block">玩命上传中，请耐心等待...</h3>\n' +
                                    '<div class="progress progress-striped"><div class="progress-bar progress-bar-success" role="progressbar aria-valuemin="0" aria-valuemax="100" style="width: 0%;"><span>0%</span></div></div>' +
                                    '\t\t</div>\n' +
                                    '\t</div>';
                                _this.parents("body").append(tips);
								//文件在文件库中不存在

                                var formData = new FormData();
                                var inputs =form.find(".form-control");
                                $.each(inputs,function () {
                                    formData.append($(this).attr("name"), $(this).val());
                                });

                                // 新增文件生效时间和失效时间
                                formData.append("TimeStart", unixtimeStart);
                                formData.append("TimeEnd", unixtimeEnd);

                                console.log(unixtimeStart);



                                console.log(formData);

                                var inputs=form.find("[type=hidden]");
                                $.each(inputs,function () {
                                    formData.append($(this).attr("name"), $(this).val());
                                });

                                //已存在的话，上传的时候带上存在标志，同时不附带文件，否则附带文件
                                if(ret.status===1) {
                                    formData.append("Exist" , "1");
                                }
                                else{
                                    // 获取上传文件，放到 formData对象里面
                                    var file = $("[name=File]").get(0).files[0];
                                    formData.append("File" , file);
                                }

                                $.ajax({
                                        type: "POST",
                                        url: form.attr("action"),
                                        data: formData ,　　//这里上传的数据使用了formData 对象
                                        processData : false,
                                        //必须false才会自动加上正确的Content-Type
                                        contentType : false ,
                                        //这里我们先拿到jQuery产生的 XMLHttpRequest对象，为其增加 progress 事件绑定，然后再返回交给ajax使用
                                        xhr: function(){
                                            var xhr = $.ajaxSettings.xhr();
                                            if(onprogress && xhr.upload) {
                                                xhr.upload.addEventListener("progress" , onprogress, false);
                                                return xhr;
                                            }
                                        },
                                        success:function (res) {
                                            if(res.status==1){//成功
                                                wenku_alert("success",res.msg,3000,"/user");
                                            }else{//失败
                                                wenku_alert("danger",res.msg,3000,"");
                                            }
                                        },
                                        error:function (e) {
                                            wenku_alert("danger","未知错误，请刷新页面重试",3000,"");
                                            console.log(e)
                                        }
                                });
                            }
                        });
					}
				});
			}else{
				_this.removeClass("disabled");
			}
		});
	}
    /**
     * 侦查附件上传情况 ,这个方法大概0.05-0.1秒执行一次，返回上传进度
     */
    function onprogress(evt){
        var per=evt.loaded/evt.total*100,val=per.toFixed(2)+"%";
        $(".progress .progress-bar").css({"width":val});
        $(".progress span").text(val);
    }
	
	//文件预览页面
	if(PageId=="wenku-content"){

	    var pages=[];

	    //监听下载
        $('#ModalDownload').on('show.bs.modal', function () {
            // 请求链接其实不应该写死在这里的...
            $.get("/downfree",{id:$("#ModalDownload .btn-submit-download").attr("data-id")},function(ret){
                if(ret.status==1){
                    $('#ModalDownload .wenku-download-tips').text(ret.msg);
                }
            });
        });



        WenkuLazyLoad();//document ready也调用一次
        var timeout;
        $(window).on("scroll",function () {
            clearTimeout(timeout);//避免短时间内重复计算
            timeout=setTimeout(function () {
                WenkuLazyLoad();
            },30);
        });

        $(window).on("resize",function () {
            WenkuLazyLoad();
        });

		//分享按钮
		$("#ModalShare .bdsharebuttonbox a").click(function(){
			$("#ModalShare").modal("hide");
		});
		
		//收藏文件
		$(".wenku-collect").click(function(e){
			e.preventDefault();
			var _this=$(this),_url=_this.attr("href");
			$.get(_url,function(rt){
				if(rt.status==1){
					_this.addClass("disabled");
					wenku_alert("success",rt.msg,3000,"");
				}else{
					wenku_alert("danger",rt.msg,3000,"");
				}
			});
		});

		//文库文件上下页按钮功能实现
        //上一页
        $(".wenku-page-prev").click(function(){
            var prevPage=GetCurrentPage()-1;
            if(prevPage>0){
                var hWindow=$(window).height(),hPage=$(".wenku-page"+prevPage).height();
                if(hPage>hWindow){//文件页面高度与窗口高度做比较
                    ScrollToPage(prevPage);
                }else{
                    //这个不能调用ScrollToPage
                    $('html,body').animate({scrollTop:$(".wenku-page"+prevPage).offset().top+hPage-hWindow}, 200);
                }
            }
        });

        //下一页
        $(".wenku-page-next").click(function(){
            //如果下一页正在加载中，则不再执行下一页请求
            if($(".wenku-page-next").attr("data-loading")==1) return false;
            //设置下一页的状态为正在加载中
            $(".wenku-page-next").attr("data-loading",1);

            var nextPage=GetCurrentPage()+1,//下一页
                nextStart=NextStartPage(),//下一批次页面
                total=GetTotalPage();//总页数
            var limit=nextStart>0?nextStart:total;
            if(nextPage<limit){
                var hWindow=$(window).height(),//窗口高度
                    hPage=$(".wenku-page"+nextPage).height();//下一页的高度
                if(hPage>hWindow){//文件页面高度与窗口高度做比较
                    ScrollToPage(nextPage);
                }else{
                    //这个不能调用ScrollToPage
                    $('html,body').animate({scrollTop:$(".wenku-page"+nextPage).offset().top+hPage-hWindow}, 200);
                }
            }else{
                if(nextStart>0) $(".wenku-viewer-more-btn:first").trigger("click");
                $(".wenku-page-next").trigger("click");
            }
            $(".wenku-page-next").attr("data-loading",0);
        });


        //全屏
        $(document).on("click",".wenku-expend",function () {
            $(this).addClass("wenku-compress").removeClass("wenku-expend");
            $(this).find(".fa-arrows-alt").addClass("fa-compress").removeClass("fa-arrows-alt");
            Scale(12);
            CurrentScale(12);
            $(".wenku-scale-plus").addClass("disabled");
            $(".wenku-scale-minus").removeClass("disabled").attr("data-current",9);
            AdjustViewer();//调整浏览
        });
        //小屏
        $(document).on("click",".wenku-compress",function () {
            $(this).addClass("wenku-expend").removeClass("wenku-compress");
            $(this).find(".fa-compress").addClass("fa-arrows-alt").removeClass("fa-compress");
            Scale(9);
            CurrentScale(9);
            $(".wenku-scale-plus").removeClass("disabled").attr("data-current",12);
            $(".wenku-scale-minus").addClass("disabled");
            AdjustViewer();
        });
        //放大
        $(".wenku-scale-plus").click(function () {
            var cur=CurrentScale()+1;
            if(cur<=12){
                Scale(cur);
                CurrentScale(cur);
                AdjustViewer();
            }
        });
        //缩小
        $(".wenku-scale-minus").click(function () {
            var cur=CurrentScale()-1;
            if(cur>=9){
                Scale(cur);
                CurrentScale(cur);
                AdjustViewer();
            }
        });


        //加载下一批次页面
        $(".wenku-viewer-more-btn").click(function () {
            var viewmore=$(this).parents(".wenku-viewer-more");
            var unreadpages=$(".wenku-unread-pages").text();//未阅读页数
            var svgurl=viewmore.attr("data-svg");//svg图片预览链接
            var previewext=viewmore.attr("data-ext");//图片扩展名
            var startpage=parseInt(viewmore.attr("data-next"));//下一批页面的开始页数
            if(startpage==0) return true;
            var title=$("h1").text();
            var html='',cnt=10,total=GetTotalPage();
            if(unreadpages>10){
                unreadpages=unreadpages-10;
            }else{
                cnt=unreadpages;
                viewmore.addClass("hide");
            }

            var scrollPage=startpage-1;
            if($(window).scrollTop()>$(".wenku-viewer-more").offset().top){
                $('html,body').animate({scrollTop:$(".wenku-viewer-more").offset().top-$(window).height()/2}, 500);
                return
            }

            for(var i=0;i<cnt;i++){
                if(startpage<=total){
                    html+='<img src="/static/Common/img/loading.gif" data-original="'+svgurl+startpage+'.'+previewext+'" class="wenku-lazy wenku-viewer-img wenku-page'+startpage+'" data-page="'+startpage+'" alt="'+title+' 第 '+startpage+' 页">';
                    startpage=startpage+1
                }
            }

            $(".wenku-viewer-more").before(html);//追加页数

            if(viewmore.hasClass("hide")) {
                viewmore.attr("data-next",0);//重置为0，表示没有下一批次需要加载的页面了
            }else{
                viewmore.attr("data-next",startpage);
            }
            $(".wenku-unread-pages").text(unreadpages);
            WenkuLazyLoad();//再调用一次懒加载
        });

        //评论框
        $(".wenku-goto-comment").click(function(){
            $('html,body').animate({scrollTop:$(".wenku-comment").offset().top}, 200);
        });

		//打分
		$("#wenku-content .wenku-score i").hover(function(){
			var _this=$(this),star=_this.attr("data-v");
			$("#wenku-content .wenku-score i").addClass("fa-star-o").removeClass("fa-star");
			for (var i=1;i<=star;i++){
				$("#wenku-content .wenku-score i[data-v="+i+"]").addClass("fa-star").removeClass("fa-star-o");
			}
			var tips="5星好评，文件很给力"
			switch (star){
				case "1":
                    tips="1星差评，文件太差劲了";
					break;
				case "2":
                    tips="2星差评，文件有点差劲";
                    break;
				case "3":
                    tips="3星中评，文件一般般";
                    break;
				case "4":
                    tips="4星好评，文件不错";
                    break;
				case "5":
                    tips="5星好评，文件很给力";
                    break;
			}
			$(".wenku-score-tips").text(tips);
			$("#score").val(star);
		});

		//提交文件评论
		$("form.wenku-comment-form [type=submit]").click(function (e) {
			e.preventDefault();
            var form=$("form.wenku-comment-form"),score=$("#score").val(),action=form.attr("action");
			// var form=$("form.wenku-comment-form"),score=$("#score").val(),comment=form.find("[name=Comment]").val(),answer=form.find("[name=Answer]").val(),action=form.attr("action");
			if (score=="0"){
				wenku_alert("danger","请给文件评分",3000,"");
				return
			}
            // if (comment.length<8 || comment.length>255){
            //     wenku_alert("danger","评论内容，字符个数限8-255个字符",3000,"");
            //     form.find("[name=Comment]").focus();
            //     return
            // }
            // if (answer!=$(".wenku-answer-tips .text-danger").text()){
            //     wenku_alert("danger","请输入正确答案",3000,"");
            //     form.find("[name=Answer]").focus();
            //     return
            // }
			$.post(action,form.serialize(),function (ret) {
				if(ret.status==1){
					wenku_alert("success",ret.msg,3000,"");
                    $("#score").val("0");
                    $(".wenku-score .fa-star").addClass("fa-star-o").removeClass("fa-star");
				}else{
                    wenku_alert("error",ret.msg,3000,"");
				}
            });
        });


		//举报文件
		$(".btn-submit-report").click(function(){
			var reason =$("#ModalReport [name=Reason]:checked").val();
            var did =$("#ModalReport [name=Did]").val();
			$.get("/report",{Did:did,Reason:reason},function (ret) {
				if(ret.status==1){
                    wenku_alert("success",ret.msg,5000,"");
				}else{
					wenku_alert("error",ret.msg,5000,"");
				}
            });
		});

		//收藏文件
        $(".wenku-collect").click(function () {
            //获取收藏夹
            var id =$(this).attr("data-id");
            $.get("/collect/folder",function (ret) {
                var html='<option value="">请选择收藏夹</option>';
                if (ret.data){
                    $.each(ret.data,function () {
                        html+='<option value="'+this.Id+'">'+this.Title+'</option>';
                    });
                }
                $("#ModalCollect [name=Cid]").html(html);
                $("#ModalCollect").modal("show");
            });
        });

        //下载文件
		$(".btn-submit-download").click(function () {
			$.get($(this).attr("data-url"),function (ret) {
				if(ret.status==1){
					$("#ModalDownload").modal("hide");
					location.href=ret.data.url;
				}else{
					wenku_alert("danger",ret.msg,5000,"");
				}
            });
        });

        //跳转去创建收藏夹
        $(".wenku-create-folder").click(function () {
            $("#ModalCollect").modal("hide");
        });

        //收藏文件到收藏夹
        $(".btn-submit-collect").click(function () {
            var did=$("#ModalCollect [name=Did]").val(),cid=$("#ModalCollect [name=Cid] option:selected").val();
            if (cid==""){
                $("#ModalCollect [name=Cid]").focus();
                wenku_alert("error","请选择收藏夹",3000,"");
            }else{
                $.get("/collect",{Did:did,Cid:cid},function (ret) {
                   if (ret.status==1){
                       $("#ModalCollect").modal("hide");
                       $(".wenku-collect").addClass("disabled");
                       $(".wenku-collect span").text("已收藏");
                       wenku_alert("success",ret.msg,3000,"");
                   } else{
                       wenku_alert("error",ret.msg,3000,"");
                   }
                });
            }
        });
		
		//输入字符统计
		var len=255;
        $("form.wenku-comment-form textarea").keyup(function () {
            $(".wenku-comment-num").text(len-$(this).val().length);
        });

	}
	

	//会员中心
	if(PageId=="wenku-user"){
		//获取更多财富记录
		var coinpage=1,coinloading=0;
		$(".wenku-coin-more").click(function (e) {
			e.preventDefault();
			var url=$(this).attr("href");
			if (coinloading==0){
				coinloading=1;
                coinpage+=1;
                var html="";
				$.get(url,{p:coinpage},function (ret) {
					if(ret.data){
						$.each(ret.data,function () {
                            html+='<li class="clearfix help-block">';
                            html+='<div class="col-xs-3">'+parseDate(this.TimeCreate)+'</div>';
                            html+='<div class="col-xs-1">';
                            if(this.Coin>-1){
                                html+= '<span class="text-primary"> + '+this.Coin+'</span>';
							}else{
                                html+='<span class="text-danger"> '+this.Coin+'</span>';
							}
                            html+='</div>';
                            html+='<div class="col-xs-8 wenku-text-ellipsis">'+this.Log+'</div>';
                            html+='</li>';
                        });
						$(".wenku-list-table-body ul").append(html);
					}else{
                        $(".wenku-coin-more").remove();
					}
                });
                coinloading=0;
			}
        });

		//解析文库分类
		var js=$("#wenku-cates").text();
		if(js){
            var cates=eval("("+js+")");

            //var defChanel=$(".wenku-form-upload select[name=Chanel]").attr("data-default");
            var defChanel=$(".wenku-form-upload select[name=Chanel]").val();
            var defPid=$(".wenku-form-upload select[name=Pid]").attr("data-default");
            var defCid=$(".wenku-form-upload select[name=Cid]").attr("data-default");
            //$(".wenku-form-upload select[name=Chanel]").append(options(0,cates));
            //setDefault("Chanel",defChanel);
            $(".wenku-form-upload select[name=Pid]").append(options(defChanel,cates));
            setDefault("Pid",defPid);
            $(".wenku-form-upload select[name=Cid]").append(options(defPid,cates));
            setDefault("Cid",defCid);

            //频道选择
            $(".wenku-form-upload .form-chanel select").change(function(){
                var _this=$(this),pid=_this.val();
                if(pid){
                    $(".form-level-one select").html('<option value="">请选择一级文件分类</option>');
                    $(".form-level-one select").append(options(pid,cates));
                    $(".form-level-two select").html('<option value="">请选择二级文件分类</option>');
                }else{
                    $(".form-level-one select").html('<option value="">请选择一级文件分类</option>');
                    $(".form-level-two select").html('<option value="">请选择二级文件分类</option>');
                }
            });

            //分类选择
            $(".wenku-form-upload .form-level-one select").change(function(){
                var _this=$(this),pid=_this.val();
                $(".form-level-two select").html('<option value="">请选择二级文件分类</option>');
                if(pid){
                    $(".form-level-two select").append(options(pid,cates));
                };
            });

        }


		//更新头像
		$(".wenku-update-avatar").click(function () {
			$(".wenku-change-submit").trigger("click");
        });
		$(".wenku-change-submit").change(function () {
			$(this).parents("form").submit();
        });
		
		//编辑收藏夹
		$(".ModalFolderEditBtn").click(function () {
			var obj=$(this).parents(".wenku-title"),
                title=obj.find("h6").text(),
                desc=obj.find(".help-block").text(),
                id=$(this).attr("data-id"),
                form=$("#ModalFolderEdit form");
			form.find("[name=Id]").val(id),form.find("[name=Title]").val(title),form.find("[name=Description]").val(desc);
			$("#ModalFolderEdit").modal("show");
        });

		console.log($("#wenku-user .wenku-right").height());
        $("#wenku-user .wenku-left .panel-body").css({"min-height":$("#wenku-user .wenku-right").height()-105});

	}

	//cls：success/(error|danger)
	//msg:message
	//timeout:超时刷新和跳转时间
	//url:有url链接的话，跳转url链接
	function wenku_alert(cls,msg,timeout,url){
	    var t= timeout>0?parseInt(timeout):3000;
		if(cls=="error"||cls=="danger"){
			cls="error";
		}else{
			cls="success";
			// position="mid-center";
			close=false;
		}
        $.toast({
		    text: msg, // Text that is to be shown in the toast
		    // heading: 'Note', // Optional heading to be shown on the toast
		    icon: cls, // Type of toast icon
		    showHideTransition: 'slide', // fade, slide or plain
		    allowToastClose: cls=="success"?false:true, // Boolean value true or false
		    hideAfter: t, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
		    stack: 8, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
		    position: "top-center", // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values

		    textAlign: 'left',  // Text alignment i.e. left, right or center
		    loader: true,  // Whether to show loader or not. True by default
		    loaderBg: '#c0f201',  // Background color of the toast loader
		    beforeShow: function () {}, // will be triggered before the toast is shown
		    afterShown: function () {}, // will be triggered after the toat has been shown
		    beforeHide: function () {}, // will be triggered before the toast gets hidden
		    afterHidden: function () {}  // will be triggered after the toast has been hidden
		});

		if(url){
			setTimeout(function(){
				location.href=url
			},t-500);
		}
	}


    $(".wenku-ajax-get").click(function(e){
        e.preventDefault();
        var _this=$(this);
        if(_this.hasClass("disabled")) return false;
        if (_this.hasClass("wenku-confirm")) {
            var confirm_text="您确定要 "+_this.text()+" 吗？";
            if(confirm(confirm_text)){
                _this.addClass("disabled");
                $.get(_this.attr("href"),function(rt){
                    if (rt.status==1) {
                        wenku_alert("succ",rt.msg,3000,location.href);
                    } else{
                        _this.removeClass("disabled")
                        wenku_alert("error",rt.msg,3000,"");
                    }
                });
            }
        } else{
            $.get(_this.attr("href"),function(rt){
                if (rt.status==1) {
                    wenku_alert("succ",rt.msg,3000,location.href);
                } else{
                    _this.removeClass("disabled")
                    wenku_alert("error",rt.msg,3000,"");
                }
            });
        }
    });



    $(".wenku-ajax-form [type=submit]").click(function(e){
        e.preventDefault();
        var _this=$(this),form=$(this).parents("form"),method=form.attr("method"),action=form.attr("action"),data=form.serialize(),_url=form.attr("data-url");
        var require=form.find("[required=required]"),l=require.length;
        // var _this=$(this),form=$(this).parents("form"),method=form.attr("method"),action=form.attr("action"),data=form.serialize(),_url=form.attr("data-url");
        // var require=form.find("[required=required]"),l=require.length;


        var unixtimeStart = Date.parse($(".demo-input-start").val())/1000;
        var unixtimeEnd   = Date.parse($(".demo-input-end").val())/1000;
        if (unixtimeEnd && unixtimeEnd <= unixtimeStart){
                wenku_alert("danger","失效日期必须大于生效日期",3000,"");
                return;
            }

        $.each(require, function() {
            if (!$(this).val()){
                $(this).focus();
                return false;
            }else{
                l--;
            }
        });
        if (!_url || _url==undefined){
            _url=location.href;
        }
        if (l>0) return false;
        _this.addClass("disabled");
        if (method=="post") {
            if (form.attr("enctype")=="multipart/form-data"){
                // var unixtimeStart = Date.parse($(".demo-input-start").val())/1000;
                // var unixtimeEnd   = Date.parse($(".demo-input-end").val())/1000;
                // if (unixtimeEnd && unixtimeEnd <= unixtimeStart){
                //     wenku_alert("danger","失效日期必须大于生效日期",3000,"");
                //     return;
                // }
                // form.attr("name",unixtimeStart);
                // form.attr("name",unixtimeEnd);
                form.attr("target","notarget");
                form.submit();
            }else{
                $.post(action,data,function(rt){
                    if (rt.status==1) {
                        wenku_alert("success",rt.msg,2000,_url);
                    } else{
                        wenku_alert("error",rt.msg,3000,"");
                        _this.removeClass("disabled");
                    }
                });
            }
        } else{
            $.get(action,data,function(rt){
                if (rt.status==1) {
                    wenku_alert("success",rt.msg,2000,_url);
                } else{
                    wenku_alert("error",rt.msg,3000,"");
                    _this.removeClass("disabled");
                }
            });
        }
    });


    //iframe加载后处理
    //TODO:移除和改善
    $("#notarget").load(function(){
        var data = $(window.frames['notarget'].document.body).find("pre").html();
        var obj=eval('(' + data + ')');
        if (obj!=undefined){
            if (obj.status==1) {
                wenku_alert("success",obj.msg,5000,location.pathname+"?t="+new Date());
            } else{
                wenku_alert("danger",obj.msg,2500,"");
            }
        }
    });


    $(".wenku-tooltip").tooltip();

    //文库懒加载
    function WenkuLazyLoad() {
        var imgs=$("#wenku-viewer .wenku-lazy"),hScrollTop=$(window).scrollTop(),hWinow=$(window).height();
        $.each(imgs,function () {
            if(hScrollTop-$(this).offset().top+hWinow>0){
                if($(this).attr("src")!=$(this).attr("data-original")){
                    $(this).attr("src",$(this).attr("data-original")).fadeIn(100);
                    // $(this).removeClass("wenku-lazy");
                }
                $(".wenku-current-page").text($(this).attr("data-page"));
            }
        });
    }

    //获取当前scale
    function CurrentScale(number) {
        if(number){//设置
            return parseInt($(".wenku-viewer").attr("data-scale",number));
        }else{
            return parseInt($(".wenku-viewer").attr("data-scale"));
        }

    }

    //放大缩小
    function Scale(number) {
        //left:col-xs-9 wenku-left wenku-nopadding
        //right:col-xs-3 wenku-right
        //number的值是：9、10、11、12
        if(number==9 || number==10 || number==11 || number==12){
            $(".wenku-main .wenku-left").attr("class","col-xs-"+number+" wenku-left wenku-nopadding")
            var r=12-number;
            $(".wenku-main .wenku-right").attr("class","col-xs-"+r+" wenku-right");
        }
    }

    //滚动到指定页
    function ScrollToPage(page) {
        $('html,body').animate({scrollTop:$(".wenku-page"+page).offset().top}, 200);
    }

    //调整当前页，用于文件预览放大或缩小时
    function AdjustViewer() {
        ScrollToPage(GetCurrentPage());
    }



    //获取当前页
    function GetCurrentPage() {
        return parseInt($(".wenku-current-page").text());
    }
    //获取当前页
    function GetTotalPage() {
        return parseInt($(".wenku-total-page").text());
    }
    //获取下一批次的起始页
    function NextStartPage() {
        return parseInt($(".wenku-viewer-more").attr("data-next"));
    }

    //表单文件上传的分类选项
    //@param        pid         父级id
    //@param        cates       分类
    function options(pid,cates) {
        var chanel=[];
        $.each(cates,function () {
            if (this.Pid==pid){
                chanel.push('<option value="'+this.Id+'">'+this.Title+'</option>');
            }
        });
        return chanel.join(",")
    }

    function setDefault(name,val) {
        $(".wenku-form-upload select[name="+name+"] option[value="+val+"]").attr("selected","selected");
    }

    //将时间戳转成日期，timestamp是时间戳，单位为秒
    function parseDate(timestamp) {
        var t = parseInt(timestamp)*1000
        var tObj =new Date(t);
        return tObj.toLocaleDateString().replace(/\//g, "-") + " " + tObj.toTimeString().substr(0, 8)
    }
    var date = new Date('2013-05-12');
    var time1 = Date.parse(date)/1000;
    console.log(time1);

});


// $.toast({
//     text: "Don't forget to star the repository if you like it.", // Text that is to be shown in the toast
//     heading: 'Note', // Optional heading to be shown on the toast
//     icon: 'success', // Type of toast icon
//     showHideTransition: 'slide', // fade, slide or plain
//     allowToastClose: true, // Boolean value true or false
//     hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
//     stack: 10, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
//     position: 'bottom-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
//
//
//
//     textAlign: 'left',  // Text alignment i.e. left, right or center
//     loader: true,  // Whether to show loader or not. True by default
//     loaderBg: '#c0f201',  // Background color of the toast loader
//     beforeShow: function () {}, // will be triggered before the toast is shown
//     afterShown: function () {}, // will be triggered after the toat has been shown
//     beforeHide: function () {}, // will be triggered before the toast gets hidden
//     afterHidden: function () {}  // will be triggered after the toast has been hidden
// });
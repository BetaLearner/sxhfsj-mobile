var sxhfsj = {
	data : {},
	index : {},
	prod : {},
	dynamic: {}
};

var util = {
	formatIndex : function(index){
		return parseInt(index, 10) + 1;
	},
	msgTpl : '<div id="msg_dlg" class="js_dialog" style="display:none;"><div class="weui-mask"></div><div class="weui-dialog"><div class="weui-dialog__bd"></div><div class="weui-dialog__ft"><a href="javascript:util.closeMsg();" class="btn-ok weui-dialog__btn weui-dialog__btn_primary">好的</a></div></div></div>',
	toastTpl : '<div id="toast" style="opacity: 0; display: none;"><div class="weui-mask_transparent"></div><div class="weui-toast"><i class="weui-icon-success-no-circle weui-icon_toast"></i><p class="weui-toast__content">已完成</p></div></div>',
	showMsg : function(msg){
		var $msgDlg = $('#msg_dlg');
		if($msgDlg.length == 0){
			$('body').append(util.msgTpl);
			$msgDlg = $('#msg_dlg');
		}
		if(msg){
			$msgDlg.find('.weui-dialog__bd').text(msg);
		}
		$msgDlg.show();
	},
	closeMsg : function(){
		var $msgDlg = $('#msg_dlg');
		if($msgDlg.length == 0){
			$('body').append(util.loadingPanel);
			$msgDlg = $('#msg_dlg');
		}
		$msgDlg.hide();
		$msgDlg.find('.weui-dialog__bd').text('');
	},
	toast : function(msg){
		var $toast = $('#toast');
		if($toast.length == 0){
			$('body').append(util.toastTpl);
			$msgDlg = $('#toast');
		}
		if(msg){
			$msgDlg.find('.weui-toast__content').text(msg);
		}
		$msgDlg.show();
		setTimeout(function(){
			$msgDlg.css('opacity', 1);
			setTimeout(function(){
				$msgDlg.css('opacity', 0);
				$msgDlg.hide();

			},1200);
		},10);
		
	},
	date : {
		getDate : function(dateStr){
			if(!dateStr){
				return '';
			}
			return dateStr.split(' ')[0];
		},
		format : function(longTime){
			var date = new Date(longTime);

			var Year= date.getFullYear();//ie火狐下都可以 
			var Month= date.getMonth()+1; 
			var Day = date.getDate(); 
			var Hour = date.getHours(); 
			var Minute = date.getMinutes(); 
			var Second = date.getSeconds(); 

			if (Month < 10 ) { 
				Month = "0" + Month; 
			} 
			if (Day < 10 ) { 
				Day = "0" + Day; 
			}
			if (Hour < 10 ) { 
				Hour = "0" + Hour; 
			} 
			if (Minute < 10 ) { 
				Minute = "0" + Minute; 
			} 
			if (Second < 10 ) { 
				Second = "0" + Second; 
			}	

			var CurrentDate = Year + '-' + Month + '-' + Day + ' ' + Hour + ':' + Minute + ':' + Second;

			return CurrentDate;
		}
	},
	funTransitionHeight : function(element, time) { // time, 数值，可缺省
		if (typeof window.getComputedStyle == "undefined") return;
		
		var height = window.getComputedStyle(element).height;
		element.style.height = "auto";
		var targetHeight = window.getComputedStyle(element).height;
		element.style.height = height;
		setTimeout(function() {
				if (time) element.style.transition = "height "+ time +"ms";
				element.style.height = targetHeight;
		}, 15);
	}
};

juicer.register('formatIndex', util.formatIndex);


Math.easeout = function (A, B, rate, callback) {
    if (A == B || typeof A != 'number') {
        return;    
    }
    B = B || 0;
    rate = rate || 2;
    
    var step = function () {
        A = A + (B - A) / rate;
        if(Math.abs(A-B) < 1){
            callback(B, true);
            return;
        }
        callback(A, false);
        requestAnimationFrame(step);    
    };
    step();
};
/** menu event */
$(document).ready(function() {
	var $menu = $('.menu-panel');
	$menu.attr('data-height', $('.main').height());
	$('#wrapper').on('click', '.menu', function(){
		var $this = $(this);
		var $menu = $('.menu-panel');
		if($this.hasClass('on')){
			$this.removeClass('on');
			$menu.removeClass('on');
			$menu.height(0);
			return;
		}else{
			$this.addClass('on');
			$menu.addClass('on');
			$menu.height(parseInt($menu.attr('data-height')));
		}
	});
	$('#wrapper').on('click', '.back-bar', function(){
		var doc = $('.main')[0];
		Math.easeout(doc.scrollTop, 0 , 6, function (value) {
            doc.scrollTop = value;
        });
	});


	$('#wrapper').on('click', '.menu-panel li', function(){
		var $this = $(this);
		$this.addClass('active');
		setTimeout(function(){
			window.location.href = $this.attr('data-href');
		}, 100);
	});
	
});
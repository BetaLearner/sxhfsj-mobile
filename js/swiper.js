var swiper = {
	$box : null,
	$items : null,
	currIndex : 0,
	length : 1,
	init : function($box){
		swiper.$box = $box;
		var $items = swiper.$box.find('.item');
		swiper.$items = $items;
		swiper.length = swiper.$items.length;

		$items.each(function(index){
			var $item = $(this);
			// $item.css('transform', 'translateX(' + index * 100 + '%)');
			if(index == 0){
				$item.addClass('curr');
			}
		});
		if(swiper.length > 1){
			swiper.initEvent();	
		}
	},
	initEvent : function(){
		var startPos = {x:0,y:0};
		var endPos = {x:0,y:0};
		var isScrolling = 0;
		swiper.$box.on('touchstart', function(event){
			event.preventDefault();
			var touch = event.targetTouches[0];	 //touches数组对象获得屏幕上所有的touch，取第一个touch
			startPos = {x:touch.pageX,y:touch.pageY,time:+new Date};	//取第一个touch的坐标值
			isScrolling = 0; //这个参数判断是垂直滚动还是水平滚动
		});

		swiper.$box.on('touchmove', function(event){
			var touch = event.targetTouches[0];
			endPos = {x:touch.pageX - startPos.x,y:touch.pageY - startPos.y};
			isScrolling = Math.abs(endPos.x) < Math.abs(endPos.y) ? 1:0;	//isScrolling为1时，表示纵向滑动，0为横向滑动
		});

		swiper.$box.on('touchend', function(event){
			if(isScrolling === 0){	//当为横向滚动时
			if(endPos.x > 50){//move right
				swiper.back();
			}
			if(endPos.x < -50){//move right
				swiper.forward();
			}
			}
		});
	},
	whichTransitionEvent : function(){
		var t;
		var el = document.createElement('fakeelement');
		var transitions = {
			'transition':'transitionend',
			'OTransition':'oTransitionEnd',
			'MozTransition':'transitionend',
			'WebkitTransition':'webkitTransitionEnd',
			'MsTransition':'msTransitionEnd'
		}
		for(t in transitions){
			if( el.style[t] !== undefined ){
				return transitions[t];
			}
		}
	},
	forward : function(){
		var $curr = swiper.$box.find('.curr');
		var $next = $curr.next('.item');
		if($next.length == 0){
			var $first = swiper.$box.find('li').first();
			var $nextCopy = $first.clone();
			$nextCopy.attr('class', 'item');
			$curr.after($nextCopy);
			$first.remove();
			$next = $curr.next('.item');
		}
		$next.addClass('next');
		setTimeout(function(){
			$curr.removeClass('curr').addClass('prev');
			$next.removeClass('next').addClass('curr');	
		}, 10);
	},
	back : function(){
		var $curr = swiper.$box.find('.curr');
		var $prev = $curr.prev('.item');
		if($prev.length == 0){
			var $last = swiper.$box.find('li').last();
			var $prevCopy = $last.clone();
			$prevCopy.attr('class', 'item');
			$curr.before($prevCopy);
			$last.remove();
			$prev = $curr.prev('.item');
		}
		$prev.addClass('prev');
		setTimeout(function(){
			$curr.removeClass('curr').addClass('next');
			$prev.removeClass('prev').addClass('curr');	
		}, 10);
	}
};
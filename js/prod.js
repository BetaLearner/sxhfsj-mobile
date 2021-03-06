(function(P){
	var _this = null;
	var offsetTop = 0;
	_this = P.prod = {
		tpl : {
			prodNavTpl : null,
			prodTpl : null
		},
		data : {},
		pageSize : 6,
		prodList : [],
		currProdIndex : 0,
		currListIndex : 0,
		init : function(options){
			_this.tpl.prodNavTpl = juicer($('#prod-nav-tpl').html());
			_this.tpl.prodTpl = juicer($('#prod-tpl').html());
			_this.initData();
			_this.initEvent();//基本事件
			_this.loadProdNav();
		},
		initData : function(){
			var prodData = P.data.prod;
			for(var key in prodData){
				_this.prodList.push(prodData[key]);
			}
			_this.currProdIndex = 0;
			_this.currListIndex = 0;
		},
		initEvent : function(){
			$('#wrapper').on('touchstart', function(event){
				// event.preventDefault();
			});
			$('.prod-nav').on('tap', 'li', _this.loadProd);
			$('#img_close').on('tap', _this.closeImgPlayer);
			_this.initProdBoxEvent();
		},
		initProdBoxEvent : function(){
			var newsPanel = document.getElementById('prod_list');
		    var startPos = {x:0,y:0};
		    var endPos = {x:0,y:0};
		    var isScrolling = 0;
		    var offset = offsetTop;
		    newsPanel.addEventListener('touchstart', function(event){
		      // event.preventDefault();
		      var touch = event.targetTouches[0];  //touches数组对象获得屏幕上所有的touch，取第一个touch
		      startPos = {x:touch.pageX,y:touch.pageY,time:new Date().getTime()};  //取第一个touch的坐标值
		      isScrolling = 0; //这个参数判断是垂直滚动还是水平滚动
		    });

		    newsPanel.addEventListener('touchmove', function(event){
		      var touch = event.targetTouches[0];
		      endPos = {x:touch.pageX - startPos.x,y:touch.pageY - startPos.y};
		      isScrolling = Math.abs(endPos.x) < Math.abs(endPos.y) ? 1:0;  //isScrolling为1时，表示纵向滑动，0为横向滑动
		      offset = offsetTop + endPos.y;
		      $('#prod_list').css('transition', 'initial').css('transform', 'translateY(' + offset + 'px)');
		    });

		    newsPanel.addEventListener('touchend', function(event){
		    	var prevTrigger = $('.loading-before').height();
		      	var nextTrigger = $('#prod_box').height() - $('.loading-after').height() - $('#prod_list').height();
		      	if(offset > prevTrigger){//move top
		        	$('.loading-before').addClass('show');
		      	}

		      	if(offset < nextTrigger){//move top
		        	$('.loading-after').addClass('show');
		      	}

		      	endPos.time = new Date().getTime();
		      	offsetTop = offset;
		      	if(isScrolling === 1){  //当为竖直滚动时
		        	if(offsetTop > prevTrigger){//向上滑动 回弹
		        		offsetTop = prevTrigger;
			          	$('#prod_list').css('transition', 'transform 0.4s').css('transform', 'translateY(' + offsetTop + 'px)');
			          	prev();
			        }
			        if(offsetTop < nextTrigger){
			        	$('#prod_list').css('transition', 'transform 0.4s').css('transform', 'translateY(' + nextTrigger + 'px)');
			        	offsetTop = nextTrigger;
			        	next();
			        }
		      	}
		    });

		    var prev = function(){
		      setTimeout(function(){
		        $('.loading-before').removeClass('show');
		        $('#prod_list').css('transition', 'transform 0.4s').css('transform', 'translateY(0px)');
		        offsetTop = 0;
		        if(_this.currProdIndex > 0){
		        	_this.currProdIndex--;
		        	var prodData = _this.prodList[_this.currProdIndex];
					_this.loadProd({prodId : prodData.id});
		        }
		      }, 1000);
		    };
		    var next = function(){
		      setTimeout(function(){
		        $('.loading-after').removeClass('show');
		        var nextTrigger = $('#prod_box').height() - $('.loading-after').height() - $('#prod_list').height();
				var prodData = _this.prodList[_this.currProdIndex];
				_this.appendProd();
		      }, 1000);
		    };
		},
		loadProdNav : function(){
			var prodData = P.data.prod;
			var list = [];
			for(var key in prodData){
				list.push(prodData[key]);
			}
			var html = _this.tpl.prodNavTpl.render({list: list});
			$('.prod-nav').html(html);

			var $first = $('.prod-nav').find('li').first();
			$first.addClass('active');
			var prodId = $first.attr('data-id');
			_this.loadProd({prodId : prodId });
		},
		loadProd : function(params){
			$('#prod_list').css('transition', 'initial').css('transform', 'translateY(0px)');
			offsetTop = 0;

			var $this = $(this);
			var prodId = $this.attr('data-id');
			if(params && params.prodId){
				prodId = params.prodId;
			}else{
				$this.addClass('active').siblings('li').removeClass('active');
				_this.currProdIndex = $this.attr('data-index');
			}
			_this.currListIndex=0;
			var prodData = _this.prodList[_this.currProdIndex];
			var list = prodData.list;
			var listSize = list.length;
			var start = _this.currListIndex * _this.pageSize;
			var end = (_this.currListIndex + 1) * _this.pageSize;
			var title = '';
			var $panel = $('#prod_list');
			if(_this.currListIndex == 0){
				$('.prod-nav li').eq(_this.currProdIndex).addClass('active').siblings('li').removeClass('active');
				$panel.html('');
			}

			list = list.slice(start, end);
			var html = _this.tpl.prodTpl.render({list : list});
			html = title + html;
			$panel.html(html);
			_this.initGallery();
			setTimeout(function(){
				_this.loading = false;
			}, 500);
		},
		appendProd : function(){
			if(_this.currProdIndex >= _this.prodList.length){
				return;
			}

			_this.currListIndex++;
			var prodData = _this.prodList[_this.currProdIndex];
			var list = prodData.list;
			var listSize = list.length;
			var start = _this.currListIndex * _this.pageSize;
			var end = (_this.currListIndex + 1) * _this.pageSize;
			var title = '';
			if(_this.currListIndex == 0){
				$('.prod-nav li').eq(_this.currProdIndex).addClass('active').siblings('li').removeClass('active');
			}

			if (listSize < start) {
				_this.currProdIndex++;
				if(_this.currProdIndex >= _this.prodList.length){
					_this.currProdIndex--;
					$('#prod_list').css('transition', 'transform 0.4s').css('transform', 'translateY(0px)');
					return;
				}
				var prodData = _this.prodList[_this.currProdIndex];
				return _this.loadProd({prodId : prodData.id});
			}

			if(listSize < end){
				end = listSize;
				// _this.currProdIndex++;
				// _this.currListIndex=0;
			}



			list = list.slice(start, end);
			var html = _this.tpl.prodTpl.render({list : list});
			$('#prod_list').append(title);
			$('#prod_list').append(html);
			_this.initGallery();
			_this.loading = false;
		},
		closeImgPlayer : function(){
			_this.pswp.close();
		},
		initPSWPItems : function(){
			var width = screen.width,height = screen.height;
			var $imgs = $('body').find('.prod-box li img');
			$imgs.addClass('demo-gallery');//图集预览

			// _this.data.pwspItems = [];
			_this.data.pwspItemMap = {};
			_this.data.imgArr = [];
			$imgs.each(function(index){
				var _img = this;
				var $img = $(this);
				var msrc = $img.attr('src');
				var src  = $img.attr('data-bigpic');
				$img.attr('data-index', index);
				$img.attr('id', 'img_index_' + index);
				$img.attr('data-msrc', msrc);
				var preImage = new Image();
				preImage.src = src;
				preImage.onload = function(){
					var image = this;
					if(image.width > 0){
						width = image.width;
						height = image.height;
					}
					var wscale = screen.width/width;
					var scale = 1;
					if(wscale > scale){
						scale = wscale;
					}

					width = parseInt(width * scale, 10);
					height = parseInt(height * scale, 10);
					
					item = {
						src: src,
						msrc : src,
						orgSrc : msrc,
						w: parseInt(width, 10),
						h: parseInt(height, 10)
					};

					item.m = {
				  		src: src,
				  		orgSrc : msrc,
						w: parseInt(width, 10),
						h: parseInt(height, 10)
					};
				  	// original image
				  	item.o = {
				  		src: src,
				  		orgSrc : msrc,
						w: parseInt(width, 10),
						h: parseInt(height, 10)
				  	};
					item.el = _img; // save link to element for getThumbBoundsFn
					_this.data.pwspItemMap[index] = item;
				};
			});
		},
		initGallery : function(){
			_this.initPSWPItems();
			var initPhotoSwipeFromDOM = function(gallerySelector) {
				var parseThumbnailElements = function(el) {
					var thumbElements = el.childNodes;
				    var items = [];
				    var width = screen.width,height = screen.height;
					var $imgs = $('body').find('.prod-box li img');
					for(var key in _this.data.pwspItemMap){
						items.push(_this.data.pwspItemMap[key]);
					}
					if($imgs.length == items.length && items.length > 0){//已初始化直接使用
						return items;
					}

					$imgs.each(function(index){
						var $img = $(this);
						var image = new Image();
						var msrc = $img.attr('src');
						var src  = $img.attr('data-bigpic');
						image.src = src;

						if(image.width > 0){
							width = image.width;
							height = image.height;
						}
						var wscale = screen.width/width;
						var scale = 1;
						if(wscale > scale){
							scale = wscale;
						}

						width = parseInt(width * scale, 10);
						height = parseInt(height * scale, 10);
						
						item = {
							src: src,
							msrc: src ,
							orgSrc : msrc,
							w: parseInt(width, 10),
							h: parseInt(height, 10)
						};

						item.m = {
					  		src: src,
					  		orgSrc : msrc,
							w: parseInt(width, 10),
							h: parseInt(height, 10)
						};
					  	// original image
					  	item.o = {
					  		src: src,
					  		orgSrc : msrc,
							w: parseInt(width, 10),
							h: parseInt(height, 10)
					  	};

						item.el = this; // save link to element for getThumbBoundsFn
						items.push(item);
					});
					return items;
				};

				// find nearest parent element
				var closest = function closest(el, fn) {
				    return el && ( fn(el) ? el : closest(el.parentNode, fn) );
				};

				var onThumbnailsClick = function(e) {
				    e = e || window.event;
				    e.preventDefault ? e.preventDefault() : e.returnValue = false;

			     	var eTarget = e.target || e.srcElement;

				    var clickedListItem = closest(eTarget, function(el) {
				        return el.tagName === 'LI' || el.tagName === 'li';
				    });

				    if(!clickedListItem) {
				        return;
				    }

				    var clickedGallery = clickedListItem;//.parentNode;

				    var index = $(this).attr('data-index');
				    if(index >= 0) {
				    	$('body').css('overflow','hidden');
				        return openPhotoSwipe( index, clickedGallery );
				    }
				    return false;
				};

				var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
				    var pswpElement = document.querySelectorAll('.pswp')[0],
				        gallery,
				        options,
				        items;
					items = parseThumbnailElements(galleryElement);
					
				    // define options (if needed)
				    options = {
				    	history :false,
				        galleryUID: galleryElement.getAttribute('data-pswp-uid'),
				        getThumbBoundsFn: function(index) {
				            var thumbnail = items[index].el;
							var pageYScroll = window.pageYOffset || document.documentElement.scrollTop, rect = thumbnail.getBoundingClientRect();
				            return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
				        },
				        addCaptionHTMLFn: function(item, captionEl, isFake) {
							if(!item.title) {
								captionEl.children[0].innerText = '';
								return false;
							}
							captionEl.children[0].innerHTML = item.title +  '<br/><small>Photo: ' + item.author + '</small>';
							return true;
				        }
				    };

				    options.index = parseInt(index, 10);
					if( isNaN(options.index) ) {
						return;
					}
					if(disableAnimation) {
						options.showAnimationDuration = 0;
					}

					// options.tapToToggleControls = false;
					// options.pinchToClose = true;
					// options.tapToClose = true;
					// options.closeOnVerticalDrag = false;
					// options.zoomEl = false;

				    options.tapToToggleControls = false;
				    options.pinchToClose = false;
				    options.tapToClose = true;
				    
				    


				    // Pass data to PhotoSwipe and initialize it
				    _this.pswp = gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);

				    _this.pswp.listen('close', function() {
				    	var $img = $('#img_index_' + _this.pswp.getCurrentIndex());
				    	$('body').css('overflow','auto');
				    	if($img.offset().top < document.body.scrollTop || ($img.offset().top > (document.body.scrollTop + screen.height )) ){
				    		document.body.scrollTop = $img.offset().top;	
				    	}
				    });

				    // see: http://photoswipe.com/documentation/responsive-images.html
					var realViewportWidth,
					    useLargeImages = true,
					    firstResize = true,
					    imageSrcWillChange;

					gallery.listen('beforeResize', function() {
						var dpiRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;
						dpiRatio = Math.min(dpiRatio, 2.5);
					    realViewportWidth = gallery.viewportSize.x * dpiRatio;

					    if(realViewportWidth >= 1200 || (!gallery.likelyTouchDevice && realViewportWidth > 800) || screen.width > 1200 ) {
					    	if(!useLargeImages) {
					    		useLargeImages = true;
					        	imageSrcWillChange = true;
					    	}
					        
					    } else {
					    	if(useLargeImages) {
					    		useLargeImages = false;
					        	imageSrcWillChange = true;
					    	}
					    }

					    if(imageSrcWillChange && !firstResize) {
					        gallery.invalidateCurrItems();
					    }

					    if(firstResize) {
					        firstResize = false;
					    }

					    imageSrcWillChange = false;
					});

					gallery.listen('gettingData', function(index, item) {
					    if( useLargeImages ) {
					        item.src = item.o.src;
					        item.w = item.o.w;
					        item.h = item.o.h;
					    } else {
					        item.src = item.m.src;
					        item.w = item.m.w;
					        item.h = item.m.h;
					    }

					    if (item.w < 1 || item.h < 1) { 
						    var img = new Image(); 
						    img.onload = function() { 
						    	item.w = this.width; 
						    	item.h = this.height; 
						       	gallery.invalidateCurrItems(); 
						       	gallery.updateSize(true); 
						    }
							img.src = item.src; 
						}
					});

				    gallery.init();
				};

				// select all gallery elements
				var galleryElements = document.querySelectorAll( gallerySelector );
				for(var i = 0, l = galleryElements.length; i < l; i++) {
					galleryElements[i].setAttribute('data-pswp-uid', i+1);
					galleryElements[i].onclick = onThumbnailsClick;
				}
			};
			initPhotoSwipeFromDOM('.demo-gallery');
		}
  	};
}(sxhfsj));
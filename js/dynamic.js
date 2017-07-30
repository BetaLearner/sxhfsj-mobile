(function(P){
	var _this = null;
	_this = P.dynamic = {
		tpl : {
			dynamicTpl : null,
			prodTpl : null
		},
		data : {},
		init : function(options){
			_this.tpl.dynamicListTpl = juicer($('#dynamic-list-tpl').html());
			_this.tpl.dynamicTpl = juicer($('#dynamic-tpl').html());
			_this.tpl.prodTpl = juicer($('#prod-tpl').html());
			_this.initEvent();//基本事件
			_this.loadDynamic();
		},
		initEvent : function(){
			$('#img_close').unbind('click');
			$('#img_close').click(function(){
				_this.closeImgPlayer();
			});

			$('#wrapper').on('click', '.dynamic-name', _this.showDetail);
		},
		loadDynamic : function(){
			var data = {
				list : P.data.dynamic
			};
			var html = _this.tpl.dynamicListTpl.render(data);
			$('#dynamic_list').html(html);
			var $imgs = $('body').find('.roll-box li img');
			_this.initGallery($imgs);
			// _this.initRoll();
		},
		showDetail : function(){
			var $this = $(this);
			var index = $this.attr('data-index');
			var dynamic = P.data.dynamic[index];
			var html = _this.tpl.dynamicTpl.render(dynamic);
			$('#detail_panel').html(html);
			$('#list_panel').hide();
			$('#detail_panel').show();
			var $imgs = $('body').find('.prod-box li img');
			_this.initGallery($imgs);
		},
		closeImgPlayer : function(){
			_this.pswp.close();
		},
		initPSWPItems : function($imgs){
			var width = screen.width,height = screen.height;
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
		initGallery : function($imgs){
			_this.initPSWPItems($imgs);
			var initPhotoSwipeFromDOM = function(gallerySelector) {
				var parseThumbnailElements = function(el) {
					var thumbElements = el.childNodes;
				    var items = [];
				    var width = screen.width,height = screen.height;
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
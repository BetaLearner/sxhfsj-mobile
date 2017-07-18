fis.config.set('modules.postpackager', 'simple');
fis.config.set('settings.spriter.csssprites.margin', 20);
fis.config.set('roadmap.path', [{
    reg: '**.css',
    useSprite: true,
    useStandard : false
}]);


fis.config.merge({
    roadmap : {
        path : [
            {
                reg : /\/css\/(.*\.css)/i,
                release : '/css/$1'
            },
            {
                reg : /\/js\/(.*\.js)/i,
                release : '/js/$1'
            },
            {
                reg : /\/svg\/(.*\.svg)/i,
                release : '/svg/$1'
            },
            {
                reg : /\/tff\/(.*\.woff)/i,
                release : '/tff/$1'
            },
            {  
                reg : /\/img\/(.*\.((jpg)|(png)|(gif)|(ico)))/i,
                release : '/img/$1'
            },
            {
                reg : /\/page\//i,
                useStandard : true
            },
            {
                reg : '**',
                useStandard : false,
                useOptimizer : false,
            }
        ]
    },
    deploy : {
        youngS : [
            {
                receiver : 'http://jnly.me/rec/receiver',
                from : '/',
                to : '/young/sxhfsj-mobile',
                subOnly : true,
                replace : {
                    from : 'http://10.99.13.32:9000/mcp/sxhfsj-mobile',
                    to : 'http://jnly.me/sxhfsj'
                }
            }
        ],
       
    }
});
export default (() => {
    window.gconfig = {};
    +(function (global) {
        global.mockPath = 'http://localhost:1111';
        global.host = 'http://192.168.3.220';
        // 本地开发打开的路径以及端口
        global.linkUrl = 'http://www.xiaoda.ai/corpus-label';
        if (process.env.NODE_ENV === 'production') {
            global.linkUrl = 'http://www.xiaoda.ai/corpus-label';
        }
        // 系统一二级菜单
        global.nav = [
            {
                id: 10000001,
                name: 'agent列表',
                icon: 'book',
                url: '',
                children: [
                    {
                        id: 10000101, name: 'agent列表', url: 'agent', icon: 'user',
                    }
                ],
            },
            {
                id: 100000002,
                name: '语料标注',
                icon: 'calculator',
                url: '',
                children: [
                    {
                        id: 10000201, name: '语料标注', url: 'chat', icon: 'book',
                    },
                ],
            },
        ];
    }(window.gconfig));
})()

export const prefix = global.gconfig.linkUrl;
export const mockUrl = global.gconfig.mockPath;
export const host = global.gconfig.host;
export const suffix = '.json';
export const timeout = 6000;
export const useMock = false;

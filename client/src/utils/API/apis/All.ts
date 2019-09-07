export const HOST = ['http://localhost:5001/api', 'http://api.jokingzhang.com/demo-library/api'];

export const API = {
    home: {
        getList: '/home',
    },
    book: {
        create: '/book/create',
        delete: '/book/:id/delete',
        update: '/book/:id/update',
        detail: '/book/:id',
        list: '/books',
    },
    author: {
        create: '/author/create',
        delete: '/author/:id/delete',
        update: '/author/:id/update',
        detail: '/author/:id',
        list: '/authors',
    },
    genre: {
        create: '/genre/create',
        delete: '/genre/:id/delete',
        update: '/genre/:id/update',
        detail: '/genre/:id',
        list: '/genres',
    },
    bookinstance: {
        create: '/bookinstance/create',
        delete: '/bookinstance/:id/delete',
        update: '/bookinstance/:id/update',
        detail: '/bookinstance/:id',
        list: '/bookinstances',
    },
};

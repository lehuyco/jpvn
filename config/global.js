global.__host =
    process.env.NODE_ENV === 'production'
        ? 'https://luathungviet.vn'
        : 'http://lvh.me:3114'
global.SENDGRID_API_KEY =
    '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'
global.FACEBOOK_APP_ID = '493500264578538'
global.FACEBOOK_APP_SECRET = '447020a901fb0c07827e67c25865a257'
global.FACEBOOK_CALLBACK_URL = __host + '/auth/facebook/callback'
global.GOOGLE_CALLBACK_URL = __host + '/auth/google/callback'
global.GOOGLE_CONSUMER_KEY =
    '510959978904-nmlg3shppct23g8ngo85jkplsqpo5o9j.apps.googleusercontent.com'
global.GOOGLE_CONSUMER_SECRET = 'u_WKEIB6PRgTtkVfvIwqMt7X'

global.COMPANY_EMAIL = 'lienhe@luathungviet.vn'
global.COMPANY_PHONE = '+84 945 133 335'
global.USER_ROLES = { admin: 'Admin', mod: 'Quản lý', editor: 'Viết bài' }
global.USER_ROLE_COLORS = {
    admin: 'danger',
    mod: 'warning',
    editor: 'info',
}
global.POST_STATUSES = {
    draft: 'Bản nháp',
    request: 'Đợi xuất bản',
    published: 'Xuất bản',
    needEdit: 'Yêu cầu chỉnh sửa',
    archived: 'Lưu trữ',
}
global.POST_STATUS_COLORS = {
    draft: 'secondary',
    request: 'warning',
    published: 'success',
    needEdit: 'info',
    archived: 'dark',
}
global.SENDER_MAIL = "hi@lehuy.co"
global.SENDER_PASSWORD = "cnfpdsfasolrsdrc"
global.RECEIVER_MAIL = "lienhe@luathungviet.vn"
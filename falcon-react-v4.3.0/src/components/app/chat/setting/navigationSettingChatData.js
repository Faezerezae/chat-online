export const navigationSettingChatData = {
    label: 'Setting',
    children: [
        {
            name: 'Setting',
            active: true,
            icon: 'chart-pie',
            children: [
                {
                    name: 'Widget Settings',
                    to: 'chat/setting/',
                    exact: true,
                    icon: 'chart-pie',
                    active: true
                },
                {
                    name: 'Ready Answer',
                    to: 'chat/setting/ready-answer',
                    icon: 'chart-pie',
                    active: true
                },
                {
                    name: 'Warning Notification',
                    to: 'chat/setting/warning-notification',
                    icon: 'chart-pie',
                    active: true
                },
                {
                    name: 'Offline Status',
                    to: 'chat/setting/offline-status',
                    icon: 'chart-pie',
                    active: true
                },
                {
                    name: 'Hours of work',
                    to: 'chat/setting/Hours-of-work',
                    icon: 'chart-pie',
                    active: true
                },
                {
                    name: 'Before starting the conversation',
                    to: 'chat/setting/before-starting-the-conversation',
                    icon: 'chart-pie',
                    active: true
                },
                {
                    name: 'Delay in response',
                    to: 'chat/setting/delay-in-response',
                    icon: 'chart-pie',
                    active: true
                },
                {
                    name: 'Questions and answers',
                    to: 'chat/setting/questions-and-answers',
                    icon: 'chart-pie',
                    active: true
                },
                {
                    name: 'Rating the operator',
                    to: 'chat/setting/rating-the-operator',
                    icon: 'chart-pie',
                    active: true
                },
                {
                    name: 'Text being typed by the recipient',
                    to: 'chat/setting/text-being-typed-by-the-recipient',
                    icon: 'chart-pie',
                    active: true
                },
                {
                    name: 'Inactive pages',
                    to: 'chat/setting/inactive-pages',
                    icon: 'chart-pie',
                    active: true
                },
                {
                    name: 'Active pages',
                    to: 'chat/setting/active-pages',
                    icon: 'chart-pie',
                    active: true
                },
                {
                    name: 'Assign operator to page',
                    to: 'chat/setting/assign-operator-to-page',
                    icon: 'chart-pie',
                    active: true
                },
                {
                    name: 'Communication with API',
                    to: 'chat/setting/communication-with-API',
                    icon: 'chart-pie',
                    active: true
                },
                {
                    name: 'Connect to Telegram',
                    to: 'chat/setting/connect-to-Telegram',
                    icon: 'chart-pie',
                    active: true
                }
            ]
        }
    ]
};

export default [navigationSettingChatData];

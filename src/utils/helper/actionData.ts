export const actionData: any[] = [
    {
        id: 1,
        title: 'Motion',
        actions: [
            {
                id: 1,
                description: 'Move X by 50',
                type: 'moveX',
                value: 50
            },
            {
                id: 2,
                description: 'Move Y by 50',
                type: 'moveY',
                value: 50
            },
            {
                id: 3,
                description: 'Rotate 360',
                type: 'rotate',
                value: 360
            },
            {
                id: 4,
                description: 'Go to random position',
                type: 'random'
            },
            {
                id: 5,
                description: 'Go to position',
                type: 'goTo',
                value: { x: -50, y: -100 }
            },
        ]
    },
    {
        id: 2,
        title: 'Looks',
        actions: [
            {
                id: 6,
                description: 'Say Hello',
                type: 'sayHello',
            },
            {
                id: 7,
                description: 'Say Hello for 1 seconds',
                type: 'sayHelloFor1Sec',
            }
        ]
    },
    {
        id: 3,
        title: 'Control',
        actions: [
            {
                id: 8,
                description: 'Repeat',
                type: 'repeat',
            }
        ]
    },
    {
        id: 4,
        title: 'Events',
        actions: [
            {
                id: 9,
                description: 'Increase size',
                type: 'increaseSize',
            },
            {
                id: 10,
                description: 'Decrease size',
                type: 'decreaseSize',
            }
        ]
    }
]

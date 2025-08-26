export const parseMediaMap = (url: string, isCover: boolean) => {
    return {
        [Math.random().toString(36).substring(2, 9)]: {
            type: 0,
            src: url,
            isCover
        }
    };
};
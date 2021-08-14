export const increment = (value = 1) => {
    return {
        type: 'INCREMENT',
        value
    }
}

export const decrement = (value = 1) => {
    return {
        type: 'DECREMENT',
        value
    }
}
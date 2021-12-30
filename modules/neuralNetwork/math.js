/**
 * Sigmoid function
 * @link https://en.wikipedia.org/wiki/Sigmoid_function
 * 
 * @param {Number} x 
 * @returns {Number} A value between 0 and 1
 */
export function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

/** Sigmoid derivative  
 * 
 * @param {Number} y The result of a sigmoid
 * @return {Number} 
 */
export function dsigmoid(y) {
    return y * (1 - y);
}
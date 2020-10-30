let result = '';
const SymbolToFill = {
    Letter: Symbol('x')
}

let globalMatrix = '';

export function buildCanvas(matrix, data) {
    let error = '';
    globalMatrix = matrix
    const sizeMatrix = data[0].slice(2);

    const [width, height] = sizeMatrix.split(' ');

    if (!checkValues(width,height)) return [null, null, 'Size of canvas is not correct!'];

    createMatrix(width, height);

    result += drawBorders() + '\n';

    for (let i = 1; i < 3; ++i) {
        const [x1, y1, x2, y2] = data[i].slice(2).split(' ');
        if (!checkValues(x1, y1, x2, y2) || !checkCoordinates(width, height,x1, y1, x2, y2))
            return [null, null, 'Line coordinates are not correct!'];
        result += drawLines(x1, y1, x2, y2) + '\n';
    }

    const [x1, y1, x2, y2] = data[3].slice(2).split(' ');

    if (!checkValues(x1, y1, x2, y2) || !checkCoordinates(width, height,x1, y1, x2, y2))
        return [null, null, 'Rectangle coordinates are not correct!'];
    result += drawRectangle(x1, y1, x2, y2) + '\n'

    let [x, y, color] = data[4].slice(2).split(' ');
    x = Number(x); y = Number(y);

    if (!checkValues(x,y) || !checkCoordinates(width, height, x, y)) {
        return [null, null, 'Fill coordinates are not correct!'];
    }
    result += fill(x, y, color, width, height) + '\n';

    const canvas = drawBorders();

    return [result, canvas, error];

}

const checkValues = (...data) => data.every(num => Number(num) && num >= 0) && data.length;

const createMatrix = (width, height) => {
    for (let i = 0; i < height; ++i) {
        globalMatrix[i] = [];
        for (let j = 0; j < width; ++j) {
            globalMatrix[i][j] = Symbol(' ');
        }
    }
}

const symbolToString = (symbol) => {
    const [, match] = symbol.toString().match(/^Symbol\(([\w ]+)\)$/);
    return match;
}

const createCoordinates = (a,b) => [Math.min(a,b), Math.max(a,b)];

const createSymbol = (col, row, value) => globalMatrix[row - 1][col - 1] = value

const drawBorders = () => {
    const [topLine] = globalMatrix;
    const borderLine = `-${topLine.map(() => '-').join('')}-`;

    const body = globalMatrix.reduce(
        (str, row) => `${str}|${row.map(symbolToString).join('')}|\n`,
        ''
    );

    return `${borderLine}\n${body}${borderLine}`;
}

const drawLines = (x1, y1, x2, y2) => {
    const isVerticalLine = x1 === x2;
    const isHorizontalLine = y1 === y2;

    if (isVerticalLine) {
        let [start, end] = createCoordinates(y1, y2);

        for (let i = start; i <= end; ++i) {
            createSymbol(x1, i, SymbolToFill.Letter);
        }
    }

    if (isHorizontalLine) {
        let [start, end] = createCoordinates(x1, x2);

        for (let i = start; i <= end; ++i) {
            createSymbol(i, y1, SymbolToFill.Letter);
        }
    }

    return drawBorders();
}

const drawRectangle = (x1, y1, x2, y2) => {
    drawLines(x1, y1, x2, y1);
    drawLines(x1, y2, x1, y1);
    drawLines(x2, y1, x2, y2);
    drawLines(x2, y2, x1, y2);

    return drawBorders();
}
const checkCoordinates = (width, height, ...coordinates) => {
    const x = coordinates.filter((c, i) => !(i % 2));
    const y = coordinates.filter((item, index) => index % 2);
    return (x.every(value => Number(value) >= 1 && Number(value) <= width) && y.every(value => Number(value) >= 1 && Number(value) <= height));
}

const fill = (x, y, color, width, height) => {
    color = Symbol(color);
    const queue = [{x,y}];
    const visitedPixels = {};

    while (queue.length) {
        let { x, y } = queue.pop();
        const pixelKey = `${x}-${y}`;
        if (
            checkCoordinates(width, height, x, y) && !visitedPixels[pixelKey]
        ) {
            const pixel = globalMatrix[y - 1][x - 1];
            visitedPixels[pixelKey] = true;

            if (pixel !== SymbolToFill.Letter) {
                createSymbol(x, y, color);
                queue.push({ x: x + 1, y });
                queue.push({ x: x - 1, y });
                queue.push({ x, y: y + 1 });
                queue.push({ x, y: y - 1 });
            }
        }
    }

    return drawBorders();
}
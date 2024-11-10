/* eslint-disable no-mixed-operators */
/* eslint-disable no-bitwise */
const random = function random(x) {
    return Math.random() * x;
};
const processRandomInput = function (input) {
    if (input.length === 1 && typeof input[0] === 'string') {
        return input[0].split(',');
    }
    return input;
};
Object.assign(random, {
    dice(...variants) {
        const dices = processRandomInput(variants);
        if (Array.isArray(dices) && dices.length > 0) {
            return dices[Math.floor(Math.random() * dices.length)];
        }
        return null;
    },
    histogram(...histogram) {
        const coeffs = [...processRandomInput(histogram)];
        let sumCoeffs = 0;
        for (let i = 0; i < coeffs.length; i++) {
            sumCoeffs += coeffs[i];
            if (i > 0) {
                coeffs[i] += coeffs[i - 1];
            }
        }
        const bucketPosition = Math.random() * sumCoeffs;
        var i;
        for (i = 0; i < coeffs.length; i++) {
            if (coeffs[i] > bucketPosition) {
                break;
            }
        }
        return i / coeffs.length + Math.random() / coeffs.length;
    },
    optimistic(exp) {
        return 1 - random.pessimistic(exp);
    },
    pessimistic(exp) {
        exp = exp || 2;
        return Math.random() ** exp;
    },
    range(x1, x2) {
        return x1 + Math.random() * (x2 - x1);
    },
    deg() {
        return Math.random() * 360;
    },
    coord() {
        return [
            Math.floor(Math.random() * camera.width),
            Math.floor(Math.random() * camera.height)
        ];
    },
    chance(x, y) {
        if (y) {
            return (Math.random() * y < x);
        }
        return (Math.random() * 100 < x);
    },
    from(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    },
    text(text) {
        const bracketGroups = [];
        for (let i = 0; i < text.length; i++) {
            if (text[i] === '{') {
                bracketGroups.push({
                    start: i,
                    end: void 0
                });
            } else if (text[i] === '}') {
                const leaf = bracketGroups.pop();
                if (!leaf) {
                    throw new Error(`Unbalanced braces. Faced an extra closing bracket at pos ${i}.`);
                }
                leaf.end = i;
                const tokens = text.slice(leaf.start + 1, leaf.end).split('|');
                const randomized = tokens[Math.floor(Math.random() * tokens.length)];
                text = text.slice(0, leaf.start) + randomized + text.slice(leaf.end + 1);
                i -= leaf.end - leaf.start + 1 - randomized.length;
            }
        }
        if (bracketGroups.length > 0) {
            throw new Error(`Unbalanced braces. Faced an extra opening bracket at pos ${bracketGroups.pop().start}.`);
        }
        return text;
    },
    enumValue(en) {
        const vals = Object.values(en).filter(v => Number.isFinite(v));
        return random.from(vals);
    },
    // Mulberry32, by bryc from https://stackoverflow.com/a/47593316
    createSeededRandomizer(a) {
        return function seededRandomizer() {
            var t = a += 0x6D2B79F5;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
    }
});
{
    const handle = {};
    handle.currentRootRandomizer = random.createSeededRandomizer(456852);
    random.seeded = function seeded() {
        return handle.currentRootRandomizer();
    };
    random.setSeed = function setSeed(seed) {
        handle.currentRootRandomizer = random.createSeededRandomizer(seed);
    };
    random.setSeed(9323846264);
}
window.random = random;

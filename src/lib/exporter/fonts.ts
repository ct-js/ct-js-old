import fs from '../neutralino-fs-extra';

import {getPathToTtf} from '../resources/typefaces';
import {run} from '../buntralino-client';

export const stringifyFont = (typeface: ITypeface, font: IFont): string => `
@font-face {
    font-family: '${typeface.name}';
    src: url('fonts/${font.uid}.woff') format('woff'),
         url('fonts/${font.uid}.ttf') format('truetype');
    font-weight: ${font.weight};
    font-style: ${font.italic ? 'italic' : 'normal'};
}`;

type fontsBundleResult = {
    css: string;
    js: string;
};
export const bundleFonts = async function (
    input: ITypeface[],
    projdir: string,
    writeDir: string
): Promise<fontsBundleResult> {
    let css = '',
        js = '';
    const writePromises: Promise<void>[] = [];
    if (input) {
        js += 'if (document.fonts) { for (const font of document.fonts) { font.load(); }}';
        await fs.ensureDir(writeDir + '/fonts');
        const promises: Promise<string>[] = [];
        for (const typeface of input) {
            promises.push(...typeface.fonts.map(async font => {
                // Run the copying task early so they run in parallel
                writePromises.push(fs.copy(getPathToTtf(font, true), writeDir + '/fonts/' + font.uid + '.ttf'));
                try {
                    await run('ttf2Woff', {
                        in: getPathToTtf(font, true),
                        out: writeDir + '/fonts/' + font.uid + '.woff'
                    });
                } catch (e) {
                    window.alertify.error(`Whoah! A buggy ttf file in the typeface ${typeface.name} ${font.weight} ${font.italic ? 'italic' : 'normal'}. You should either fix it or find a new one.`);
                    throw e;
                }
                return stringifyFont(typeface, font);
            }));
        }
        css += (await Promise.all(promises)).join('\n\n');
    }

    await Promise.all(writePromises);
    return {
        css,
        js
    };
};

const charSets: Record<Exclude<builtinCharsets, 'allInFont'>, string> = {
    punctuation: ' !"#$%&\'()*+,-./0123456789:;<=>?@[\\]^_`{|}~',
    basicLatin: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    latinExtended: 'ĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿŀŁłŃńŅņŇňŉŊŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťŦŧŨũŪūŬŭŮůŰűŲųŴŵŶŷŸŹźŻżŽžſƀƁƂƃƄƅƆƇƈƉƊƋƌƍƎƏƐƑƒƓƔƕƖƗƘƙƚƛƜƝƞƟƠơƢƣƤƥƦƧƨƩƪƫƬƭƮƯưƱƲƳƴƵƶƷƸƹƺƻƼƽƾƿǀǁǂǃǄǅǆǇǈǉǊǋǌǍǎǏǐǑǒǓǔǕǖǗǘǙǚǛǜǝǞǟǠǡǢǣǤǥǦǧǨǩǪǫǬǭǮǯǰǱǲǳǴǵǶǷǸǹǺǻǼǽǾǿȀȁȂȃȄȅȆȇȈȉȊȋȌȍȎȏȐȑȒȓȔȕȖȗȘșȚțȜȝȞȟȠȡȢȣȤȥȦȧȨȩȪȫȬȭȮȯȰȱȲȳȴȵȶȷȸȹȺȻȼȽȾȿɀɁɂɃɄɅɆɇɈɉɊɋɌɍɎɏ',
    cyrillic: '«»ЀЁЂЃЄЅІЇЈЉЊЋЌЍЎЏАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюяѐёђѓєѕіїјљњћќѝўџѠѡѢѣѤѥѦѧѨѩѪѫѬѭѮѯѰѱѲѳѴѵѶѷѸѹѺѻѼѽѾѿҀҁ҂о҃о҄о҅о҆о҇о҈о҉ҊҋҌҍҎҏҐґҒғҔҕҖҗҘҙҚқҜҝҞҟҠҡҢңҤҥҦҧҨҩҪҫҬҭҮүҰұҲҳҴҵҶҷҸҹҺһҼҽҾҿӀӁӂӃӄӅӆӇӈӉӊӋӌӍӎӏӐӑӒӓӔӕӖӗӘәӚӛӜӝӞӟӠӡӢӣӤӥӦӧӨөӪӫӬӭӮӯӰӱӲӳӴӵӶӷӸӹӺӻӼӽӾӿԀԁԂԃԄԅԆԇԈԉԊԋԌԍԎԏԔԕԖԗԘԙԚԛԜԝԞԟԠԡԢԣԤԥԦԧԨԩԪԫԬԭԮԯ',
    greekCoptic: 'ͰͱͲͳʹ͵Ͷͷͺͻͼͽ;΄΅Ά·ΈΉΊΌΎΏΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψωϊϋόύώϏϐϑϒϓϔϕϖϗϘϙϚϛϜϝϞϟϠϡϢϣϤϥϦϧϨϩϪϫϬϭϮϯϰϱϲϳϴϵ϶ϷϸϹϺϻϼϽϾϿ',
    custom: ''
};

const specialCharMap: Record<number, string> = {
    38: '&amp;',
    60: '&lt;',
    32: 'space',
    62: '&gt;',
    34: '&quot;'
};
const charCodeToXMLChar = (code: number): string => {
    if (code in specialCharMap) {
        return specialCharMap[code];
    }
    return String.fromCharCode(code);
};

export const generateXML = function generateXML(
    fontData: any,
    ctTypeface: ITypeface,
    font: IFont
): string {
    let XMLTemplate = `<font>
    <info face="${ctTypeface.name}" size="${ctTypeface.bitmapFontSize}" bold="${font.weight}" italic="${font.italic ? '1' : '0'}" charset="" unicode="0" stretchH="100" smooth="1" aa="1" padding="0,0,0,0" spacing="1,1"/>
    <common lineHeight="${ctTypeface.bitmapFontLineHeight}" base="${ctTypeface.bitmapFontSize}" scaleW="${fontData.canvas.width}" scaleH="${fontData.canvas.height}" pages="1" packed="0"/>
    <pages>
        <page id="0" file="${font.uid}.png"/>
    </pages>
    <chars count="${Object.keys(fontData.map).length}">`;

    for (const key in fontData.map) {
        const c = fontData.map[key];
        XMLTemplate += `\n        <char id="${key}" x="${c.x}" y="${c.y}" width="${c.width}" height="${c.height}" xoffset="0" yoffset="0" xadvance="${c.width}" page="0" chnl="0" letter="${charCodeToXMLChar(Number(key))}"/>`;
    }

    XMLTemplate += `
    </chars>
    <kernings count="0"></kernings>
</font>`;

    return XMLTemplate;
};

import {generateBitmapFont} from '../resources/typefaces/bitmapFontGenerator';
/**
 * @returns {Promise<string[]>} A promise that resolves into an array of file paths to fonts' XML.
 */
export const bakeBitmapFonts = async (
    input: ITypeface[],
    projdir: string,
    writeDir: string
): Promise<string[]> => {
    const path = require('path');
    const bitmappableTypefaces = input.filter(typeface => typeface.bitmapFont);
    const fontsMetadataUnflattened = await Promise.all(bitmappableTypefaces.map((typeface) => {
        const fCharsets = typeface.charsets || ['basicLatin'];
        let letterList: string;
        if (fCharsets.length === 1 && fCharsets[0] === 'allInFont') {
            letterList = '';
        } else {
            letterList = fCharsets.reduce((
                acc: string,
                charset: Exclude<builtinCharsets, 'allInFont'>
            ) => acc + (charSets[charset] || ''), '');
        }
        if (fCharsets.indexOf('custom') !== -1) {
            letterList += typeface.customCharset!;
        }
        const settings = {
            fill: '#ffffff',
            // stroke: '#000000',l
            list: letterList,
            height: typeface.bitmapFontSize,
            margin: 2,
            pixelPerfect: typeface.bitmapPrecision,
            typefaceName: typeface.name
        };
        return Promise.all(typeface.fonts.map(async font => {
            const xmlPath = `${font.uid}.xml`,
                  pngPath = `${font.uid}.png`;
            const fontPath = getPathToTtf(font, true);
            const drawData = await generateBitmapFont(fontPath, path.join(writeDir, `${font.uid}.png`), {
                ...settings,
                fontOrigname: font.origname
            });
            const xml = generateXML(drawData, typeface, font);
            await fs.writeFile(path.join(writeDir, `${font.uid}.xml`), xml, 'utf8');
            return {
                xmlPath,
                pngPath,
                typefaceName: typeface.name,
                weight: font.weight,
                italic: font.italic
            };
        }));
    }));
    const fontsMetadata = fontsMetadataUnflattened.flat(1);
    const bitmapFontsXML = fontsMetadata.map(m => m.xmlPath);
    return bitmapFontsXML;
};

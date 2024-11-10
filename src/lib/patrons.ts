import {run} from './buntralino-client';

type ranks = 'cat' |'business cat' | 'partner';
type Patron = {
    name: string;
    rank: ranks;
    avatar: string;
}
type Donor = Omit<Patron, 'rank'>;

export const patrons: Record<ranks, Patron[]> = {
    cat: [],
    'business cat': [],
    partner: []
};
export const donors: Donor[] = [];

let loaded = false;
export const getPatrons = async (): Promise<Record<ranks, Patron[]>> => {
    if (loaded) {
        return patrons;
    }
    let patronsJson: {
        Patrons: Patron[];
        Donations: Donor[];
    } = await fetch('/data/patronsCache.json').then(json => json.json());
    try {
        patronsJson = await run('fetchJson', 'https://ctjs.rocks/staticApis/patrons.json') as typeof patronsJson;
    } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(e);
    }
    for (const patron of patronsJson.Patrons) {
        patrons[patron.rank].push(patron);
    }
    donors.push(...patronsJson.Donations);
    // eslint-disable-next-line require-atomic-updates
    loaded = true;
    return patrons;
};
export const getRandomPatron = async (): Promise<Patron> => {
    await getPatrons();
    let array = patrons.cat;
    if (Math.random() < 0.5 && patrons.partner.length) {
        array = patrons.partner;
    } else if (Math.random() < 0.5 && patrons['business cat'].length) {
        array = patrons['business cat'];
    }
    return array[Math.floor(Math.random() * array.length)];
};

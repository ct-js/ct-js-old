home-news
    .home-news-aNewsRow.aPanel.pad.flexrow(if="{homepageContent && homepageContent.announcement}")
        .home-news-aNewsBg(if="{homepageContent.announcement.bgImage}" style="background-image: url('{globalizeLink(homepageContent.announcement.bgImage)}')")
        .home-news-aNewsRowInner
            h2.nmt {homepageContent.announcement.title}
            p {homepageContent.announcement.description}
            .button(href="{homepageContent.announcement.link}" onclick="{openExternal(globalizeLink(homepageContent.announcement.link))}")
                svg.feather
                    use(xlink:href="#external-link")
                span {homepageContent.announcement.linkLabel || vocGlob.open}
        img(src="{globalizeLink(homepageContent.announcement.image)}" if="{homepageContent.announcement.image}")

    .aSpacer
    a.button.nogrow.toright.inline(href="https://ctjs.rocks/submitgame" onclick="{openExternal('https://ctjs.rocks/submitgame')}")
        svg.feather
            use(xlink:href="#mail")
        span {voc.submitYourOwn}
    h2.nogrow.nmt(if="{homepageContent && homepageContent.games && homepageContent.games.length}")
        | {voc.gamesFromCommunity}
    .clear
    .home-news-FeaturedGames(if="{homepageContent && homepageContent.games && homepageContent.games.length}")
        ul.Cards.largeicons.nmt(if="{homepageContent && homepageContent.games && homepageContent.games.length}")
            li.aCard(each="{content in homepageContent.games}")
                .aCard-aThumbnail
                    img(src="{globalizeLink(content.cover)}")
                div
                    h3 {content.title}
                    i.dim {voc.authorBy.replace('$1', content.author)}
                    p {content.description}
                    button(onclick="{openExternal(globalizeLink(content.link))}")
                        svg.feather
                            use(xlink:href="#external-link")
                        span {vocGlob.open}

    .aSpacer
    a.button.nogrow.toright.inline(href="https://ctjs.rocks/submitresource" onclick="{openExternal('https://ctjs.rocks/submitresource')}")
        svg.feather
            use(xlink:href="#mail")
        span {voc.submitYourOwn}
    h2.nogrow.nmt(if="{homepageContent && homepageContent.learn && homepageContent.learn.length}")
        | {voc.learningResources}
    .clear
    .home-news-LearningResources(if="{homepageContent && homepageContent.learn && homepageContent.learn.length}")
        ul.Cards.largeicons.nmt(if="{homepageContent && homepageContent.learn && homepageContent.learn.length}")
            li.aCard(each="{content in homepageContent.learn}")
                .aCard-aThumbnail
                    img(src="{globalizeLink(content.cover)}")
                div
                    h3 {content.title}
                    i.dim {voc.authorBy.replace('$1', content.author)}
                    p {content.description}
                    button(onclick="{openExternal(globalizeLink(content.link))}")
                        svg.feather
                            use(xlink:href="#external-link")
                        span {vocGlob.open}


    script.
        const {write} = require('src/lib/neutralino-storage');
        const {run} = require('src/lib/buntralino-client');
        this.namespace = 'intro';
        this.mixin(require('src/lib/riotMixins/voc').default);

        // Global announcements and homepage data
        this.globalizeLink = link => {
            if (link.startsWith('/')) {
                return 'https://ctjs.rocks/' + link;
            }
            return link;
        };

        let needsHomepageFetch = false,
            lastHomepageFetch;
        if (localStorage.lastHomepageFetch) {
            lastHomepageFetch = new Date(localStorage.lastHomepageFetch);
            // Check once an hour
            if ((new Date()) - lastHomepageFetch > 1000 * 60 * 60) {
                needsHomepageFetch = true;
            }
        } else {
            needsHomepageFetch = true;
        }
        if (needsHomepageFetch) {
            setTimeout(() => {
                run('fetchJson', 'https://ctjs.rocks/staticApis/ctHome.json')
                .then(json => {
                    if (!json.errors) {
                        write('lastHomepageFetch', new Date());
                        write('lastHomepageFetchContent', JSON.stringify(json));
                        this.homepageContent = json;
                        this.update();
                    } else {
                        console.error('Update check failed:');
                        console.error(json.errors);
                        // Fallback to cached data
                        if (localStorage.lastHomepageFetchContent) {
                            this.homepageContent = JSON.parse(localStorage.lastHomepageFetchContent);
                            this.update();
                        }
                    }
                })
                .catch(() => {
                    // Fallback to cached data
                    if (localStorage.lastHomepageFetchContent) {
                        this.homepageContent = JSON.parse(localStorage.lastHomepageFetchContent);
                        this.update();
                    }
                });
            }, 0);
        } else {
            this.homepageContent = JSON.parse(localStorage.lastHomepageFetchContent);
        }

        this.openExternal = link => e => {
            const {os} = Neutralino;
            os.open(link);
            e.stopPropagation();
            e.preventDefault();
        };

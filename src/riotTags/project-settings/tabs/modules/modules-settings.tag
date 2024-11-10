modules-settings.aPanel.aView
    collapsible-section.aModuleFilter(heading="{voc.filter}" defaultstate="closed" storestatekey="modulesFilter")
        .flexrow
            label.nogrow
                b {parent.vocGlob.search}
                br
                .aSearchWrap.nm
                    input.inline(type="text" value="{parent.searchValue}" onkeyup="{parent.searchMod}")
                    svg.feather
                        use(xlink:href="#search")
            .aModuleFilterColumns
                // The "if" clause in the label hides categories with 0 items
                label.checkbox(
                    each="{category in parent.filterCategories}"
                    if="{parent.categoriesCounter[category]}"
                )
                    input(
                        type="checkbox"
                        checked="{parent.parent.pickedCategories.indexOf(category) !== -1}"
                        onchange="{parent.parent.toggleCategory(category)}"
                    )
                    svg.feather.accent1
                        use(xlink:href="#{parent.parent.categoryToIconMap[category]}")
                    span   {parent.parent.voc.categories[category]} ({parent.parent.categoriesCounter[category]})
    button.wide(onclick="{importModules}")
        svg.feather
            use(xlink:href="#folder")
        span {voc.importModules}
    collapsible-section(preservedom="yes" hlevel="1" heading="{voc.enabledModules}" defaultstate="opened" storestatekey="modulesEnabled")
        .aModuleList
            .aModuleCard(
                each="{module in parent.enabledModules}"
                if="{parent.checkVisibility(module)}"
                onclick="{parent.parent.openModule(module)}"
            )
                module-meta(module="{module}")
    collapsible-section(preservedom="yes" hlevel="1" heading="{voc.availableModules}" defaultstate="opened" storestatekey="modulesAvailable")
        .aModuleList
            .aModuleCard(
                each="{module in parent.allModules}"
                if="{parent.checkVisibility(module)}"
                onclick="{parent.parent.openModule(module)}"
            )
                module-meta(module="{module}")
    module-viewer(if="{openedModule}" module="{openedModule}" onclose="{closeModule}")
    script.
        this.namespace = 'modules';
        this.mixin(require('src/lib/riotMixins/voc').default);

        const {moduleDir, loadModules, categoryToIconMap} = require('src/lib/resources/modules');

        this.categoriesCounter = {};
        this.filterCategories = Object.keys(categoryToIconMap).sort();
        this.filterCategories.splice(this.filterCategories.indexOf('default'), 1);
        this.categoryToIconMap = categoryToIconMap;

        this.resortEnabledModules = () => {
            this.enabledModules = this.allModules
                .filter(module => module.name in window.currentProject.libs);
        };
        this.refreshModules = () => {
            loadModules().then(modules => {
                // Sort by their codename (folder name)
                this.allModules = modules.sort((a, b) => a.name.localeCompare(b.name));
                this.categoriesCounter = {};
                for (const category of this.filterCategories) {
                    this.categoriesCounter[category] = 0;
                }
                for (const module of this.allModules) {
                    if (module.manifest.main.categories) {
                        for (const category of module.manifest.main.categories) {
                            if (this.filterCategories.includes(category)) {
                                this.categoriesCounter[category]++;
                            }
                        }
                    }
                }
                this.resortEnabledModules();
                this.update();
            });
        };
        this.refreshModules();

        const {run} = require('src/lib/buntralino-client');
        this.importModules = async e => {
            const files = await Neutralino.os.showOpenDialog(void 0, {
                filters: [{
                    name: 'Zip archive',
                    extensions: ['zip']
                }],
                multiSelections: true
            });
            if (files.length === 0) {
                return;
            }
            const path = require('path');

            const unpackPromises = [];

            for (const file of files) {
                const destPath = path.join(moduleDir, path.basename(file, path.extname(file)));
                unpackPromises.push(run('unzip', {
                    inPath: file,
                    outPath: destPath
                }));
            }
            await Promise.all(unpackPromises);
            this.refreshModules();
        };

        this.searchValue = '';
        this.searchMod = e => {
            this.searchValue = e.target.value.trim();
            this.update();
        };
        this.pickedCategories = [];
        this.toggleCategory = category => () => {
            const ind = this.pickedCategories.indexOf(category);
            if (ind !== -1) {
                this.pickedCategories.splice(ind, 1);
            } else {
                this.pickedCategories.push(category);
            }
            this.update();
        };
        this.checkVisibility = module => {
            const name = this.localizeField(module, 'name').toLowerCase(),
                  tagline = this.localizeField(module.manifest.main, 'tagline').toLowerCase();
            const visibleDueToSearch = !this.searchValue ||
                  name.indexOf(this.searchValue.toLowerCase()) !== -1 ||
                  tagline.indexOf(this.searchValue.toLowerCase()) !== -1;
            const visibleDueToFilters = this.pickedCategories.length === 0 ||
                  module.manifest.main.categories.find(c => this.pickedCategories.indexOf(c) !== -1);
            return visibleDueToFilters && visibleDueToSearch;
        };

        this.openModule = module => () => {
            this.openedModule = module;
            this.update();
        };
        this.closeModule = () => {
            this.openedModule = null;
            this.update();
        };

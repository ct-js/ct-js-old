coding-language-selector
    .aDimmer.fadein
        .aModal.flexfix.appear
            .flexfix-body.pad
                h1.nmt.npt {voc.chooseLanguageHeader}
                p {voc.chooseLanguageExplanation}
                .flexrow.coding-language-selector-aComparisonTable
                    div
                        h2.nmt
                            svg.icon
                                use(xlink:href="#civet")
                            span Civet
                        p.nmt {voc.civetDescription}
                        pre
                            code.
                                if health <= 0 and not invulnerable
                                    @kill = yes
                        button(class="{active: selection === 'civet'}" onclick="{selectLanguage('civet')}")
                            svg.icon
                                use(xlink:href="#civet")
                            span {voc.pickCivet}
                    div
                        h2.nmt
                            svg.icon
                                use(xlink:href="#javascript")
                            span {voc.jsAndTs}
                        p.nmt {voc.jsTsDescription}
                        pre
                            code.
                                if (health <= 0 && !invulnerable) \{
                                    this.kill = true;
                                }
                        button(class="{active: selection === 'typescript'}" onclick="{selectLanguage('typescript')}")
                            svg.icon
                                use(xlink:href="#javascript")
                            span {voc.pickJsTs}
                    div
                        h2.nmt
                            svg.feather
                                use(xlink:href="#catnip")
                            span {voc.catnip}
                        p.nmt {voc.catnipDescription}
                        .catnip-block.command
                            svg.feather
                                use(xlink:href="#help-circle")
                            span.catnip-block-aTextLabel {vocFull.catnip.blockDisplayNames['if else branch']}
                            .catnip-block.computed.boolean
                                .catnip-block.computed.boolean
                                    .catnip-block.computed.wildcard.number.userdefined
                                        svg.feather
                                            use(xlink:href="#clock")
                                        span.catnip-block-aTextLabel health
                                    span.catnip-block-aTextLabel ≤
                                    input.catnip-block-aConstantInput.number(readonly="readonly" value="0" style="width: 2ch;" type="text")
                                span.catnip-block-aTextLabel {vocFull.catnip.blockLabels.and}
                                .catnip-block.computed.boolean
                                    span.catnip-block-aTextLabel {vocFull.catnip.blockDisplayNames['NOT logic operator']}
                                    .catnip-block.computed.wildcard.boolean.userdefined
                                        svg.feather
                                            use(xlink:href="#clock")
                                        span.catnip-block-aTextLabel invulnerable
                            .catnip-block-Blocks(ref="blocksDrop")
                                .catnip-block.command
                                    svg.feather
                                        use(xlink:href="#template")
                                    span.catnip-block-aTextLabel {vocFull.catnip.blockNames['kill copy']}
                            svg.feather
                                use(xlink:href="#alert-circle")
                            span.catnip-block-aTextLabel {vocFull.catnip.blockLabels.else}
                            .catnip-block-Blocks(ref="blocksDrop")
                                .catnip-block-aBlockPlaceholder
                                    svg.feather
                                        use(xlink:href="#thumbs-up")
                                    span.catnip-block-aTextLabel {vocFull.catnip.placeholders.doNothing}
                        button(class="{active: selection === 'catnip'}" onclick="{selectLanguage('catnip')}")
                            svg.feather
                                use(xlink:href="#catnip")
                            span {voc.pickCatnip}
            .inset.flexfix-footer.flexrow
                button.nogrow(onclick="{cancel}")
                    span {vocGlob.cancel}
                .aSpacer
                button.nogrow(disabled="{!selection}" onclick="{applySelection}")
                    svg.feather
                        use(xlink:href="#check")
                    span {vocGlob.apply}
    script.
        this.namespace = 'languageSelector';
        this.mixin(require('src/lib/riotMixins/voc').default);

        this.selection = false;

        this.selectLanguage = language => () => {
            this.selection = language;
        };

        this.cancel = () => {
            this.opts.oncancelled();
        };
        this.applySelection = () => {
            this.opts.onselected(this.selection);
        };

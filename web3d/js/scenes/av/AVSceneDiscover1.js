function avSceneDiscover1() {
    if (avLocalMediaStream != null) {
        avLocalMediaStream.getTracks()[0].stop();
    }

    avSceneDiscoverNr = 1;
    $('#content').load('content/av/avSceneDiscover1.html', function() {
        //GUI avDiscover1
        avSceneDiscover1Gui = new dat.GUI({
            autoPlace: false,
            width: 250
        });
        $('#avDiscover1Gui').append(avSceneDiscover1Gui.domElement);
        var f1 = avSceneDiscover1Gui.addFolder('Farbkorrektur');
        f1.open();
        var avSceneDiscover1colorCorrectionFilter = f1.add(filterParameters, 'colorCorrectionFilter').listen().name('An/Aus');
        f1.add(colorCorrectionEffect.uniforms.mulRGB.value, 'x').min(0).max(10).name('Rot');
        f1.add(colorCorrectionEffect.uniforms.mulRGB.value, 'y').min(0).max(10).name('Gr&uuml;n');
        f1.add(colorCorrectionEffect.uniforms.mulRGB.value, 'z').min(0).max(10).name('Blau');


        var avSceneDiscover1Brightness = avSceneDiscover1Gui.add(filterParameters.bc, 'x').step(0.01).min(-10.0).max(10.0).name('Helligkeit').listen();

        var avSceneDiscover1Contrast = avSceneDiscover1Gui.add(filterParameters.bc, 'y').step(0.01).min(-10.0).max(10.0).name('Kontrast').listen();

        var avSceneDiscover1blackWhiteFilter = avSceneDiscover1Gui.add(filterParameters, 'blackWhiteFilter').listen().name('S/W');

        var avSceneDiscover1EdgeFilter = avSceneDiscover1Gui.add(filterParameters, 'edgeFilter').listen().name('Kantenfilter');

        var avSceneDiscover1DotFilter = avSceneDiscover1Gui.add(filterParameters, 'dotFilter').listen().name('Punktfilter');

        avSceneDiscover1DotFilter.onChange(function(value) {
            avSceneDiscover1EffectToggle(value, dotScreenEffect);
        });
        avSceneDiscover1EdgeFilter.onChange(function(value) {
            avSceneDiscover1EffectToggle(value, edgeEffect);
        });
        avSceneDiscover1blackWhiteFilter.onChange(function(value) {
            avSceneDiscover1EffectToggle(value, blackWhiteEffect);
        });
        avSceneDiscover1colorCorrectionFilter.onChange(function(value) {
            avSceneDiscover1EffectToggle(value, colorCorrectionEffect);
        });

        avSceneDiscover1Brightness.onChange(function(value) {
            brightnessContrastEffect.uniforms.brightness.value = value / 10;
        });
        avSceneDiscover1Contrast.onChange(function(value) {
            brightnessContrastEffect.uniforms.contrast.value = value / 10;
        });
    });


}

function avSceneDiscover1EffectToggle(value, effect) {
    if (value) {
        composer.insertPass(effect, composer.passes.length - 1);
    } else {
        var index = composer.passes.indexOf(effect);
        composer.passes.splice(index, 1);
    }
}

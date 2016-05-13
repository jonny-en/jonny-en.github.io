function avSceneDiscover1() {
    document.body.appendChild(renderer.domElement);
    renderer.domElement.focus();

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
        var avSceneDiscover1colorCorrectionFilter = avSceneDiscover1Gui.add(filterParameters, 'colorCorrectionFilter').listen().name('Color Correction');
        avSceneDiscover1Gui.add(colorCorrectionEffect.uniforms.mulRGB.value, 'x').min(0).max(10).name('Red');
        avSceneDiscover1Gui.add(colorCorrectionEffect.uniforms.mulRGB.value, 'y').min(0).max(10).name('Green');
        avSceneDiscover1Gui.add(colorCorrectionEffect.uniforms.mulRGB.value, 'z').min(0).max(10).name('Blue');

        var avSceneDiscover1gammaCorrectionFilter = avSceneDiscover1Gui.add(filterParameters, 'gammaCorrectionFilter').listen().name('Gamma Correction');

        var avSceneDiscover1Brightness = avSceneDiscover1Gui.add(filterParameters.bc, 'x').step(0.01).min(-10.0).max(10.0).name('Brightness').listen();

        var avSceneDiscover1Contrast = avSceneDiscover1Gui.add(filterParameters.bc, 'y').step(0.01).min(-10.0).max(10.0).name('Contrast').listen();

        var avSceneDiscover1blackWhiteFilter = avSceneDiscover1Gui.add(filterParameters, 'blackWhiteFilter').listen().name('Black &amp; White');

        var avSceneDiscover1EdgeFilter = avSceneDiscover1Gui.add(filterParameters, 'edgeFilter').listen().name('Edge Filter');

        var avSceneDiscover1DotFilter = avSceneDiscover1Gui.add(filterParameters, 'dotFilter').listen().name('Dot Filter');

        avSceneDiscover1DotFilter.onChange(function(value) {
            avSceneDiscover1EffectToggle(value, dotScreenEffect);
        });
        avSceneDiscover1EdgeFilter.onChange(function(value) {
            avSceneDiscover1EffectToggle(value, edgeEffect);
        });
        avSceneDiscover1gammaCorrectionFilter.onChange(function(value) {
            avSceneDiscover1EffectToggle(value, gammaCorrectionEffect);
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
    if (value === true) {
        composer.insertPass(effect, composer.passes.length - 1);
    } else {
        var index = composer.passes.indexOf(effect);
        composer.passes.splice(index, 1);
    }
}

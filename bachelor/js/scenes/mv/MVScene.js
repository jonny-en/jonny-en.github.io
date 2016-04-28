var mvSceneDiscover0Gui
var sliceX, sliceY, sliceZ;
var volume;
var volumeLoaded = false;
var vrInit = false;
var _dicom = ['53320924', '53321068', '53322843', '53322987', '53323131',
    '53323275', '53323419', '53323563', '53323707', '53323851',
    '53323995', '53324139', '53324283', '53325471', '53325615',
    '53325759', '53325903', '53320940', '53321084', '53322859',
    '53323003', '53323147', '53323291', '53323435', '53323579',
    '53323723', '53323867', '53324011', '53324155', '53324299',
    '53325487', '53325631', '53325775', '53325919', '53320956',
    '53322731', '53322875', '53323019', '53323163', '53323307',
    '53323451', '53323595', '53323739', '53323883', '53324027',
    '53324171', '53324315', '53325503', '53325647', '53325791',
    '53325935', '53320972', '53322747', '53322891', '53323035',
    '53323179', '53323323', '53323467', '53323611', '53323755',
    '53323899', '53324043', '53324187', '53325375', '53325519',
    '53325663', '53325807', '53325951', '53320988', '53322763',
    '53322907', '53323051', '53323195', '53323339', '53323483',
    '53323627', '53323771', '53323915', '53324059', '53324203',
    '53325391', '53325535', '53325679', '53325823', '53321004',
    '53322779', '53322923', '53323067', '53323211', '53323355',
    '53323499', '53323643', '53323787', '53323931', '53324075',
    '53324219', '53325407', '53325551', '53325695', '53325839',
    '53321020', '53322795', '53322939', '53323083', '53323227',
    '53323371', '53323515', '53323659', '53323803', '53323947',
    '53324091', '53324235', '53325423', '53325567', '53325711',
    '53325855', '53321036', '53322811', '53322955', '53323099',
    '53323243', '53323387', '53323531', '53323675', '53323819',
    '53323963', '53324107', '53324251', '53325439', '53325583',
    '53325727', '53325871', '53321052', '53322827', '53322971',
    '53323115', '53323259', '53323403', '53323547', '53323691',
    '53323835', '53323979', '53324123', '53324267', '53325455',
    '53325599', '53325743', '53325887'
];


function initMVScene() {
    cameraFixed = true;
    renderer.clear();
    scene.remove(mainScene);
    renderer.setClearColor(0x000000);
    renderer.render(scene, camera);
    $('#description').text("J.-Prof. Dr. Kai Lawonn");
    $('#pageTitle').text("MEDICAL VISUALIZATION");
    $('#content').load("content/mv/mvSceneStart.html");
    cameraFixed = true;


}

function volumeRenderingInit() {
    _webGLFriendly = true;
    try {
        // try to create and initialize a 3D renderer
        threeD = new X.renderer3D();
        threeD.container = '3d';
        threeD.init();
    } catch (Exception) {

        // no webgl on this machine
        _webGLFriendly = false;

    }

    if (_webGLFriendly) {
        threeD.add(volume);
        threeD.camera.position = [0, 500, 0];
        threeD.render();
    }
}


function mvSceneDiscover1() {

    if (volumeLoaded === true) {
        if (vrInit === false) {
            $('#content').load("content/mv/mvSceneDiscover1.html", function() {
                volumeRenderingInit();
                vrInit = true;
                $('#mvSceneDiscover1Gui').append(mvSceneDiscover0Gui.domElement);
                var vrController = mvSceneDiscover0Gui.add(volume, 'volumeRendering').name("Volume Rendering");

            });
        }
        volume.volumeRendering = false;
    } else {
        alert('Please wait for the volume data to be loaded!');
    }
}

function mvSceneDiscover0() {
    sliceX = null;
    sliceY = null;
    sliceZ = null;
    volumeLoaded = false;
    vrInit = false;

    volume = new X.volume();
    // map the data url to each of the slices
    volume.file = _dicom.sort().map(function(v) {

        // we also add the 'fake' .DCM extension since else wise
        // XTK would think .org is the extension
        return 'http://x.babymri.org/?' + v + '&.DCM';

    });

    $('#content').load("content/mv/mvSceneDiscover0.html", function() {


        // create the 2D renderers
        // .. for the X orientation
        sliceX = new X.renderer2D();
        sliceX.container = 'sliceX';
        sliceX.orientation = 'X';
        sliceX.init();
        // .. for Y
        var sliceY = new X.renderer2D();
        sliceY.container = 'sliceY';
        sliceY.orientation = 'Y';
        sliceY.init();
        // .. and for Z
        var sliceZ = new X.renderer2D();
        sliceZ.container = 'sliceZ';
        sliceZ.orientation = 'Z';
        sliceZ.init();


        // add the volume in the main renderer
        // we choose the sliceX here, since this should work also on
        // non-webGL-friendly devices like Safari on iOS
        sliceX.add(volume);

        // start the loading/rendering
        sliceX.render();

        sliceX.onShowtime = function() {
            volumeLoaded = true;
            //
            // add the volume to the other 3 renderers
            //
            sliceY.add(volume);
            sliceY.render();
            sliceZ.add(volume);
            sliceZ.render();

            // now the real GUI
            //GUI Discover0
            mvSceneDiscover0Gui = new dat.GUI({
                autoPlace: false,
                width: 300
            });
            $('#mvSceneDiscover0Gui').empty();
            $('#mvSceneDiscover0Gui').append(mvSceneDiscover0Gui.domElement);

            var lowerThresholdController = mvSceneDiscover0Gui.add(volume, 'lowerThreshold',
                volume.min, volume.max).name('Lower Threshold');
            var upperThresholdController = mvSceneDiscover0Gui.add(volume, 'upperThreshold',
                volume.min, volume.max).name('Upper Threshold');;
            var sliceXController = mvSceneDiscover0Gui.add(volume, 'indexX', 0,
                volume.dimensions[0] - 1).name('X-Axis');;
            var sliceYController = mvSceneDiscover0Gui.add(volume, 'indexY', 0,
                volume.dimensions[1] - 1).name('Y-Axis');;
            var sliceZController = mvSceneDiscover0Gui.add(volume, 'indexZ', 0,
                volume.dimensions[2] - 1).name('Z-Axis');;

        }

    });

}

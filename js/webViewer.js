$.noConflict();
var scene, viewer;

jQuery("document").ready(function($) {
    console.log("doc ready");
    
    
    initViewer();

    populateSelect();
    
    $("#fancybox").fancybox();
    
    $("#colorSelect").ColorPicker({
        flat: true,
        color: {
            r:76, 
            g:76, 
            b:76
        },
        livePreview: false,
        onSubmit: function(hsb, hex, rgb){
            viewer.view.setClearColor([rgb.r/255, rgb.g/255, rgb.b/255, 1.0]);
        }
    });
    
    $("option").click(function(){
        var value = $(this).attr("value");
        switch(value){
            case "om":
                viewer.setupManipulator();
                break;
            case "fpm":
                viewer.setupManipulator(new osgGA.FirstPersonManipulator());
                viewer.getManipulator().computeHomePosition();
                break;
                
        }
    });
   
    modelFile = $(document).getUrlParam("modelFile");
    
    if(modelFile === null){
        // load default model
        file = "models/cessna.json";
    } else {
        file = "models/" + modelFile;
    }
  
    scene = loadModel(file);
    console.log("path : " + file);
                
});

function loadModel(file){
    jQuery.ajax({
        url: file,  
        dataType: 'json',   
        async: true,  
        success: function(json){  
            if(json == null){
                console.log("get null trying to load " + file);
            } else {
                
                
                scene = osgDB.parseSceneGraph(json);
                console.log("scene parsed : " + scene);
                
                if(!scene){
                    return undefined;
                }
                
                console.log(scene);
                
                initScene(scene);
                
                
            }
        }  
    });
}
function initScene(scene){
    console.log("ok");
    viewer.setScene(scene);
    jQuery("select").find("option:first").attr("selected", "selected").parent("select");
    viewer.setupManipulator();
    viewer.run();
    console.log("run ok ");
}



function populateSelect(){
    
    jQuery('#fileSelector').fileTree({
        root: 'models/'
    }, function(file) {
        loadModel(file);
    });
}
    
function initViewer(){
    console.log("doc ready");
    var size = getWindowSize();

    var canvas = document.getElementById("3DView");

    canvas.width = (size.w-400);
    canvas.height = size.h;
    
    viewer = new osgViewer.Viewer(canvas, {
        antialias : true, 
        alpha: false
    });
    viewer.init();
    viewer.view.setClearColor([0.3, 0.3, 0.3, 1.0]);
}
   
function getWindowSize() {
    var myWidth = 0, myHeight = 0;
    
    if( typeof( window.innerWidth ) == 'number' ) {
        //Non-IE
        myWidth = window.innerWidth;
        myHeight = window.innerHeight;
    } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
        //IE 6+ in 'standards compliant mode'
        myWidth = document.documentElement.clientWidth;
        myHeight = document.documentElement.clientHeight;
    } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
        //IE 4 compatible
        myWidth = document.body.clientWidth;
        myHeight = document.body.clientHeight;
    }
    return {
        'w': myWidth, 
        'h': myHeight
    };
}
$.noConflict();
var scene, viewer;

jQuery("document").ready(function($) {
    console.log("doc ready");
    
    
    initViewer();

    populateSelect();
    
    $("#fichiers").fancybox();
    $("#manipulateurs").fancybox();
    
    $("#colorSelect").ColorPicker({
        flat: true,
        color: {
            r:153, 
            g:229.5, 
            b:255
        },
        livePreview: false,
        onSubmit: function(hsb, hex, rgb){
            viewer.view.setClearColor([rgb.r/255, rgb.g/255, rgb.b/255, 1.0]);
        }
    });
    
    $("select").change(function(){
        
        var value = $("option:selected", $(this)).attr("value");
        console.log("option" + value);
        switch(value){
            case "om":
                viewer.setupManipulator();
                inactiveVelocityControl();
                viewer.getManipulator().computeHomePosition();
                break;
            case "fpm":
                console.log("fpm");
                var fpm = new osgGA.FirstPersonManipulator();
                viewer.setupManipulator(fpm);
                fpm.computeHomePosition();
                fpm.computeVelocity();
                activeVelocityControl(fpm);
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

function inactiveVelocityControl(){
    jQuery("#minusVelocity").unbind("click");
    jQuery("#plusVelocity").unbind("click");
    jQuery("#velocityControl").attr("class", "inactive");
}

function activeVelocityControl(fpm){
    console.log("active fpm");

    jQuery("#velocity").html(fpm.getVelocity());
    jQuery("#velocityControl").attr("class", "");
    jQuery("#minusVelocity").click(function(){
        if(fpm.getMinVelocity() < fpm.getVelocity()){
            fpm.setVelocity(fpm.getVelocity()-1);
        }
        jQuery("#velocity").html(fpm.getVelocity());
    });
    jQuery("#plusVelocity").click(function(){
        if(fpm.getMaxVelocity() > fpm.getVelocity()){
            fpm.setVelocity(fpm.getVelocity()+1);
        }
        jQuery("#velocity").html(fpm.getVelocity());
    });
}

function loadModel(file){
    jQuery.ajax({
        url: file,  
        dataType: 'json',   
        async: true,  
        success: function(json){  
            if(json == null){
                console.log("get null trying to load " + file);
            } else {
                console.log("succes loading file " + file);
                
                scene = osgDB.parseSceneGraph(json);
                console.log("scene parsed : " + scene);
                
//                if(!scene){
//                    return undefined;
//                } else if (file == "models/veget_5_W.osgjs"){
//                     blendFunc = new osg.BlendFunc("SRC_ALPHA", "ONE_MINUS_SRC_ALPHA");   
//                    console.log("scene.getStateSet() " + scene.getStateSet());
//                    g200 = getNodeFromName(scene, "g200");
//                    console.log("g200 + " + g200);
//                    children = g200.getChildren();
//                    if(children.length > 0){
//                        for(var i = 0 ; i < children.length ; i++){
//                            state = children[i].getStateSet();
//                            state.setAttributeAndMode(blendFunc)
//                        }
//                    }
//                }
                
                initScene(scene);
                
                
            }
        }  
    });
}
function initScene(scene){
    
    viewer.setScene(scene);
    jQuery("select").find("option:first").attr("selected", "selected").parent("select");
    inactiveVelocityControl();
    viewer.setupManipulator();
    viewer.getManipulator().computeHomePosition();
    viewer.run();
    
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
        antialias : true
    });
    viewer.init();
    viewer.view.setClearColor([0.6, 0.9, 1.0, 1.0]);
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
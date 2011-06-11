osgSim = {};

osgSim.MultiSwitch = function () {
    
    var _newChildDefaultValue, _activeSwitchSet;
    var _values = [];
    
    var expandToEncompassSwitchSet =     function(){
        
    }
}

osgSim.MultiSwitch.prototype = {
    setSingleChildOn: function(switchSet, pos) {
        
    }, setAllChildrenOff : function(switchSet){
        this._newChildDefaultValue = false;
        this.expandToEncompassSwitchSet(switchSet);
        
        for(var i=0; i < _values.length ; i++){
            
        }
    }
    
}

osgSim.DOFTransform = function (jsonDOF) {
    osg.Transform.call(this);
    
    var multOrder = ["PRH","PHR","HPR","HRP","RPH","RHP"];
    
    var _minHPR = osg.Vec3.copy(jsonDOF.minHPR, _minHPR);
    var _maxHPR = osg.Vec3.copy(jsonDOF.maxHPR, _maxHPR);
    var _currentHPR = osg.Vec3.copy(jsonDOF.currentHPR, _currentHPR);
    var _incrementHPR = osg.Vec3.copy(jsonDOF.incrementHPR, _incrementHPR);
    
    var _minTranslate = osg.Vec3.copy(jsonDOF.minTranslate, _minTranslate);
    var _maxTranslate = osg.Vec3.copy(jsonDOF.maxTranslate, _maxTranslate);
    var _currentTranslate = osg.Vec3.copy(jsonDOF.currentTranslate, _currentTranslate);
    var _incrementTranslate = osg.Vec3.copy(jsonDOF.incrementTranslate, _incrementTranslate);
    
    var _minScale = osg.Vec3.copy(jsonDOF.minScale, _minScale);
    var _maxScale = osg.Vec3.copy(jsonDOF.maxScale, _maxScale);
    var _currentScale = osg.Vec3.copy(jsonDOF.currentScale, _currentScale);
    var _incrementScale = osg.Vec3.copy(jsonDOF.incrementScale, _incrementScale);
    
    var _multOrder;
    for(var i = 0; i < multOrder.length ; i++){
        if(jsonDOF.multOrder == multOrder[i]){
            _multOrder = jsonDOF.multOrder;
            i = multOrder.length;
        } else {
            _multOrder = "PRH";
        }
            
    }
    
    
    var _put = osg.Matrix.copy(jsonDOF.PutMatrix, _put);
    
    var _limitationFlags = jsonDOF.limitationFlags; 
    var _animationOn = jsonDOF.animationOn; 
    
    var _previousTraversalNumber;
    if(jsonDOF.previousTraversalNumber === undefined){
        _previousTraversalNumber = -1;
    } else {
        _previousTraversalNumber = jsonDOF.previousTraversalNumber;
    }
    
    var _previousTime;
    if(jsonDOF.previousTime === undefined){
        _previousTime = 0.0;
    } else {
        _previousTime = jsonDOF.previousTime;
    }
    
    var _increasingFlags;
    if(jsonDOF.increasingFlags === undefined){
        _increasingFlags = "0xffff";
    } else {
        _increasingFlags = jsonDOF.increasingFlags;
    }
    
    
//    if(_animationOn){
//        setNumChildrenRequiringUpdateTraversal(getNumChildrenRequiringUpdateTraversal()+1);
//    }
}

osgSim.DOFTransform.prototype = {
    getCurrentHPR: function(){
        return this._currentHPR;
    },
    setCurrentHPR: function(vec3){
        this._currentHPR = vec3;
        dirtyBound();
    }
}
(function(ADL){
    
    var debug = true;
    var log = function(message)
    {
        if (!debug) return false;
        try
        {
            console.log(message);
            return true;
        }
        catch(e){return false;}
    } 

    function PopcornVideo(player, comp) {
        var myplayer = player;
        var playerID = player.media.id;
        var firstQuartileHit = false;
        var halfwayHit = false;
        var thirdQuartileHit = false;
        var isTracking = true;
        var competency = comp;

        // Youtube videos don't have children
        var objectURI = player.media.children[0].src ? player.media.children[0].src : player.media.src;
        var videoActivity = {"id":objectURI, "definition":{"name": {"en-US":playerID}}};
        
        // Edit the actor inside of the wrapper or just include it here
        var actor = ADL.XAPIWrapper.lrs.actor ? ADL.XAPIWrapper.lrs.actor :
            {"account":{"name":"tester", "homePage":"uri:testaccount"}};

        // Play event
        myplayer.on("play", function(){
            var currentTime = myplayer.currentTime()
            // This if is a youtube workaround - when replaying youtube vids the roundTime is the same as the duration
            if (currentTime == Math.round(myplayer.duration())){
                log('youtube video ' + playerID + ' launched weird')
                startstuff(true)
            }
            // Playing after pause
            else if (currentTime != 0){
                log('video ' + playerID + ' resumed')
                startstuff(false)
            }
            // Normal start when vid is launched
            else{
                log('video ' + playerID + ' launched')
                startstuff(true)
            }
        });

        // Every second event
        myplayer.on("timeupdate", function(){
            var currentTime = myplayer.roundTime()
            // If stmt to catch specific times - the hits get reset to false when video ends
            if (!firstQuartileHit && currentTime == Math.round(myplayer.duration() * .25)){
                log('video ' + playerID + ' first point')
                firstQuartileHit = true
                middleStuff("firstquartile", currentTime)
            }
            else if (!halfwayHit && currentTime == Math.round(myplayer.duration() * .5)){
                log('video ' + playerID + ' half point')
                halfwayHit = true
                middleStuff("halfway", currentTime)
            }
            else if (!thirdQuartileHit && currentTime == Math.round(myplayer.duration() * .75)){
                log('video ' + playerID + ' third point')
                thirdQuartileHit = true
                middleStuff("thirdquartile", currentTime)
            }
        });

        // Pause event
        myplayer.on("pause", function(){
            var currentTime = myplayer.roundTime()
            // If stmt is a youtube workaround - youtube vids pause right before they end
            if (currentTime != Math.round(myplayer.duration())){
                log('video ' + playerID + ' paused')
                pauseStuff(currentTime)
            }
         });

        // Seeked event
        myplayer.on("seeked", function(){
            var currentTime = myplayer.roundTime()
            // If try to replay movie, instead of playing it fires seeked
            if (currentTime != 0){
                log('seeked ' + playerID + ' to ' + currentTime)
                seekStuff(currentTime)
            }
            // Youtube workaround - videos seek to 0 when replayed or launched
            else{
                log('seeked to 0s so really launched ' + playerID)
                startstuff(true)
                // Reset video quartile states
                firstQuartileHit = halfwayHit = thirdQuartileHit = false;
            }
        });

        // Ended event
        myplayer.on("ended", function(){
            log('video ' + playerID + ' ended')
            endStuff(myplayer.duration())
        });    

        function startstuff(launched){
            var stmt = {"actor":actor, "object": videoActivity}
            if (competency){
                stmt["context"] = {"contextActivities":{"other" : [{"id": "compID:" + competency}]}}
            }

            if (launched){
                stmt["verb"] = ADL.verbs.launched
            }
            else{
                var resumeTime = "PT" + myplayer.roundTime() + "S";
                stmt["verb"] = ADL.verbs.resumed
                stmt["result"] = {"extensions":{"resultExt:resumed":resumeTime}}
            }
            report(stmt);
        }

        function middleStuff(quartile, benchTime) {
            var benchObj = {"id":objectURI + "#" + quartile, "definition":{"name":{"en-US":playerID + "#" + quartile}}};
            var bench = "PT" + benchTime + "S";
            var extKey = "resultExt:" + quartile
            var result = {"extensions":{}};
            

            var stmt = {"actor":actor,
                    "verb":ADL.verbs.progressed,
                    "object":benchObj,
                    "result":result}
            var context = {"contextActivities":{"parent":[{"id": objectURI}]}};
            
            if (competency){
                context["contextActivities"]["other"] = [{"id": "compID:" + competency}]
            }
            stmt["context"] = context
            result["extensions"][extKey] = bench
            report(stmt);
        }

        function pauseStuff(pauseTime){
            var paused = "PT" + pauseTime + "S";
            var stmt = {"actor":actor, 
                    "verb":ADL.verbs.suspended,
                    "object":videoActivity, 
                    "result":{"extensions":{"resultExt:paused":paused}}}

            if (competency){
                stmt["context"] = {"contextActivities":{"other" : [{"id": "compID:" + competency}]}}
            }
            report(stmt);
        }

        function seekStuff(seekTime){
            var seeked = "PT" + seekTime + "S";
            var stmt = {"actor":actor, 
                    "verb":ADL.verbs.interacted,
                    "object":videoActivity, 
                    "result":{"extensions":{"resultExt:seeked": seeked}}}
            
            if (competency){
                stmt["context"] = {"contextActivities":{"other" : [{"id": "compID:" + competency}]}}
            }             
            report(stmt);
        }

        function endStuff(endTime) {
            var duration = "PT" + Math.round(endTime) + "S";
            var stmt = {"actor":actor, 
                    "verb":ADL.verbs.completed, 
                    "object":videoActivity, 
                    "result":{"duration":duration, "completion": true}}

            if (competency){
                stmt["context"] = {"contextActivities":{"other" : [{"id": "compID:" + competency}]}}
            }
            report(stmt);
            // Reset video quartile states
            firstQuartileHit = halfwayHit = thirdQuartileHit = false;
        }

        this.report = report;
        function report (stmt) {
            if (stmt) {
                stmt['timestamp'] = (new Date()).toISOString();
                if (isTracking) {
                    ADL.XAPIWrapper.sendStatement(stmt, function(){});
                }
                else {
                    log("would send this statement if 'isTracking' was true.");
                    log(stmt);
                }
            }
        }
    };

    // -- -- //
    var XAPIVideo = function() {
        this._videos = {};
    };

    XAPIVideo.prototype.addVideo = function(player, comp) {
        try{
            var playerID = player.media.id
            var v = new PopcornVideo(player, comp)
        }
        catch(e){
            throw "Cannot add video: " + e.message;
        }        
        this._videos[playerID] = v;
        return true;
    };

    XAPIVideo.prototype.getVideo = function(id) {
        try {
            return this._videos[id]
        }
        catch (e) {
            return {};
        }
    };

    XAPIVideo.prototype.getVideos = function() {
        var v = []
        for (var k in this._videos) {
            v.push(k);
        }
        return v;
    };

    ADL.XAPIVideo = new XAPIVideo();

}(window.ADL = window.ADL || {}));
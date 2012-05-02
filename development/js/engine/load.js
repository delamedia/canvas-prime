/*
Name: Loading Logic
Version: 1
Desc: Controls all file loading mechanisms and draws the loading screen while waiting.

Notes:
- Files are loading in so fast its impossible to tell if loading them in is locking up the entire page or not.
*/

var cp = cp || {};

cp.load = {
    active: true,
    count: 0,
    total: 0,
    init: function() {
        // Begin loading files
        this.getFiles();
        // Begin loading images (should fire draw when image files are added to total)
    },

    // Logic for drawing and displaying loading screen
    update: function() {
        // Create loading numbers string
        this.progress = this.count + ' / ' + this.total;
        
        // Create loading bar information
        this.progressPercent = (this.count / this.total).toFixed(2);
        
        // Count loaded objects
        if (this.count == this.total) {
            // turn off the animation
            this.active = false;
            
            // reset draw properties to prevent any Canvas draw conflicts
            // this.reset();
            
            // run the game
        }
    },
    
    // Literally draws all assets for loading, should be replaced if a user wants their own custom
    // drawing screen via re-writing cp.load.draw = function() { // code here };.
    draw: function() {
        // Sent font basics
        //cp.ctx.font = 'italic 400 12px/2 arial, sans-serif';
        
        // Background
        cp.ctx.fillStyle = '#000';
        cp.ctx.fillRect(0, 0, cp.core.width, cp.core.height);        
        
        // Loading text
        cp.ctx.fillStyle = '#fff';
        cp.ctx.font = '40px arial';
        cp.ctx.textAlign = 'center';
        cp.ctx.fillText('Loading...', cp.core.width / 2, cp.core.height / 2 - 50);
        
        // Asset count text
        cp.ctx.font = '20px arial';
        cp.ctx.fillText(this.progress, cp.width / 2, cp.height / 2 + 50);
        
        // Start loading bar background
        var offset = 100,
        barX = offset / 2, // Note: might break due to self reference
        barY = cp.core.height / 2 - 20,
        barWidth = cp.core.width - offset,
        barHeight = 40;
        
        cp.ctx.fillStyle = '#fff';
        cp.ctx.fillRect(barX, barY, barWidth, barHeight);        
        
        // Loading bar overlay (progress bar)
        offset = 5;
        barX = barX + offset;
        barY = barY + offset;
        barWidth = (barWidth - (offset * 2)) * this.progressPercent;
        barHeight = barHeight - (offset * 2);
        
        cp.ctx.fillStyle = '#00aaff';
        cp.ctx.fillRect(barX, barY, barWidth, barHeight);
    },
    
    // Setup and information for loading file assets
    htmlHead: document.getElementsByTagName('HEAD'),
    fileUrl: 'js/objects/',
    fileCount: 0,
    fileTotal: 0,
    
    getFiles: function() {        
        // Double check var objects is present with an array of file names to
        // load, or perform an emergency exit.
        if (typeof this.objects !== 'array') {
            console.log('Failure to load. No elements have been loaded into the engine. Please include an array of objects in cp.load.objects[\'example1\', \'example2\']');
            return false;
        }
        
        // Update total asset count
        this.total += this.objects.length;
        
        // Store the total number of objects to loop through
        this.fileTotal = this.objects.length;
        
        // Create all files
        this.fileCreate();
    },
    
    fileCreate: function() {
        var self = this;
        
        // Setup script
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = this.fileUrl + this.objects[this.fileCount] + '.js';
        
        // Declare onload rules
        script.onload = function() {
            // Increment counters here since the previous object is fully loaded
            self.fileCount++;
            self.count++;
            
            // Test for completion and exit if so
            if (self.fileCount < self.fileTotal)
                return true;
            
            // Refer back to this method upon completion
            self.fileCreate();
        };
        
        // Insert new document
        this.htmlHead[0].appendChild(script);
    },
    
    loadXmlHttp: new XMLHttpRequest(),
    imgUrl: 'images/',
    getImgs: function() {
        var self = this;
        
        // Prep XML HTTP request
        this.loadXmlHttp.open('GET', 'images.php',true);
        this.loadXmlHttp.send();
        
        // When request is complete
        this.loadXmlHttp.onreadystatechange = function() {
            if (self.loadXmlHttp.readyState==4 && self.loadXmlHttp.status==200) {
                // Prep data
                var images = JSON.parse(self.loadXmlHttp.responseText);        
                
                // Increment number of game items
                self.total += images.length;
                
                // Loop through all items
                // http://www.mennovanslooten.nl/blog/post/62
                for ( var i = images.length; i--; ) {
                    var img = new Image();
                    var imgName = images[i];
                    img.src = self.pathImg + images[i];
                    
                    img.onload = (function(val) {
                        // returning a function forces the load into another scope
                        return function() {
                            self.total++;
                        }
                    })(i);
                }
         �  }
        }
    }
};
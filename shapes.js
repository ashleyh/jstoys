
/*
    Copyright 2010 Ashley Hewson

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

// a thing a day #2 - sun 14 nov

addToy({
    name: "shapes",
    contributors: "ash",
    constructor: function(ctx, width, height) {
        var toy = this
        var data = ctx.createImageData(width,height)
        var count = new Array(width*height)

        for (var i = 0; i < width*height; i++) {
            count[i] = 0
        }

        function colour() {
            var colours = [
                [0xbb, 0xbb, 0xbb, 255],
                [0xbb, 0x22, 0x44, 255],
                [0x44, 0x22, 0xbb, 255],
                [0x22, 0x22, 0x22, 255]
            ]
            for (var i = 0; i < width*height; i++) {
                var c = colours[count[i] % colours.length]
                for (var j = 0; j < 4; j++) {
                    data.data[4*i + j] = c[j]
                }
            }
            ctx.putImageData(data, 0, 0)
        }

        
        function addCircle(x0,y0,r) {

            function line(x1,x2,y1) {
                if (y1 >= 0 && y1 < height) {
                    if (x1 < 0) { x1 = 0}
                    if (x2 >= width) { x2 = width -1 }
                    var i1 = y1*width + x1
                    var i2 = y1*width + x2
                    for (var i = i1; i <= i2; i++) {
                        count[i] ++
                    }
                }
            }

            line(x0-r,x0+r,y0)

            for (var dy = 1; dy <= r; dy++) {
                var dx = Math.round(Math.sqrt(r*r - dy*dy))
                line(x0-dx, x0+dx, y0-dy)
                line(x0-dx, x0+dx, y0+dy)
            }        
        }

        function addShape() {
            var x = Math.round(Math.random()*width)
            var y = Math.round(Math.random()*height)
            var r = Math.round(Math.random()*width/1.5)
            addCircle(x,y,r)
        }

        function go() {
            for (var i = 0; i < 7; i++) {
                addShape();
            }
            colour();
        }

        go();

        toy.clickHandler = function(e) { go(); }
    }
})

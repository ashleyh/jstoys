
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
            for (var y = 0; y < height; y++) {
                for (var x = 0; x < width; x++) {
                    var i = y*width + x
                    var dx = x-x0, dy = y-y0
                    if (dx*dx + dy*dy < r*r) {
                        count[i]++
                    }
                }
            }
        }

        function addShape() {
            var x = Math.random()*width
            var y = Math.random()*height
            var r = Math.random()*width/1.5
            addCircle(x,y,r)
        }

        toy.clickHandler = function(e) {
            console.log("shape")
            addShape()
            console.log("colour")
            colour()
            console.log("done")
        }
    }
})

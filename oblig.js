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

addToy({
    name: "oblig",
    contributors: "ash",
    constructor: function(ctx, width, height) {
        var toy = this

        var data = ctx.createImageData(width,height)
        var workUnits = []
        
        function render(ux,uy,uw,uh,vx,vy,vw,vh) {
            var nmax = 10
            for (var y = uy; y < uy+uh; y++) {
                var p = 4*(y*width + ux)
                for (var x = ux; x < ux+uw; x++) {
                    var cx = vx + vw * (x/width)
                    var cy = vy + vh * (y/height)
                    var zx = cx
                    var zy = cy
                    var n = nmax
                    while ((n>0) && (zx*zx + zy*zy < 2)) {
                        wx = zx*zx - zy*zy + cx
                        wy = 2*zx*zy + cy
                        zx = wx
                        zy = wy
                        n--
                    }
                    data.data[p+0] = 255*n/nmax
                    data.data[p+1] = 255*n/nmax
                    data.data[p+2] = 255*n/nmax
                    data.data[p+3] = 255
                    p += 4
                }
            }
        }

        function go() {
            if (workUnits.length > 0) {
                console.log(workUnits.length)
                workUnits.shift()()
                ctx.putImageData(data, 0, 0)
                window.setTimeout(go, 100)
            }
        }

        
        var vx = -2.0, vy = -2.0, vw = 4.0, vh = 4.0
        
        toy.clickHandler = function(e) {
            var ex = e.localX/width, ey = e.localY/height
            var px = vx + ex*vw, py = vy + ey*vh
            vw /= 2
            vh /= 2
            vx = px - vw/2
            vy = py - vh/2
            draw()
        }

        function draw() {
            workUnits = []
            var dx = width/10
            var dy = height/10
            for (x = 0; x < width; x += dx) {
                for (y = 0; y < height; y += dy) {
                    (function(x0,y0)  {
                        workUnits.push(
                            function() { render(x0,y0,dx,dy,vx,vy,vw,vh); }
                        )
                    })(x,y)
                }
            }
            go()
        }

        draw()
    }
})

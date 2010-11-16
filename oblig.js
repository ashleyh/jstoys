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
        
        function render(ux,uy,uw,uh,vx,vy,vw,vh,gr) {
            var nmax = 255
            for (var y = uy; y < uy+uh; y++) {
                var p = 4*(y*width + ux)
                for (var x = ux; x < ux+uw; x++) {
                    if (x%gr != 0) {
                        var q = p - 4
                        data.data[p+0] = data.data[q+0]
                        data.data[p+1] = data.data[q+1]
                        data.data[p+2] = data.data[q+2]
                        data.data[p+3] = data.data[q+3]
                    } else if (y%gr != 0) {
                        var q = p - 4*width
                        data.data[p+0] = data.data[q+0]
                        data.data[p+1] = data.data[q+1]
                        data.data[p+2] = data.data[q+2]
                        data.data[p+3] = data.data[q+3]
                    } else {
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
                    }
                    p += 4
                }
            }
            ctx.putImageData(data, 0, 0, ux, uy, uw, uh)
        }

        function worker() {
            if (workUnits.length > 0) {
                workUnits.shift()()
                return 1
            } else {
                return -1
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
            var grs = [8,4,2,1]
            for (var i in grs) {
                for (var x = 0; x < width; x += dx) {
                    for (var y = 0; y < height; y += dy) {
                        (function(x0,y0,gr)  {
                            workUnits.push(
                                function() { render(x0,y0,dx,dy,vx,vy,vw,vh,gr); }
                            )
                        })(x,y,grs[i])
                    }
                }
            }
            startWorker(worker)
        }

        draw()
    }
})

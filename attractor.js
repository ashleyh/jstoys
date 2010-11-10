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
    name: "attractor",
    contributors: "ash",
    constructor: function(ctx, width, height) {
        var toy = this

        var vx = -2.0, vy = -2.0, vw = 4.0, vh = 4.0
        var data 
        var x = 0.0
        var y = 0.0
        var a = []
        var iterations, fills

        function init() {
            a = []
            for (var i = 0; i < 12; i++) {
                a.push(2*Math.random()-1) //randomInt(-12,24)/10)
            }
            data = ctx.createImageData(width,height)
            iterations = 0
            fills = 0
//          x = Math.random()*vw + vx
//          y = Math.random()*vh + vy
            x = 0
            y = 0
        }

        function go() {
            
            var N = 10000

            for (var i = 0; i < N; i++) {
                var u = Math.round((x-vx)*width/vw)
                var v = Math.round((y-vy)*height/vh)

                //console.log(x,y,a,u,v)

                var p = 4*(v*width + u)
                if (data.data[p+3] == 0) {
                    data.data[p+0] = 255
                    data.data[p+1] = 255
                    data.data[p+2] = 255
                    data.data[p+3] = 255
                    fills ++
                }
                var d = 15
                if (data.data[p+0] > d) {
                    data.data[p+0] -= d
                } else if (data.data[p+1] > d) {
                    data.data[p+1] -= d
                } else if (data.data[p+2] > d) {
                    data.data[p+2] -= d
                }
                data.data[p+3] = 255

                iterations ++


                var x0 = a[0] + a[1]*x*y + (a[2]+a[3]*x)*x + (a[4]+a[5]*y)*y
                var y0 = a[6] + a[7]*x*y + (a[8]+a[9]*x)*x + (a[10]+a[11]*y)*y
                x = x0; y = y0
            }

            var fillRate = fills/iterations

            if (fillRate < 0.001) { init();}

            ctx.putImageData(data, 0, 0)
            /* i reckon this will allow the browser
               to deal with other events, and do that
               horrible "this script is taking too long"
               thing */
                window.setTimeout(go, 1)
        }

        init()
        go()
    }
})

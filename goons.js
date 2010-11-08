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
    name: "goons",
    contributors: "ash",
    constructor: function (ctx, width, height) {
        function Point(x,y) {
            var point = this

            point.x = x
            point.y = y

            point.move = function(bearing,dist) {
                var x = point.x + dist*Math.cos(bearing)
                var y = point.y + dist*Math.sin(bearing)
                return new Point(x,y)
            }

            point.reduce = function(width,height) {
                while (point.x >= width) { point.x -= width; }
                while (point.x < 0) { point.x += width; }
                while (point.y >= height) { point.y -= height; }
                while (point.y < 0) { point.y += height; }
                assert( !isNaN(point.x) && !isNaN(point.y) )
            }

            point.toricSquareDistance = function(other,width,height) {
                // i think it's assumed that the two points are reduced

                var x1 = point.x, y1 = point.y
                var x2 = other.x, y2 = other.y
                var minDist = (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2)

                for (var i = -1; i <= 1; i += 1) {
                    for (var j = -1; j <= 1; j += 1) {
                        var x3 = x2+i*width, y3 = y2+j*height
                        var d = (x1-x3)*(x1-x3) + (y1-y3)*(y1-y3)
                        if (d<minDist) { minDist = d }
                    }
                }

                return minDist
            }
        }

        var app = this

        app.goons = [];
        
        var N = 100;
        var interestMin = 100, interestMax = 200;
        var bearingMax = 100;
        var control = 5

        for (var i = 0; i < N; i++) {
            app.goons.push({
                pt: new Point(randomInt(0,width),randomInt(0,height)), //new Point(0,0)
                interest: randomInt(interestMin,interestMax),
                bearing: randomInt(0,bearingMax),
                target: (i+1)%N, //randomInt(0,N-1),
                avoid: (N+i-1)%N, //randomInt(0,N-1),
                speed: 1.0 + randomInt(0,20)/10.0
            })
        }

        app.draw = function() {
            ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
            ctx.fillRect(0,0,width,height)
            for (var i in app.goons) {
                goon = app.goons[i]
                if (i < 3) {
                    ctx.fillStyle= ["#f00","#0f0","#00f"][i]
                } else {
                    ctx.fillStyle = "#000"
                }
                ctx.fillRect(goon.pt.x-1, goon.pt.y-1, 2, 2)
                /*ctx.beginPath()
                ctx.moveTo(goon.pt.x, goon.pt.y)
                target = app.goons[goon.target]
                ctx.lineTo(target.pt.x, target.pt.y)
                ctx.strokeStyle="red"
                ctx.stroke()*/
            }
        }
        
        app.update = function () {
            for (var i in app.goons) {
                var goon = app.goons[i]
                /*goon.interest -= 1
                if (goon.interest <= 0) {
                    //goon.target = randomInt(0, N-1)
                    goon.avoid = randomInt(0, N-1)
                    goon.interest = randomInt(interestMin, interestMax)
                }*/
                var target = app.goons[goon.target]
                var avoid = app.goons[goon.avoid]
                var bearings = []
                for (var db = -control; db <= control; db += 1) { bearings.push(goon.bearing+db); }
                var sel = select(
                    bearings,
                    function (bearing) { 
                        return goon.pt.move(bearing*2.0*Math.PI/bearingMax, goon.speed); 
                    },
                    function (pt) {
                        //return -pt.squareDistance(target.pt)
                        return (pt.toricSquareDistance(avoid.pt, width, height)
                                   - pt.toricSquareDistance(target.pt, width, height))
                    }
                );
                goon.bearing = sel.key;
                goon.pt = sel.val;
                goon.pt.reduce(width, height)                            
            }
        }
        
        app.tick = function() {    
            app.update()
            app.draw()
        }
    }
})

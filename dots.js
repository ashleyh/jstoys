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

// a thing a day #1 - sat 13 nov

addToy({
    name: "dots",
    contributors: "ash",
    constructor: function (ctx, width, height) {
        var app = this

        function Bouncer(x,y,dx,dy) {
            var bouncer = this
            bouncer.x = x
            bouncer.y = y
            bouncer.dx = dx
            bouncer.dy = dy
            bouncer.move = function () {
                function sign(k) {
                    if (k < 0) {
                        return -1
                    } else if (k > 0) {
                        return 1
                    } else {
                        return 0
                    }
                }
                function resign(k,s) {
                    if (sign(k) == sign(s)) {
                        return k
                    } else {
                        return -k
                    }
                }
                if (bouncer.x < 0) {
                    bouncer.dx = resign(bouncer.dx, 1)
                }
                if (bouncer.x > width) {
                    bouncer.dx = resign(bouncer.dx, -1)
                }
                if (bouncer.y < 0) {
                    bouncer.dy = resign(bouncer.dy, 1)
                }
                if (bouncer.y > height) {
                    bouncer.dy = resign(bouncer.dy, -1)
                }
                bouncer.x += bouncer.dx
                bouncer.y += bouncer.dy
            }
        }

        var bouncers = []

        for (var i = 0; i < 20; i++) {
            var x = Math.random() * width
            var y = Math.random() * height
            var t = Math.random() * 2 * Math.PI
            var v = 4 + (Math.random() * 2) 
            var dx = v*Math.cos(t)
            var dy = v*Math.sin(t)
            bouncers.push(new Bouncer(x,y,dx,dy))
        }


        function circle(x,y,r) {
            ctx.arc(x,y,r,0,2*Math.PI,true)
        }

        var res = 20
        var size = width/res

        app.draw = function() {
            ctx.fillStyle = "white"
            ctx.fillRect(0,0,width,height)
            ctx.fillStyle = "black"
            for (var i = 0; i < res; i++) {
                for (var j = 0; j < res; j++) {
                    var x = (i+0.5)*size, y = (j+0.5)*size
                    var defx = 0, defy = 0
                    for (var k in bouncers) {
                        var b  =bouncers[k]
                        var dx = x - b.x, dy = y - b.y
                        var r = Math.sqrt(dx*dx + dy*dy)
                        if (r < size/2) { r = size/2; }
                        defx += 10*dx/r
                        defy += 10*dy/r
                    }
                    //console.log(defx,defy)
                    ctx.beginPath()
                    circle(x+defx, y+defy, size/4)
                    ctx.closePath()
                    ctx.fill()
                }
            }

            for (var i in bouncers) {
             /*       ctx.beginPath()
                    circle(bouncers[i].x, bouncers[i].y, size/4)
                    ctx.closePath()
                    ctx.fill() */
            }
        }
        
        app.update = function () {
            for (var i in bouncers) {
                bouncers[i].move()
            }
        }
        
        app.tick = function() {    
            app.update()
            app.draw()
        }
    }
})

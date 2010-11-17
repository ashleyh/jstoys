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

// a thing a day #5 - wed 17 nov

addToy({
    name: "physics1",
    contributors: "ash",
    constructor: function(ctx, width, height) {
        function Circle(x0,y0,r0) {
            var circle = this
            circle.draw = function () {
                ctx.beginPath()
                ctx.arc(x0,y0,r0,0,2*Math.PI,true)
                ctx.stroke()
            }
            circle.collisionNormal = function(x,y) {
                var dx = x-x0
                var dy = y-y0
                var rr = dx*dx + dy*dy
                if (rr < r0*r0) {
                    var r = Math.sqrt(rr)
                    return [dx/r, dy/r]
                } else {
                    return null
                }
            }
        }


        var toy = this
        var particles = []
        var scene = []
        var g = 0.1

        for (var i = 0; i < 9; i ++) {
            var x = Random.discrete.uniform(0,width)
            var y = Random.discrete.uniform(height/3,height)
            var r = Random.discrete.uniform(width/20, width/8)
            scene.push(new Circle(x,y,r))
        }

        function randomColour() {
            var h = Random.discrete.uniform(0,359)
            return "hsl("+h+", 50%, 50%)"
        }

        function addParticle() {
            var x = Random.discrete.uniform(100,width-100)
            var y = 0
            var u = Random.discrete.uniform(-2,2)
            var v = 0
            var c = randomColour()
            particles.push([x,y,u,v,c])
        }


        for (var i = 0; i < 50; i++) { addParticle() }

        toy.tick = function() {
            ctx.fillStyle = "rgba(255,255,255,0.1)"
            ctx.fillRect(0,0,width,height)
            ctx.lineCap = "square"
            
            
            var toPrune = 0

            for (var i in particles) {
                var p = particles[i]
                var x0 = p[0], y0 = p[1]
                var u = p[2], v = p[3]

                if (y0 < height) {
                    var x1 = x0 + u, y1 = y0 + v
                    for (var j in scene) {
                        var o = scene[j]
                        var n = o.collisionNormal(x1,y1)
                        if (n != null) {
                            var d = -2*(u*n[0] + v*n[1])
                            u += d*n[0]
                            v += d*n[1]
                        }
                    }
                    v += g
                    x1 = x0 + u, y1 = y0 + v
                    p[0] = x1; p[1] = y1; p[2] = u; p[3] = v
                    ctx.beginPath()
                    ctx.strokeStyle = p[4]
                    ctx.moveTo(x0,y0)
                    ctx.lineTo(x1,y1)
                    ctx.stroke()
                } else {
                    toPrune++
                }
            }

            if (toPrune > particles.length/4) {
                var oldParticles = particles
                particles = []
                for (var i in oldParticles) {
                    var p = oldParticles[i]
                    if (p[1] < height) {
                        particles.push(p)
                    }
                }
            }

            if (particles.length < 50) {
                addParticle()
            }


            ctx.strokeStyle = "black" 
            for (var i in scene) {
                scene[i].draw()
            }
        }
    }
})

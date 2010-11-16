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

// a thing a day #4 - tue 16 nov

addToy({
    name: "sprout",
    contributors: "ash",
    constructor: function(ctx, width, height) {
        var toy = this
        var sprouts = []

        function randomColour() {
            var h = Random.discrete.uniform(0,359)
            return "hsl("+h+", 50%, 50%)"
        }

        function addSprout() {
            var sprout = {}
            sprout.x = Math.random()*width
            sprout.y = Math.random()*height
            sprout.v = Math.random()*10 + 5
            sprout.a = -0.05 - 0.2*Math.random()
            sprout.t = Math.random()*2*Math.PI
            sprout.o = -0.1
            sprout.colour = randomColour()
            sprouts.push(sprout)
        }

        function splitSprout(s1) {
            var s2 = {}
            s2.x = s1.x
            s2.y = s1.y
            s2.v = s1.v
            s2.a = s1.a
            s2.t = s1.t
            s2.o = -s1.o
            s2.colour = s1.colour
            sprouts.push(s2)
        }

        for (var i = 0; i < 5; i++) { addSprout() }

        toy.tick = function() {
            ctx.fillStyle = "rgba(0,0,0,0.05)"
            ctx.fillRect(0,0,width,height)
            ctx.lineCap = "square"
            var toPrune = 0
            for (var i in sprouts) {
                var sprout = sprouts[i]
                var x0 = sprout.x,  y0 = sprout.y
                if (sprout.v > 0.1) {
                    sprout.x += sprout.v * Math.cos(sprout.t)
                    sprout.y += sprout.v * Math.sin(sprout.t)
                    sprout.v += sprout.a
                    sprout.t += sprout.o
                    ctx.lineWidth = sprout.v
                    ctx.strokeStyle = sprout.colour
                    ctx.beginPath()
                    ctx.moveTo(x0,y0)
                    ctx.lineTo(sprout.x,sprout.y)
                    ctx.stroke()
                    if (Math.random() < 0.05 && sprouts.length < 100) {
                        splitSprout(sprout)
                    }
                } else {
                    toPrune ++
                }
            }
            if (toPrune > sprouts.length/4) {
                var oldSprouts = sprouts
                sprouts = []
                for (var i in sprouts) {
                    var sprout = sprouts[i]
                    if (sprout.v > 0) {
                        sprouts.push(sprout)
                    }
                }
            }
            if (sprouts.length < 5) {
                addSprout()
            }
            console.log(sprouts.length)
        }
    }
})

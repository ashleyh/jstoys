
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

// a thing a day #3 - mon 15 nov

addToy({
    name: "truchet",
    contributors: "ash",
    constructor: function(ctx, width, height) {
        var toy = this

        var size = 15


        function drawTiling() {
            var tiling = new Array(size*size)
            var colouring = new Array((size+1)*(size+1)) 

            //initialise tiling
            for (var i = 0; i < tiling.length; i++) {
                if (Math.random() < 0.5) {
                    tiling[i] = 0 // ne & sw
                } else {
                    tiling[i] = 1 // nw & se
                }
            }

            //initialise colouring
            for (var i = 0; i < colouring.length; i++) {
                colouring[i] = null
            }
            

            var w = width/size, h = height/size
            var r = w/2

            function circle(x,y) {
                var ic = y*(size+1) + x
                ctx.fillStyle = colouring[ic]
                ctx.beginPath()
                if (0) {
                    ctx.arc(x*w,y*h,r,0,2*Math.PI,true)
                } else {
                    var x0 = x*w, y0 = y*h
                    ctx.moveTo(x0,y0-r)
                    ctx.lineTo(x0+r,y0)
                    ctx.lineTo(x0,y0+r)
                    ctx.lineTo(x0-r,y0)
                    ctx.closePath()
                }
                ctx.fill()
                //ctx.stroke()
            }

            function propagateColour(x0,y0) {
                var stack = []

                function touch(x,y) {
                    stack.push([x-1,y-1])
                    stack.push([x-1,y])
                    stack.push([x,y-1])
                    stack.push([x,y])
                }

                touch(x0,y0)

                while (stack.length > 0) {
                    var t = stack.pop()
                    var x = t[0], y = t[1]
                    
                    //make sure the end colours of the x,y-tile match
                    if (x >= 0 && x < size && y >= 0 && y < size) {
                        var it = y*size + x, tx1, tx2
                        if (tiling[it] == 0) {
                            tx1 = x; tx2 = x+1
                        } else {
                            tx1 = x+1; tx2 = x
                        }
                        var ic1 = y*(size+1) + tx1
                        var ic2 = (y+1)*(size+1) + tx2
                        if (colouring[ic1] != null &&
                            colouring[ic2] == null) {
                            colouring[ic2] = colouring[ic1]
                            touch(tx2, y+1)
                        }
                        if (colouring[ic2] != null &&
                            colouring[ic1] == null) {
                            colouring[ic1] = colouring[ic2]
                            touch(tx1, y)
                        }
                    }
                }
            }


            var region = 0;
            var colours = ["#24b","#2b4","#42b","#4b2", "#b24","#b42"]
            for (var x = 0; x <= size; x++) {
                for (var y = 0; y <= size; y++) {
                    var ic = y*(size+1) + x
                    if (colouring[ic] == null) {
                        colouring[ic] = colours[region%colours.length];
                        region++;
                        propagateColour(x,y)
                    }
                }
            }
            console.log(region)

            for (var x = 0; x < size; x++) {
                for (var y = 0; y < size; y++) {
                    var it = y*size + x
                    ctx.save()
                    ctx.beginPath()
                    ctx.rect(x*w,y*h,w,h)
                    ctx.clip()
                    var x1, x2
                    if (tiling[it] == 0) {
                        x1 = x+1; x2 = x
                    } else {
                        x1 = x; x2 = x+1   
                    }
                    var ic = y*(size+1) + x2
                    ctx.fillStyle = colouring[ic]
                    ctx.fillRect(x*w,y*h,w,h)
                    circle(x1,y)
                    circle(x2,y+1)
                    ctx.restore()
                }
            }

        }

        function go() {
            ctx.fillStyle = "white"
            ctx.fillRect(0,0,width,height)
            drawTiling()
        }

        go()
        toy.clickHandler = function(e) { go(); }
    }
})

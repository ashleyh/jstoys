/*
    Copyright 2011 Ashley Hewson

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
    name: "grapher",
    contributors: "ash",
    constructor: function (ctx, width, height) {

        function goal(x, y) {
            var x1 = x.translate(-1)
            var y1 = y.translate(-1)
            var x2 = x.translate(1)
            var y2 = y.translate(1)
            return x1.mul(x1).add(y1.mul(y1)).inv().add(
                x2.mul(x2).add(y2.mul(y2)).inv().scale(-2)
                )
        }

        function Interval(min, max) {
            this[0] = min
            this[1] = max
        }

    
        Interval.prototype = {

            inv: function() {
                if (this.contains(0)) {
                    return Singularity
                } else {
                    var x = 1 / this[0]
                    var y = 1 / this[1]
                    return new Interval(
                        Math.min(x, y),
                        Math.max(x, y)
                        )
                }
            },


            mul: function(other) {
                var xx = this[0] * other[0]
                var xy = this[0] * other[1]
                var yx = this[1] * other[0]
                var yy = this[1] * other[1]
                return new Interval(
                    Math.min(xx, xy, yx, yy),
                    Math.max(xx, xy, yx, yy)
                    )
            },

            add: function(other) {
                if (other === Singularity) {
                    return Singularity
                } else {
                    return new Interval(
                        this[0] + other[0],
                        this[1] + other[1]
                        )
                }
            },


            translate: function (d) {
                return new Interval(
                    this[0] + d,
                    this[1] + d
                    )
            },

            scale: function (k) {
                var x = this[0] * k
                var y = this[1] * k
                return new Interval(
                    Math.min(x, y),
                    Math.max(x, y)
                    )
            },

            randomElement: function () {
                return this[0] + (this[1] - this[0])*Math.random()
            },

            contains: function (x) {
                return (this[0] <= x) && (x <= this[1])
            },

            containsInteger: function () {
                return Math.ceil(this[0]) <= Math.floor(this[1])
            },

            /* is there an integer n with this.contains(an + b) */
            containsLC: function(a, b) {
                return Math.ceil((this[0] - b)/a) <=
                    Math.floor((this[1] - b)/a)
            }

        }
        
        Singularity = new Interval(-Infinity, Infinity)
        
        function randomInterval() {
            var i = new Interval(-10000000, 10000000)
            var x = i.randomElement()
            var y = i.randomElement()
            return new Interval(
                Math.min(x, y),
                Math.max(x, y)
                )
        }

            

        function test() {
            console.log("testing intervals")
            for (var i = 0; i < 100; i++) {
                var i1 = randomInterval()
                var i2 = randomInterval()
                for (var j = 0; j < 1000; j++) {
                    var x1 = i1.randomElement()
                    var x2 = i2.randomElement()
                
                    assert( i1.add(i2).contains(x1 + x2) )
                    assert( i1.mul(i2).contains(x1 * x2) )
                }
            }
            console.log("all good!")
        }


        function Tree(x, y, children) {
            this.x = x
            this.y = y
            this.im = goal(
                x.scale(4.0/width).translate(-2.0),
                y.scale(4.0/width).translate(-2.0)
                )
            this.children = children
        }

        Tree.prototype.draw = function(remainder) {
            var x = this.x
            var y = this.y
            var im = this.im
            var xlen = x[1] - x[0]
            var ylen = y[1] - y[0]

            if (im.containsLC(1.0, remainder)) {
                var cs = this.children
                for (var i = 0; i < cs.length; i++) {
                    var c = cs[i]
                    if (c === null) {
                    } else {
                        c.draw(remainder)
                    }
                }
 
            }
            ctx.strokeRect(x[0], y[0], xlen, ylen)
        }

        function split(x, y) {
            var xlen = x[1] - x[0]
            var ylen = y[1] - y[0]
            var xm = Math.floor((x[0]+x[1]) / 2)
            var ym = Math.floor((y[0]+y[1]) / 2)
//            if (xlen > ylen) {
                var x1 = new Interval(x[0], xm)
                var x2 = new Interval(xm, x[1])
//                return [x1, y, x2, y]
//            } else {
                var y1 = new Interval(y[0], ym)
                var y2 = new Interval(ym, y[1])
//                return [x, y1, x, y2]
//            }
            return [x1, x2, y1, y2]
        }

        function buildTree(x, y, depth) {
            if (depth < 0) {
                return null
            } else {
                var s = split(x, y)
                return new Tree(
                    x, y,[
                    buildTree(s[0], s[2], depth - 1),
                    buildTree(s[0], s[3], depth - 1),
                    buildTree(s[1], s[2], depth - 1),
                    buildTree(s[1], s[3], depth - 1)
                    ])
            }
        }

            function test(x1, y1, x2, y2) {
                var ix = (new Interval(x1, x2)).scale(4.0/width).translate(-2.0)
                var iy = (new Interval(y1, y2)).scale(4.0/height).translate(-2.0)
                return goal(ix, iy)
            }

        var factor = 60

        var lores = new Array(height/factor)

        for (var y = 0; y < height/factor; y++) {
            lores[y] = new Array(width/factor)
            for (var x = 0; x < width/factor; x++) {
                lores[y][x] = test(x, y, x+factor, y+factor)
            }
        }

        var hires = new Array(height)

        for (var y = 0; y < height; y++) {
            hires[y] = new Array(width)
            for (var x = 0; x < width; x++) {
                hires[y][x] = test(x, y, x+1, y+1)
            }
        }




/*        var lores = new Array((width/factor)*(height/factor))
        var hires = new Array(width*height)

        for (var i = 0; i < width; i++) {
            for (var j = 0; j < height; j++) {
                var x = (new Interval(i, i+1)).scale(4.0/width).translate(-2.0)
                var y = (new Interval(j, j+1)).scale(4.0/height).translate(-2.0)
                hires[
*/

        var remainder = 0.0

        var root = buildTree(
            new Interval(0, width),
            new Interval(0, height),
            6
            )

        this.tick = function() {
            ctx.fillStyle = "white"
            ctx.fillRect(0, 0, width, height)
            ctx.strokeStyle = "black"
  //          root.draw(remainder)


            var data = ctx.getImageData(0,0,width,height)

            for (var xl = 0; xl < width; xl += factor) {
                for (var yl = 0; yl < height; yl += factor) {
                    console.log(lores[yl/factor][xl/factor])
                    if (lores[yl/factor][xl/factor].containsLC(1.0, remainder)) {
                        for (var xh = 0; xh < factor; xh++) {
                            for (var yh = 0; yh < factor; yh++) {
                                if (hires[yl+yh][xl+xh].containsLC(1.0, remainder)) {
                                    i = (yl+yh)*width + xl + xh
                                    data.data[4*i+0] = 0
                                    data.data[4*i+1] = 0
                                    data.data[4*i+2] = 0
                                    data.data[4*i+3] = 255
                                }
                            }
                        }
                    }
                 }
             }

            ctx.putImageData(data, 0, 0)

/*            var trees = [root]

            while (trees.length > 0) {
                var tree = trees.pop()
                var x = tree.x
                var y = tree.y
                if (tree.child1 !== null) {
                    trees.push(tree.child1)
                    trees.push(tree.child2)
                } else {
                    ctx.strokeRect(x.min, y.min, x.max-x.min, y.max-y.min)
                }
            } */

            remainder += 0.1
            if (remainder > 1.0) { remainder -= 1.0 }
        }           
    }
})

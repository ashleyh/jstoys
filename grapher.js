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
            this.min = min
            this.max = max
            this.length = max - min
        }

        Singularity = {
            add: function(other) {
                return Singularity
            },

            scale: function(k) {
                return Singularity
            },

            containsLC: function (k) {
                return true
            },

            finite: false
        }

        Interval.prototype = {
            finite: true,

            inv: function() {
                if (this.contains(0)) {
                    return Singularity
                } else {
                    var x = 1 / this.min
                    var y = 1 / this.max
                    return new Interval(
                        Math.min(x, y),
                        Math.max(x, y)
                        )
                }
            },


            mul: function(other) {
                var xx = this.min * other.min
                var xy = this.min * other.max
                var yx = this.max * other.min
                var yy = this.max * other.max
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
                        this.min + other.min,
                        this.max + other.max
                        )
                }
            },


            translate: function (d) {
                return new Interval(
                    this.min + d,
                    this.max + d
                    )
            },

            scale: function (k) {
                var x = this.min * k
                var y = this.max * k
                return new Interval(
                    Math.min(x, y),
                    Math.max(x, y)
                    )
            },

            randomElement: function () {
                return this.min + (this.max - this.min)*Math.random()
            },

            contains: function (x) {
                return (this.min <= x) && (x <= this.max)
            },

            containsInteger: function () {
                return Math.ceil(this.min) <= Math.floor(this.max)
            },

            /* is there an integer n with this.contains(an + b) */
            containsLC: function(a, b) {
                return Math.ceil((this.min - b)/a) <=
                    Math.floor((this.max - b)/a)
            }

        }
        
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


        function Tree(x, y) {
            this.x = x
            this.y = y
            this.im = goal(
                x.scale(4.0/width).translate(-2.0),
                y.scale(4.0/width).translate(-2.0)
                )
            this.child1 = null
            this.child2 = null
        }

        Tree.prototype.update = function(remainder) {
            var x = this.x
            var y = this.y
            var im = this.im
            if (im.containsLC(1.0, remainder) &&
                (x.length > 4 || y.length > 4)) {

                if (this.child1 === null || this.child2 === null ) {

                    var xm = Math.floor((x.min+x.max) / 2)
                    var ym = Math.floor((y.min+y.max) / 2)
                    if (x.length > y.length) {
                        var x1 = new Interval(x.min, xm)
                        var x2 = new Interval(xm, x.max)
                        this.child1 = new Tree(x1, y)
                        this.child2 = new Tree(x2, y)
                    } else {
                        var y1 = new Interval(y.min, ym)
                        var y2 = new Interval(ym, y.max)
                        this.child1 = new Tree(x, y1)
                        this.child2 = new Tree(x, y2)
                    }

                }

                this.child1.update(remainder)
                this.child2.update(remainder)


            } else {
                this.child1 = null
                this.child2 = null
            }
            ctx.strokeRect(x.min, y.min, x.max-x.min, y.max-y.min)
        }


        var remainder = 0.0

        var root = new Tree(
            new Interval(0, width),
            new Interval(0, height)
            )

        this.tick = function() {
            ctx.fillStyle = "white"
            ctx.fillRect(0, 0, width, height)
            ctx.strokeStyle = "black"

            root.update(remainder)

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
